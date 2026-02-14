import { GameSetupData, LoadData, PlayerSetupData, UnitLoadData } from "../../shared/bulider";
import { EraData, GameData, GeneralGameData, PosData, ResourceData, UnitCreationData, UnitData } from "../../shared/types";
import { emitDeleteUnits, emitSpawnUnit } from "../../shared/routes";
import { removeOptions } from "../../client/main";

const ZOOM_FACTOR = 1.1;
const MIN_ZOOM = 2;
const MAX_ZOOM = 40;
const EDGE_SCROLL_MARGIN = 30;
const EDGE_SCROLL_SPEED = 0.4;
const KEY_SCROLL_SPEED = 0.5;
const MINIMAP_MAX_DIM = 180;

export class GameScreen {
    public div = document.getElementById("gameScreen")!;
    public canvas = document.getElementById('game') as HTMLCanvasElement;
    public canvasContainer = document.getElementById('canvasContainer') as HTMLDivElement;
    public controls = document.getElementById("controls") as HTMLDivElement;
    public resourceLabel = document.getElementById('resourceLabel') as HTMLLabelElement;
    public heartProgress = document.getElementById('heartProgress') as HTMLProgressElement;
    public unitSelect = document.getElementById('unitSelect') as HTMLSelectElement;
    public unitInfoLabel = document.getElementById('unitInfoLabel') as HTMLLabelElement;
    public unitInfoTooltip = document.getElementById('unitInfoTooltip') as HTMLSpanElement;
    public unitCostLabel = document.getElementById('unitCostLabel') as HTMLLabelElement;
    public unitCountLabel = document.getElementById('unitCountLabel') as HTMLLabelElement;
    public upgradeButton = document.getElementById('upgradeButton') as HTMLButtonElement;
    public eraNameLabel = document.getElementById('eraNameLabel') as HTMLLabelElement;
    public nextEraLabel = document.getElementById('nextEraLabel') as HTMLLabelElement;
    public modeIndicator = document.getElementById('modeIndicator') as HTMLSpanElement;
    public minimapCanvas = document.getElementById('minimap') as HTMLCanvasElement;
    public minimapCtx : CanvasRenderingContext2D = this.minimapCanvas.getContext('2d')!;
    public ctx : CanvasRenderingContext2D = this.canvas.getContext('2d')!;

    // Camera state
    private cameraX : number = 0; // top-left of viewport in tile coords
    private cameraY : number = 0;
    private zoom : number = 10; // pixels per tile
    private boardWidth : number = 0;
    private boardHeight : number = 0;

    // Panning state
    private isPanning : boolean = false;
    private panLastX : number = 0;
    private panLastY : number = 0;

    // Mouse position for edge scrolling
    private mouseScreenX : number = 0;
    private mouseScreenY : number = 0;

    // Minimap dragging
    private isMinimapDragging : boolean = false;

    public get SIZE() : number { return this.zoom; }

    private isDelete : boolean = false
    private bg : HTMLImageElement = new Image();
    private bgPattern : CanvasPattern | null = null;
    private images : Map<string, HTMLImageElement> = new Map<string, HTMLImageElement>();

    private pressedKeys : Set<string> = new Set<string>();
    private hotKeys : Map<string, UnitCreationData> = new Map<string, UnitCreationData>();

    get viewportWidthTiles() : number { return this.canvas.width / this.zoom; }
    get viewportHeightTiles() : number { return this.canvas.height / this.zoom; }

    constructor(private socket : any) {
      this.unitSelect.onchange = () => {
        let cost = this.getUnitSelect().cost
        this.unitCostLabel.innerText = this.formatResources(cost);
        this.unitInfoTooltip.textContent = this.getUnitSelect().blurb;
      }

      this.bg.src = '/bg.png';
      this.bg.onload = () => {
        this.bgPattern = this.ctx.createPattern(this.bg, 'repeat');
      };

      this.canvas.addEventListener('click', (event) => {this.clickFn(event)});
      document.addEventListener('keydown', (event) => this.handleKeydown(event));
      document.addEventListener('keyup', (event) => this.handleKeyup(event));

      // Scroll-to-zoom
      this.canvas.addEventListener('wheel', (event) => {
        event.preventDefault();
        const rect = this.canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;

        // Game-world coord under mouse before zoom
        const worldX = this.cameraX + mouseX / this.zoom;
        const worldY = this.cameraY + mouseY / this.zoom;

        // Adjust zoom
        if (event.deltaY < 0) {
          this.zoom = Math.min(MAX_ZOOM, this.zoom * ZOOM_FACTOR);
        } else {
          this.zoom = Math.max(MIN_ZOOM, this.zoom / ZOOM_FACTOR);
        }

        // Adjust camera so the same world coord stays under the cursor
        this.cameraX = worldX - mouseX / this.zoom;
        this.cameraY = worldY - mouseY / this.zoom;
        this.clampCamera();
      }, { passive: false });

      // Right-click drag to pan
      this.canvas.addEventListener('mousedown', (event) => {
        if (event.button === 2) {
          this.isPanning = true;
          this.panLastX = event.clientX;
          this.panLastY = event.clientY;
        }
      });

      window.addEventListener('mousemove', (event) => {
        // Track mouse position for edge scrolling
        const rect = this.canvas.getBoundingClientRect();
        this.mouseScreenX = event.clientX - rect.left;
        this.mouseScreenY = event.clientY - rect.top;

        if (this.isPanning) {
          const dx = event.clientX - this.panLastX;
          const dy = event.clientY - this.panLastY;
          this.cameraX -= dx / this.zoom;
          this.cameraY -= dy / this.zoom;
          this.panLastX = event.clientX;
          this.panLastY = event.clientY;
          this.clampCamera();
        }
      });

      window.addEventListener('mouseup', (event) => {
        if (event.button === 2) {
          this.isPanning = false;
        }
      });

      // Prevent context menu on canvas
      this.canvas.addEventListener('contextmenu', (event) => {
        event.preventDefault();
      });

      // Minimap click/drag
      this.minimapCanvas.addEventListener('mousedown', (event) => {
        event.preventDefault();
        this.isMinimapDragging = true;
        this.handleMinimapClick(event);
      });

      this.minimapCanvas.addEventListener('mousemove', (event) => {
        if (this.isMinimapDragging) {
          this.handleMinimapClick(event);
        }
      });

      window.addEventListener('mouseup', () => {
        this.isMinimapDragging = false;
      });

      // Prevent minimap click from propagating to game canvas
      this.minimapCanvas.addEventListener('click', (event) => {
        event.stopPropagation();
      });
      this.minimapCanvas.addEventListener('contextmenu', (event) => {
        event.preventDefault();
      });

      // ResizeObserver to keep canvas sized to container
      const resizeObserver = new ResizeObserver(() => {
        this.resizeCanvasToContainer();
      });
      resizeObserver.observe(this.canvasContainer);
    }

    resizeCanvasToContainer() {
      const w = this.canvasContainer.clientWidth;
      const h = this.canvasContainer.clientHeight;
      if (w > 0 && h > 0) {
        this.canvas.width = w;
        this.canvas.height = h;
        // Recreate pattern since canvas resize clears context state
        if (this.bg.complete && this.bg.naturalWidth > 0) {
          this.bgPattern = this.ctx.createPattern(this.bg, 'repeat');
        }
      }
    }

    clampCamera() {
      // Center the board if it fits within the viewport
      if (this.boardWidth > 0) {
        const vpW = this.viewportWidthTiles;
        if (this.boardWidth <= vpW) {
          this.cameraX = -(vpW - this.boardWidth) / 2;
        } else {
          this.cameraX = Math.max(0, Math.min(this.cameraX, this.boardWidth - vpW));
        }
      }
      if (this.boardHeight > 0) {
        const vpH = this.viewportHeightTiles;
        if (this.boardHeight <= vpH) {
          this.cameraY = -(vpH - this.boardHeight) / 2;
        } else {
          this.cameraY = Math.max(0, Math.min(this.cameraY, this.boardHeight - vpH));
        }
      }
    }

    screenToGame(clientX : number, clientY : number) : PosData {
      const rect = this.canvas.getBoundingClientRect();
      const sx = clientX - rect.left;
      const sy = clientY - rect.top;
      return {
        x: Math.floor(this.cameraX + sx / this.zoom),
        y: Math.floor(this.cameraY + sy / this.zoom)
      };
    }

    zoomToFit() {
      if (this.boardWidth <= 0 || this.boardHeight <= 0) return;
      const zx = this.canvas.width / this.boardWidth;
      const zy = this.canvas.height / this.boardHeight;
      this.zoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, Math.min(zx, zy)));
      this.cameraX = 0;
      this.cameraY = 0;
      this.clampCamera();
    }

    updateEdgeScroll() {
      // Only edge scroll in fullscreen
      if (!document.fullscreenElement) return;
      const w = this.canvas.width;
      const h = this.canvas.height;
      const mx = this.mouseScreenX;
      const my = this.mouseScreenY;

      if (mx < EDGE_SCROLL_MARGIN) this.cameraX -= EDGE_SCROLL_SPEED;
      if (mx > w - EDGE_SCROLL_MARGIN) this.cameraX += EDGE_SCROLL_SPEED;
      if (my < EDGE_SCROLL_MARGIN) this.cameraY -= EDGE_SCROLL_SPEED;
      if (my > h - EDGE_SCROLL_MARGIN) this.cameraY += EDGE_SCROLL_SPEED;
    }

    updateKeyScroll() {
      if (this.pressedKeys.has('ArrowLeft')) this.cameraX -= KEY_SCROLL_SPEED;
      if (this.pressedKeys.has('ArrowRight')) this.cameraX += KEY_SCROLL_SPEED;
      if (this.pressedKeys.has('ArrowUp')) this.cameraY -= KEY_SCROLL_SPEED;
      if (this.pressedKeys.has('ArrowDown')) this.cameraY += KEY_SCROLL_SPEED;
    }

    toggleFullscreen() {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        this.div.requestFullscreen();
      }
    }

    requestFullscreen() {
      this.div.requestFullscreen().catch(() => {
        // Fullscreen request may be denied by browser
      });
    }

    drawBG() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      if (this.bgPattern && this.boardWidth > 0 && this.boardHeight > 0) {
        this.ctx.save();
        this.ctx.translate(-this.cameraX * this.zoom, -this.cameraY * this.zoom);
        this.ctx.fillStyle = this.bgPattern;
        this.ctx.fillRect(0, 0, this.boardWidth * this.zoom, this.boardHeight * this.zoom);
        this.ctx.restore();
      } else if (this.bg.complete && this.boardWidth > 0 && this.boardHeight > 0) {
        // Fallback: draw stretched bg
        this.ctx.save();
        this.ctx.translate(-this.cameraX * this.zoom, -this.cameraY * this.zoom);
        this.ctx.drawImage(this.bg, 0, 0, this.boardWidth * this.zoom, this.boardHeight * this.zoom);
        this.ctx.restore();
      }
    }

    clickFn(event : MouseEvent) {
        const pos = this.screenToGame(event.clientX, event.clientY);
        if (pos.x < 0 || pos.y < 0 || pos.x >= this.boardWidth || pos.y >= this.boardHeight) {
            return;
        }
        if (this.isDelete) {
            emitDeleteUnits(this.socket, pos);
        } else {
            console.log('attempting to place unit');
            emitSpawnUnit(this.socket, pos, this.getUnitSelect().name);
        }
    }

    handlePlaceDelete(event: KeyboardEvent) {
      if (event.key == "d") {
        this.isDelete = true;
        this.modeIndicator.textContent = "DELETE";
        this.modeIndicator.className = "hud-mode hud-mode--delete";
      } else if (event.key == "a") {
        this.isDelete = false;
        this.modeIndicator.textContent = "ADD";
        this.modeIndicator.className = "hud-mode hud-mode--add";
      }
    }

    drawSetupGame(data : GameSetupData) {
      if (!data) {
        return;
      }
      this.drawBG();
      data.players.forEach((player : PlayerSetupData) => {
        if (player.pos) {
          this.drawUnitByPos("heart", player.pos, player.color);
        }
      });
    }

    drawGame(data : GameData) {
      this.resourceLabel.innerText = this.formatResources(data.resources);
      this.setHp(data);
      this.setUnitCount(data);
      this.drawGeneralGameData(data.generalData);
      this.drawCircle(data.playerData.pos.x, data.playerData.pos.y, Math.floor(Math.sqrt(data.playerData.radius)), "black");
    }

    drawGeneralGameData(data : GeneralGameData) {
      this.setCanvasSize(data.board.width, data.board.height);
      this.updateEdgeScroll();
      this.updateKeyScroll();
      this.clampCamera();
      this.drawBG();
      data.units.forEach((unit : UnitData) => {
        this.drawUnit(unit);
      });
      this.drawMinimap(data.units);
    }

    setCanvasSize(width : number, height : number) {
      this.boardWidth = width;
      this.boardHeight = height;
      this.resizeCanvasToContainer();
      // Only zoom-to-fit on first call (when camera is at origin and zoom is default)
      if (this.cameraX === 0 && this.cameraY === 0 && this.zoom === 10) {
        this.zoomToFit();
      }
      this.sizeMinimap();
    }

    sizeMinimap() {
      if (this.boardWidth <= 0 || this.boardHeight <= 0) return;
      const aspect = this.boardWidth / this.boardHeight;
      if (aspect >= 1) {
        this.minimapCanvas.width = MINIMAP_MAX_DIM;
        this.minimapCanvas.height = Math.round(MINIMAP_MAX_DIM / aspect);
      } else {
        this.minimapCanvas.height = MINIMAP_MAX_DIM;
        this.minimapCanvas.width = Math.round(MINIMAP_MAX_DIM * aspect);
      }
    }

    setHp(data : GameData) {
      this.heartProgress.max = data.playerData.totalHealth;
      this.heartProgress.value = data.playerData.health;
    }

    setUnitCount(data : GameData) {
      this.unitCountLabel.innerText = 'Units ' + data.playerData.numUnits + '/' + data.playerData.maxUnits;
    }

    drawUnit(unit : UnitData) {
      // Frustum culling: skip off-screen units
      const sx = (unit.pos.x - this.cameraX) * this.zoom;
      const sy = (unit.pos.y - this.cameraY) * this.zoom;
      if (sx < -this.zoom * 2 || sx > this.canvas.width + this.zoom ||
          sy < -this.zoom * 2 || sy > this.canvas.height + this.zoom) {
        return;
      }
      this.drawBorder(unit.pos, unit.playerColor);
      this.drawUnitByPos(unit.name, unit.pos, unit.color);
      this.drawUnitHealthBar(unit);
    }

    drawUnitByPos(name : string, pos : PosData, color : string) {
      let x : number = (pos.x - this.cameraX) * this.zoom;
      let y : number = (pos.y - this.cameraY) * this.zoom;
      this.ctx.fillStyle = color;
      if (this.images.has(name)) {
        let image = this.images.get(name);
        x -= this.zoom;
        y -= this.zoom;
        this.ctx.drawImage(image!, x, y, this.zoom * 3, this.zoom * 3);
      } else {
        this.ctx.fillRect(x, y, this.zoom, this.zoom);
      }
    }

    drawUnitHealthBar(unit : UnitData) {
      let x : number = (unit.pos.x - this.cameraX) * this.zoom;
      let y : number = (unit.pos.y - this.cameraY) * this.zoom;
      if (unit.hp == unit.totalHP) {
        return;
      }
      let healthBarThickness = Math.floor(this.zoom * .3);
      let heatlhY = y - healthBarThickness;
      let healthPercentage = unit.hp / unit.totalHP;
      let healthBarLength = Math.floor(healthPercentage * this.zoom);
      this.ctx.fillStyle = "red";
      this.ctx.fillRect(x, heatlhY, this.zoom, healthBarThickness);
      this.ctx.fillStyle = "green";
      this.ctx.fillRect(x, heatlhY, healthBarLength, healthBarThickness);
    }

    drawBorder(pos : PosData, color : string) {
      let x : number = (pos.x - this.cameraX) * this.zoom;
      let y : number = (pos.y - this.cameraY) * this.zoom;
      this.ctx.fillStyle = color;
      this.ctx.fillRect(x - 2, y - 2, this.zoom + 4, this.zoom + 4);
    }

    drawCircle(x : number, y : number, radius : number, color : string) {
      let offset = this.zoom / 2;
      let ctx = this.ctx;
      ctx.strokeStyle = color;
      ctx.beginPath();
      ctx.arc((x - this.cameraX) * this.zoom + offset, (y - this.cameraY) * this.zoom + offset, radius * this.zoom, 0, 2 * Math.PI);
      ctx.stroke();
    }

    drawMinimap(units : UnitData[]) {
      if (this.boardWidth <= 0 || this.boardHeight <= 0) return;
      const mw = this.minimapCanvas.width;
      const mh = this.minimapCanvas.height;
      const mctx = this.minimapCtx;

      // Background
      mctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
      mctx.fillRect(0, 0, mw, mh);

      const scaleX = mw / this.boardWidth;
      const scaleY = mh / this.boardHeight;

      // Draw units as colored dots
      units.forEach((unit : UnitData) => {
        const ux = unit.pos.x * scaleX;
        const uy = unit.pos.y * scaleY;
        const dotSize = Math.max(2, Math.min(scaleX, scaleY) * 0.8);
        mctx.fillStyle = unit.playerColor;
        mctx.fillRect(ux, uy, dotSize, dotSize);
      });

      // Draw viewport rectangle
      const vpX = this.cameraX * scaleX;
      const vpY = this.cameraY * scaleY;
      const vpW = this.viewportWidthTiles * scaleX;
      const vpH = this.viewportHeightTiles * scaleY;
      mctx.strokeStyle = 'white';
      mctx.lineWidth = 1.5;
      mctx.strokeRect(vpX, vpY, vpW, vpH);
    }

    handleMinimapClick(event : MouseEvent) {
      const rect = this.minimapCanvas.getBoundingClientRect();
      const mx = event.clientX - rect.left;
      const my = event.clientY - rect.top;
      const scaleX = this.minimapCanvas.width / this.boardWidth;
      const scaleY = this.minimapCanvas.height / this.boardHeight;
      // Center viewport on clicked tile
      const tileX = mx / scaleX;
      const tileY = my / scaleY;
      this.cameraX = tileX - this.viewportWidthTiles / 2;
      this.cameraY = tileY - this.viewportHeightTiles / 2;
      this.clampCamera();
    }

    fillSelect(selectElement : HTMLSelectElement, units : UnitCreationData[]) {
      removeOptions(selectElement);
      units.forEach((data : UnitCreationData) => {
        const optionElement = document.createElement('option');
        optionElement.value = JSON.stringify(data);
        optionElement.text = data.name;
        selectElement.add(optionElement);
      });
    }

    upgradeEra(era : EraData) {
      let ogVal = this.unitSelect.value
      this.fillSelect(this.unitSelect, era.availableUnits);
      this.unitSelect.value = ogVal;
      this.eraNameLabel.innerText = 'Era: ' + era.eraName;
      this.nextEraLabel.innerText = 'Next Era Cost:' + this.formatResources(era.nextEraCost);
      this.updateHotkeyLabels();
    }

    getUnitSelect() : UnitCreationData {
      return JSON.parse(this.unitSelect.value);
    }

    formatResources(resources : ResourceData) : string {
      return `\u{1F4B0}${resources.gold}\u{1FAB5}${resources.wood}\u{1FAA8}${resources.stone}`
    }

    handleKeydown(event: KeyboardEvent): void {
        // Prevent arrow keys from scrolling the page
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
            event.preventDefault();
        }
        // Fullscreen toggle
        if (event.key === 'F11' || event.key === 'f') {
          const tag = (event.target as HTMLElement)?.tagName;
          if (tag !== 'INPUT' && tag !== 'SELECT' && tag !== 'TEXTAREA') {
            if (event.key === 'F11') event.preventDefault();
            this.toggleFullscreen();
            return;
          }
        }
        this.handlePlaceDelete(event);
        this.pressedKeys.add(event.key);
        let number : number = parseInt(event.key);
        if (!Number.isNaN(number) && this.isCombinationPressed(['Control'])) {
          this.hotKeys.set(event.key, this.getUnitSelect());
          this.updateHotkeyLabels();
          return;
        }
        if (this.hotKeys.has(event.key)) {
          this.unitSelect.value = JSON.stringify(this.hotKeys.get(event.key));
          this.unitSelect.dispatchEvent(new Event('change', { bubbles: true }));
        }
    }

    handleKeyup(event: KeyboardEvent): void {
        this.pressedKeys.delete(event.key);
    }

    isCombinationPressed(combination: string[]): boolean {
        return combination.every(key => this.pressedKeys.has(key));
    }

    updateHotkeyLabels() {
      const nameToKey = new Map<string, string>();
      this.hotKeys.forEach((unit, key) => {
        nameToKey.set(unit.name, key);
      });

      for (let i = 0; i < this.unitSelect.options.length; i++) {
        const option = this.unitSelect.options[i];
        const data : UnitCreationData = JSON.parse(option.value);
        const key = nameToKey.get(data.name);
        option.text = key ? `[${key}] ${data.name}` : data.name;
      }
    }
}
