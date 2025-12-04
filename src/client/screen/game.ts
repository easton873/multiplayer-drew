import { GameSetupData, PlayerSetupData } from "../../shared/bulider";
import { EraData, GameData, GeneralGameData, PosData, ResourceData, UnitCreationData, UnitData } from "../../shared/types";
import { emitDeleteUnits, emitSpawnUnit } from "../../shared/routes";

export class GameScreen {
    public div = document.getElementById("gameScreen")!;
    public canvas = document.getElementById('game') as HTMLCanvasElement;
    public controls = document.getElementById("controls") as HTMLDivElement;
    public resourceLabel = document.getElementById('resourceLabel') as HTMLLabelElement;
    public heartProgress = document.getElementById('heartProgress') as HTMLProgressElement;
    public unitSelect = document.getElementById('unitSelect') as HTMLSelectElement;
    public unitInfoLabel = document.getElementById('unitInfoLabel') as HTMLLabelElement;
    public unitCostLabel = document.getElementById('unitCostLabel') as HTMLLabelElement;
    public unitCountLabel = document.getElementById('unitCountLabel') as HTMLLabelElement;
    public upgradeButton = document.getElementById('upgradeButton') as HTMLButtonElement;
    public eraNameLabel = document.getElementById('eraNameLabel') as HTMLLabelElement;
    public nextEraLabel = document.getElementById('nextEraLabel') as HTMLLabelElement;
    public zoomSelect = document.getElementById('zoomList') as HTMLSelectElement;
    public ctx : CanvasRenderingContext2D = this.canvas.getContext('2d')!;
    public SIZE : number = 10;

    private isDelete : boolean = false

    constructor(private socket : any) {
      this.zoomSelect.onchange = () => {
        this.setSize();
      }
      this.unitSelect.onchange = () => {
        let cost = this.getUnitSelect().cost
        this.unitCostLabel.innerText = this.formatResources(cost);
        this.unitInfoLabel.title = this.getUnitSelect().blurb;
      }

      this.canvas.addEventListener('click', (event) => {this.clickFn(event)});
      // Attach the listener
      document.addEventListener("keydown", (event : KeyboardEvent) => {this.handleKey(event)});
    }

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

    handleKey(event: KeyboardEvent) {
      console.log('keydown');
      if (event.key == "d") {
        this.isDelete = true;
      } else if (event.key == "a") {
        this.isDelete = false;
      }
    }

    drawSetupGame(data : GameSetupData) {
      if (!data) {
        return;
      }
      data.players.forEach((player : PlayerSetupData) => {
        if (player.pos) {
          this.drawUnitByPos(player.pos, player.color);
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
      this.drawUnitByPos(unit.pos, unit.color);
      this.drawUnitHealthBar(unit);
    }

    drawUnitByPos(pos : PosData, color : string) {
      let x : number = pos.x * this.SIZE;
      let y : number = pos.y * this.SIZE;
      this.ctx.fillStyle = color;
      this.ctx.fillRect(x, y, this.SIZE, this.SIZE);
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
      this.ctx.fillRect(x - 2, y - 2, this.SIZE + 4, this.SIZE + 4);
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
      this.removeOptions(selectElement);
      units.forEach((data : UnitCreationData) => {
        const optionElement = document.createElement('option');
        optionElement.value = JSON.stringify(data);
        optionElement.text = data.name;
        selectElement.add(optionElement);
      });
    }
    
    removeOptions(selectElement) {
      var i, L = selectElement.options.length - 1;
      for(i = L; i >= 0; i--) {
         selectElement.remove(i);
      }
    }

    upgradeEra(era : EraData) {
      this.fillSelect(this.unitSelect, era.availableUnits);
      this.eraNameLabel.innerText = 'Era: ' + era.eraName;
      this.nextEraLabel.innerText = 'Next Era Cost:' + this.formatResources(era.nextEraCost);
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
}