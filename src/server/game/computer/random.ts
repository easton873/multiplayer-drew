import { PlayerProxy } from "../player.js";
import { LUMBER_JACK_GAME_UNIT, MERCHANT_GAME_UNIT, MINER_GAME_UNIT } from "../unit/resource_unit.js";
import { BaseComputerPlayer } from "./basics.js";

export class RandomComputer extends BaseComputerPlayer {
    firstEra() {
        this.maintainCountOfUnitsV2(MERCHANT_GAME_UNIT, 10);
    }
    secontEra() {
        this.maintainCountOfUnitsV2(LUMBER_JACK_GAME_UNIT, 8);
        this.maintainCountOfUnitsV2(MERCHANT_GAME_UNIT, 15);
    }
    thirdEra() {
        this.maintainCountOfUnitsV2(MINER_GAME_UNIT, 10)
        this.maintainCountOfUnitsV2(LUMBER_JACK_GAME_UNIT, 15);
        this.maintainCountOfUnitsV2(MERCHANT_GAME_UNIT, 20);
    }
    fourthEra() {
        return;
    }
    fifthEra() {
        return;
    }
    sixthEra() {
        return;
    }
    doTurn(): void {
        this.advanceEra();

        super.doTurn();

        // if (this.unitCount >= this.targetMerchantNum) {
        //     let pos = this.randomPosInBase();
        //     const randomIndex = Math.floor(Math.random() * this.era.availableUnits.length);
        //     this.NewUnit(this.era.availableUnits[randomIndex].getName(), pos);
        // }
    }
}