import { PlayerProxy } from "../player.js";
import { SoldierUnit } from "../unit/melee_unit.js";
import { ArcherUnit } from "../unit/ranged_unit.js";
import { MERCHANT_GAME_UNIT } from "../unit/resource_unit.js";
import { Unit } from "../unit/unit.js";

export class ComputerPlayer extends PlayerProxy {
    private targetMerchantNum : number = 15;
    private placed : number = 0;
    doTurn() : void {
        // return;
        if (this.resources.canAfford(MERCHANT_GAME_UNIT.getUnitCreationInfo().getCost()) &&
        this.unitCount < this.targetMerchantNum) {
            let pos = this.heart.pos.clone();
            this.NewUnit(MERCHANT_GAME_UNIT.getName(), pos);
        } else if (this.unitCount >= this.targetMerchantNum) {
            let pos = this.heart.pos.clone();
            if (this.placed >= 3) {
                if (this.resources.canAfford(ArcherUnit.getUnitCreationInfo().getCost())) {
                    this.NewUnit(ArcherUnit.getName(), pos);
                    this.placed = 0;
                }
            } else {
                if (this.resources.canAfford(SoldierUnit.getUnitCreationInfo().getCost())) {
                    this.NewUnit(SoldierUnit.getName(), pos);
                    this.placed++;
                }
            }
        }

        if (this.era.canAffordNextEra(this.resources)) {
            this.era.advanceToNextEra(this.resources);
        }
    }

    countUnit(unitType : new (...args: any[]) => Unit) : number {
        let count = 0;
        this.board.entities.forEach((unit : Unit) => {
            if (unit instanceof unitType) {
                count++
            }
        });
        return count;
    }
}