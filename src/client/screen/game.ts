import { GameSetupData, PlayerSetupData } from "../../shared/bulider";
import { EraData, GameData, PosData, UnitCreationData, UnitData } from "../../shared/types";

export class GameScreen {
    public div = document.getElementById("gameScreen")!;
    public canvas = document.getElementById('game') as HTMLCanvasElement;
    public resourceLabel = document.getElementById('resourceLabel') as HTMLLabelElement;
    public goldLabel = document.getElementById('goldLabel') as HTMLSpanElement;
    public woodLabel = document.getElementById('woodLabel') as HTMLSpanElement;
    public stoneLabel = document.getElementById('stoneLabel') as HTMLSpanElement;
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

    constructor() {
      this.zoomSelect.onchange = () => {
        this.setSize();
      }
      this.unitSelect.onchange = () => {
        this.updateUnitInfo();
      }
      // Don't call updateUnitInfo() here since no units are loaded yet
      
      // Add dynamic tooltip positioning
      this.setupDynamicTooltips();
    }

    setupDynamicTooltips() {
      const tooltip = this.unitInfoLabel;
      
      tooltip.addEventListener('mouseenter', (e) => {
        const rect = tooltip.getBoundingClientRect();
        const tooltipText = tooltip.title;
        
        if (!tooltipText || tooltipText === "Select a unit to see details") {
          return; // Don't show tooltip for placeholder text
        }
        
        // Create tooltip element
        const tooltipEl = document.createElement('div');
        tooltipEl.className = 'dynamic-tooltip';
        tooltipEl.textContent = tooltipText;
        tooltipEl.style.cssText = `
          position: fixed;
          background: rgba(0, 0, 0, 0.95);
          color: #ffffff;
          padding: 10px 15px;
          border-radius: 8px;
          font-size: 12px;
          white-space: pre-wrap;
          max-width: 300px;
          z-index: 10000;
          border: 2px solid #00ffff;
          box-shadow: 0 0 20px rgba(0, 255, 255, 0.4);
          text-align: center;
          line-height: 1.4;
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.2s ease;
        `;
        
        document.body.appendChild(tooltipEl);
        
        // Calculate position
        const tooltipRect = tooltipEl.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const viewportWidth = window.innerWidth;
        
        let top, left;
        
        // Try to position above first
        if (rect.top > tooltipRect.height + 20) {
          // Enough space above
          top = rect.top - tooltipRect.height - 10;
          left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);
        } else if (rect.bottom + tooltipRect.height + 20 < viewportHeight) {
          // Enough space below
          top = rect.bottom + 10;
          left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);
        } else {
          // Position to the side
          if (rect.right + tooltipRect.width + 20 < viewportWidth) {
            // Space to the right
            top = rect.top + (rect.height / 2) - (tooltipRect.height / 2);
            left = rect.right + 10;
          } else {
            // Space to the left
            top = rect.top + (rect.height / 2) - (tooltipRect.height / 2);
            left = rect.left - tooltipRect.width - 10;
          }
        }
        
        // Ensure tooltip stays within viewport
        left = Math.max(10, Math.min(left, viewportWidth - tooltipRect.width - 10));
        top = Math.max(10, Math.min(top, viewportHeight - tooltipRect.height - 10));
        
        tooltipEl.style.left = left + 'px';
        tooltipEl.style.top = top + 'px';
        
        // Fade in
        setTimeout(() => {
          tooltipEl.style.opacity = '1';
        }, 10);
        
        // Store reference for removal
        (tooltip as any)._tooltipElement = tooltipEl;
      });
      
      tooltip.addEventListener('mouseleave', () => {
        const tooltipEl = (tooltip as any)._tooltipElement;
        if (tooltipEl) {
          tooltipEl.style.opacity = '0';
          setTimeout(() => {
            if (tooltipEl.parentNode) {
              tooltipEl.parentNode.removeChild(tooltipEl);
            }
            (tooltip as any)._tooltipElement = null;
          }, 200);
        }
      });
    }

    updateUnitInfo() {
      const selectedUnit = this.getUnitSelect();
      if (selectedUnit) {
        this.unitCostLabel.innerText = selectedUnit.cost.gold + "g " + selectedUnit.cost.wood + "w " + selectedUnit.cost.stone + "s";
        this.unitInfoLabel.title = selectedUnit.blurb || "No description available";
      } else {
        this.unitCostLabel.innerText = "Cost: 0";
        this.unitInfoLabel.title = "Select a unit to see details";
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
      // Update individual resource labels
      this.goldLabel.innerText = data.resources.gold.toString();
      this.woodLabel.innerText = data.resources.wood.toString();
      this.stoneLabel.innerText = data.resources.stone.toString();
      
      // Keep the old resourceLabel updated for compatibility
      this.resourceLabel.innerText = 'Gold: ' + data.resources.gold + ' Wood: ' + data.resources.wood + ' Stone: ' + data.resources.stone;
      
      this.setCanvasSize(data.board.width, data.board.height);
      this.setHp(data);
      this.setUnitCount(data);
      data.units.forEach((unit : UnitData) => {
        this.drawUnit(unit, team);
      });
      this.drawCircle(data.playerData.pos.x, data.playerData.pos.y, Math.floor(Math.sqrt(data.playerData.radius)), "black");
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
    
    drawUnit(unit : UnitData, team : number) {
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
      this.nextEraLabel.innerText = 'Next Era Cost:' + era.nextEraCost.gold + 'g' + era.nextEraCost.wood + 'w' + era.nextEraCost.stone + 's';
      
      // Update unit info to reflect the pre-selected unit (usually merchant)
      this.updateUnitInfo();
    }

    setSize() {
      this.SIZE = parseInt(this.zoomSelect.value);
    }

    getUnitSelect() : UnitCreationData | null {
      try {
        if (!this.unitSelect.value || this.unitSelect.value === "") {
          return null;
        }
        return JSON.parse(this.unitSelect.value);
      } catch (error) {
        console.warn("Error parsing unit select value:", error);
        return null;
      }
    }
}