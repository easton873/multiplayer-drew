import { GameSetupData, PlayerSetupData } from "../../shared/bulider";
import { EraData, GameData, PosData, UnitData } from "../../shared/types";

export class GameScreen {
    public div = document.getElementById("gameScreen")!;
    public canvas = document.getElementById('game') as HTMLCanvasElement;
    public resourceLabel = document.getElementById('resourceLabel') as HTMLLabelElement;
    public unitSelect = document.getElementById('unitSelect') as HTMLSelectElement;
    public upgradeButton = document.getElementById('upgradeButton') as HTMLButtonElement;
    public eraNameLabel = document.getElementById('eraNameLabel') as HTMLLabelElement;
    public nextEraLabel = document.getElementById('nextEraLabel') as HTMLLabelElement;
    public zoomSelect = document.getElementById('zoomList') as HTMLSelectElement;
    public ctx : CanvasRenderingContext2D = this.canvas.getContext('2d')!;
    public SIZE : number = 10;

    constructor() {
      this.zoomSelect.onclick = () => {
        this.setSize();
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

    drawGame(data : GameData, team : number) {
      this.resourceLabel.innerText = 'Gold: ' + data.resources.gold + ' Wood: ' + data.resources.wood + ' Stone: ' + data.resources.stone;
      this.setCanvasSize(data.board.width, data.board.height);
      data.units.forEach((unit : UnitData) => {
        this.drawUnit(unit, team);
      });
      this.drawCircle(data.heart.pos.x, data.heart.pos.y, Math.floor(Math.sqrt(data.heart.radius)), "black");
    }

    setCanvasSize(width : number, height : number) {
        this.ctx.canvas.height = height * this.SIZE + this.SIZE;
        this.ctx.canvas.width = width * this.SIZE + this.SIZE;
    }
    
    drawUnit(unit : UnitData, team : number) {
      this.drawBorder(unit.pos, unit.playerColor);
      this.drawUnitByPos(unit.pos, unit.color);
    }

    drawUnitByPos(pos : PosData, color : string) {
      let x : number = pos.x * this.SIZE;
      let y : number = pos.y * this.SIZE;
      this.ctx.fillStyle = color;
      this.ctx.fillRect(x, y, this.SIZE, this.SIZE);
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

    fillSelect(selectElement : HTMLSelectElement, units : string[]) {
      this.removeOptions(selectElement);
      units.forEach(unitType => {
        const optionElement = document.createElement('option');
        optionElement.value = unitType;
        optionElement.text = unitType;
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
      this.nextEraLabel.innerText = 'Next Era Cost:' + era.nextEraCost.gold + 'g' + era.nextEraCost.wood + 'w' + era.nextEraCost.stone + 's'
    }

    setSize() {
      this.SIZE = parseInt(this.zoomSelect.value);
    }
}