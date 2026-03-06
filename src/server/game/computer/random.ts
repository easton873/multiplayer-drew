import { FRAME_RATE } from "../client_handler.js";
import { Pos } from "../pos.js";
import { Resources } from "../resources.js";
import { GameUnit } from "../unit/game_unit.js";
import { LUMBER_JACK_GAME_UNIT, MERCHANT_GAME_UNIT, ResourceUnit } from "../unit/resource_unit.js";
import { Unit } from "../unit/unit.js";
import { getRandomIndex } from "../utils.js";
import { BaseComputerPlayer } from "./basics.js";

// update logic here:
// when a unit is randomly selected, check if our current rate of resource gathering per second
// at least 10% its cost, and then if it is at.least that, then you can build it. Also probably some logic
// for how likely you are to place a resource unit. Also all resource units should get a freebie if you
// randomly select building one of those (or at least the first 2, miner might be a problem because what
// you make no wood)
export class RandomComputer extends BaseComputerPlayer {
    private nextUnit : GameUnit = null;
    firstEra() {
    }
    secontEra() {
    }
    thirdEra() {
    }
    fourthEra() {
    }
    fifthEra() {
    }
    sixthEra() {
    }
    doTurn(): void {
        this.advanceEra();

        this.placeRandomUnit();
    }

    maintainCountOfUnitsV2(unit: GameUnit, targetCount: number): boolean {
        if (!super.maintainCountOfUnitsV2(unit, targetCount)) {
            return false;
        }
        return true;
    }

    placeRandomUnit() {
        if (!this.nextUnit) {
            this.setNextUnit();
        }

        if (!this.nextUnit) {
            return;
        }

        if (this.placeUnit(this.nextUnit, this.randomPosInTerritory())) {
            this.setNextUnit();
        }
    }

    setNextUnit() {
        this.nextUnit = getRandomIndex(this.era.availableUnits);
        if (this.nextUnit == MERCHANT_GAME_UNIT || this.nextUnit == LUMBER_JACK_GAME_UNIT) {
            return;
        }
        let rateOfIncome : Resources = this.getRateOfIncome();
        rateOfIncome.multiply(3); // can we produce it in 3 seconds or less
        if (rateOfIncome.canAfford(this.nextUnit.getUnitCreationInfo().getCost())) {
            return;
        }
        this.nextUnit = null;
    }

    getRateOfIncome() : Resources { // returns production per second
        let result : Resources = new Resources(0, 0, 0);
        this.board.entities.forEach((unit : Unit) => {
            if (unit.owner == this && unit.is(ResourceUnit)) {
                let productionRate : number = FRAME_RATE / unit.moveCounter.total;
                let production : Resources = unit.resources.copy();
                production.multiply(productionRate);
                result.add(production);
            }
        });
        return result;
    }
}