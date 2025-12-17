import { Resources } from "../resources.js";
import { GorillaWarfareUnit } from "../unit/gorilla_warfare.js";
import { CARPENTER_GAME_UNIT, LUMBER_JACK_GAME_UNIT, MERCHANT_GAME_UNIT, MINER_GAME_UNIT } from "../unit/resource_unit.js";
import { BaseComputerPlayer } from "./basics.js";

export class SimpleComputer extends BaseComputerPlayer {
    firstEra() {
        this.maintainCountOfUnits(MERCHANT_GAME_UNIT, 25);
        this.advanceEra();
    }
    secontEra() {
        this.maintainCountOfUnits(MERCHANT_GAME_UNIT, 30);
        this.maintainCountOfUnits(LUMBER_JACK_GAME_UNIT, 20);
        this.advanceEra();
    }
    thirdEra() {
        this.maintainCountOfUnits(CARPENTER_GAME_UNIT, 20);
        this.maintainCountOfUnits(MINER_GAME_UNIT, 20);
        this.spamUnits(GorillaWarfareUnit, 10);
    }
    fourthEra() {
        throw new Error("Method not implemented.");
    }
    fifthEra() {
        throw new Error("Method not implemented.");
    }
    sixthEra() {
        throw new Error("Method not implemented.");
    }

}