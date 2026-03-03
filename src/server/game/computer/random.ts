import { PlayerProxy } from "../player.js";
import { GameUnit } from "../unit/game_unit.js";
import { LUMBER_JACK_GAME_UNIT, MERCHANT_GAME_UNIT, MINER_GAME_UNIT } from "../unit/resource_unit.js";
import { getRandomIndex } from "../utils.js";
import { BaseComputerPlayer } from "./basics.js";

// update logic here:
// when a unit is randomly selected, check if our current rate of resource gathering per second
// at least 10% its cost, and then if it is at.least that, then you can build it. Also probably some logic
// for how likely you are to place a resource unit. Also all resource units should get a freebie if you
// randomly select building one of those (or at least the first 2, miner might be a problem because what
// you make no wood)
export class RandomComputer extends BaseComputerPlayer {
    private resourcesReady : boolean = false;
    private nextUnit : GameUnit = null;
    firstEra() {
        this.maintainCountOfUnitsV2(MERCHANT_GAME_UNIT, 10);
    }
    secontEra() {
        this.maintainCountOfUnitsV2(MERCHANT_GAME_UNIT, 15);
        this.maintainCountOfUnitsV2(LUMBER_JACK_GAME_UNIT, 8)
    }
    thirdEra() {
        this.maintainCountOfUnitsV2(MERCHANT_GAME_UNIT, 20);
        this.maintainCountOfUnitsV2(MINER_GAME_UNIT, 10);
        this.maintainCountOfUnitsV2(LUMBER_JACK_GAME_UNIT, 15);
    }
    fourthEra() {
        this.thirdEra();
    }
    fifthEra() {
        this.thirdEra();
    }
    sixthEra() {
        this.thirdEra();
    }
    doTurn(): void {
        this.resourcesReady = true;
        this.advanceEra();

        super.doTurn();

        if (!this.resourcesReady) {
            return;
        }

        this.placeRandomUnit();
    }

    maintainCountOfUnitsV2(unit: GameUnit, targetCount: number): boolean {
        if (!super.maintainCountOfUnitsV2(unit, targetCount)) {
            this.resourcesReady = false;
            return false;
        }
        return true;
    }

    placeRandomUnit() {
        if (!this.nextUnit) {
            this.setNextUnit();
        }

        if (this.placeUnit(this.nextUnit, this.randomPosInTerritory())) {
            this.setNextUnit();
        }
    }

    setNextUnit() {
        this.nextUnit = getRandomIndex(this.era.availableUnits);
    }
}