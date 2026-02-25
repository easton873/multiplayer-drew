import { PlayerProxy } from "../player.js";
import { GameUnit } from "../unit/game_unit.js";
import { LUMBER_JACK_GAME_UNIT, MERCHANT_GAME_UNIT, MINER_GAME_UNIT } from "../unit/resource_unit.js";
import { getRandomIndex } from "../utils.js";
import { BaseComputerPlayer } from "./basics.js";

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