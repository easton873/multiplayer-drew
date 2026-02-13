import { GameSetupData, LoadData, PlayerSetupData, UnitLoadData } from "../../shared/bulider";
import { EraData, GameData, GeneralGameData, PosData, ResourceData, UnitCreationData, UnitData } from "../../shared/types";
import { emitDeleteUnits, emitSpawnUnit } from "../../shared/routes";
import { removeOptions } from "../../client/main";

export class GameScreen {
    public div = document.getElementById("gameScreen")!;
    public canvas = document.getElementById('game') as HTMLCanvasElement;
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
    public zoomSelect = document.getElementById('zoomList') as HTMLSelectElement;
    public modeIndicator = document.getElementById('modeIndicator') as HTMLSpanElement;
    public ctx : CanvasRenderingContext2D = this.canvas.getContext('2d')!;
    public SIZE : number = 10;

    private isDelete : boolean = false
    private bg : HTMLImageElement = new Image();
    private images : Map<string, HTMLImageElement> = new Map<string, HTMLImageElement>();

    private pressedKeys : Set<string> = new Set<string>();
    private hotKeys : Map<string, UnitCreationData> = new Map<string, UnitCreationData>();

    constructor(private socket : any) {
      this.zoomSelect.onchange = () => {
        this.setSize();
      }
      this.unitSelect.onchange = () => {
        let cost = this.getUnitSelect().cost
        this.unitCostLabel.innerText = this.formatResources(cost);
        this.unitInfoTooltip.textContent = this.getUnitSelect().blurb;
      }

      this.bg.src = '/bg.png';

      this.canvas.addEventListener('click', (event) => {this.clickFn(event)});
      // Attach the listener
      // document.addEventListener("keydown", (event : KeyboardEvent) => {this.handleKey(event)});
      document.addEventListener('keydown', (event) => this.handleKeydown(event));
      document.addEventListener('keyup', (event) => this.handleKeyup(event));
    }

    drawBG() {
      this.ctx.drawImage(this.bg, 0, 0, this.canvas.width, this.canvas.height);
    }

    // loadImages(data : LoadData) {
    //   data.units.forEach((unit : UnitLoadData) => {
    //     let image : HTMLImageElement = new Image();
    //     image.onload = () => {
    //         this.images.set(unit.name, image);
    //     };
    //     image.onerror = () => {
    //         // nothing for now
    //         return;
    //     };
    //     image.src = '/units/' + unit.name + '.png';
    //   });
    // }

    clickFn(event) {
        const rect = this.canvas.getBoundingClientRect();
        const x = Math.floor((event.clientX - rect.left) / this.SIZE);
        const y = Math.floor((event.clientY - rect.top) / this.SIZE);
        const posData : PosData = {x:x, y:y};
        if (this.isDelete) {
            emitDeleteUnits(this.socket, posData);
        } else {
            console.log('attempting to place unit');
            emitSpawnUnit(this.socket, posData, this.getUnitSelect().name);
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
      data.units.forEach((unit : UnitData) => {
        this.drawUnit(unit);
      });
    }

    setCanvasSize(width : number, height : number) {
        this.ctx.canvas.height = height * this.SIZE + this.SIZE;
        this.ctx.canvas.width = width * this.SIZE + this.SIZE;
        this.drawBG();
    }

    setHp(data : GameData) {
      this.heartProgress.max = data.playerData.totalHealth;
      this.heartProgress.value = data.playerData.health;
    }

    setUnitCount(data : GameData) {
      this.unitCountLabel.innerText = 'Units ' + data.playerData.numUnits + '/' + data.playerData.maxUnits;
    }
    
    drawUnit(unit : UnitData) {
      this.drawBorder(unit.pos, unit.playerColor);
      this.drawUnitByPos(unit.name, unit.pos, unit.color);
      this.drawUnitHealthBar(unit);
    }

    drawUnitByPos(name : string, pos : PosData, color : string) {
      let x : number = (pos.x * this.SIZE);
      let y : number = (pos.y * this.SIZE);
      this.ctx.fillStyle = color;
      if (this.images.has(name)) {
        let image = this.images.get(name);
        x -= this.SIZE;
        y -= this.SIZE;
        this.ctx.drawImage(image, x, y, this.SIZE * 3, this.SIZE * 3);
      } else {
        this.ctx.fillRect(x, y, this.SIZE, this.SIZE);
      }
    }

    drawUnitHealthBar(unit : UnitData) {
      let x : number = unit.pos.x * this.SIZE;
      let y : number = unit.pos.y * this.SIZE;
      if (unit.hp == unit.totalHP) {
        return;
      }
      let healthBarThickness = Math.floor(this.SIZE * .3);
      let heatlhY = y - healthBarThickness;
      let healthPercentage = unit.hp / unit.totalHP;
      let healthBarLength = Math.floor(healthPercentage * this.SIZE);
      this.ctx.fillStyle = "red";
      this.ctx.fillRect(x, heatlhY, this.SIZE, healthBarThickness);
      this.ctx.fillStyle = "green";
      this.ctx.fillRect(x, heatlhY, healthBarLength, healthBarThickness);
    }

    drawBorder(pos : PosData, color : string) {
      let x : number = pos.x * this.SIZE;
      let y : number = pos.y * this.SIZE;
      this.ctx.fillStyle = color;
      // this.ctx.lineWidth = 4;
      this.ctx.fillRect(x - 2, y - 2, this.SIZE + 4, this.SIZE + 4);
       // this.ctx.lineWidth = 1;
    }

    drawCircle(x : number, y : number, radius : number, color : string) {
      let offset = this.SIZE / 2;
      let ctx = this.ctx;
      ctx.strokeStyle = color;
      ctx.beginPath();
      ctx.arc(x * this.SIZE + offset, y * this.SIZE + offset, radius * this.SIZE, 0, 2 * Math.PI);
      ctx.stroke();
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

    setSize() {
      this.SIZE = parseInt(this.zoomSelect.value);
    }

    getUnitSelect() : UnitCreationData {
      return JSON.parse(this.unitSelect.value);
    }

    formatResources(resources : ResourceData) : string {
      return `💰${resources.gold}🪵${resources.wood}🪨${resources.stone}`
    }

    /**
     * Handle keydown events: add the pressed key to the set.
     */
    handleKeydown(event: KeyboardEvent): void {
        // Prevent default browser behavior for certain keys if needed (e.g., arrow keys scrolling the page)
        // if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
        //     event.preventDefault();
        // }
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

    /**
     * Handle keyup events: remove the released key from the set.
     */
    handleKeyup(event: KeyboardEvent): void {
        this.pressedKeys.delete(event.key);
    }

    // Add event listeners to the window or a specific input element

    /**
     * Function to check if a specific key combination is currently pressed.
     */
    isCombinationPressed(combination: string[]): boolean {
        // Check if all keys in the required combination are present in the pressedKeys set
        return combination.every(key => this.pressedKeys.has(key));
    }

    updateHotkeyLabels() {
      // Build reverse map: unit name → key
      const nameToKey = new Map<string, string>();
      this.hotKeys.forEach((unit, key) => {
        nameToKey.set(unit.name, key);
      });

      // Update each option text
      for (let i = 0; i < this.unitSelect.options.length; i++) {
        const option = this.unitSelect.options[i];
        const data : UnitCreationData = JSON.parse(option.value);
        const key = nameToKey.get(data.name);
        option.text = key ? `[${key}] ${data.name}` : data.name;
      }
    }
}