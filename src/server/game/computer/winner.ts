import { Resources } from "../resources.js";
import { GameUnit } from "../unit/game_unit.js";
import { GorillaWarfareUnit } from "../unit/gorilla_warfare.js";
import { QuickAttackerUnit, SoldierUnit } from "../unit/melee_unit.js";
import { LegacyRandomMoverUnit } from "../unit/random/random_mover.js";
import { FireballThrowerUnit } from "../unit/ranged_unit.js";
import { CARPENTER_GAME_UNIT, LUMBER_JACK_GAME_UNIT, MASON_GAME_UNIT, MERCHANT_GAME_UNIT, MINER_GAME_UNIT, SCAVENGER_GAME_UNIT } from "../unit/resource_unit.js";
import { SummonerUnit } from "../unit/summoner.js";
import { BaseComputerPlayer } from "./basics.js";

export class WinnerComputerPlayer extends BaseComputerPlayer {
    private savings = new Resources({ gold: 25 });
    firstEra(): void {
        this.protectBase(SoldierUnit);
        if (!this.resources.canAfford(new Resources({ gold: 35 }))) {
            return;
        }
        this.maintainCountOfUnits(MERCHANT_GAME_UNIT, 15);
        this.advanceEra();
    }
    secontEra(): void {
        this.protectBase(QuickAttackerUnit);
        this.maintainCountOfUnits(MERCHANT_GAME_UNIT, 25);
        this.maintainCountOfUnits(LUMBER_JACK_GAME_UNIT, 15);
        this.maintainCountOfUnits(LegacyRandomMoverUnit, 10);
        this.attemptUpgradeEra();
    }
    thirdEra(): void {
        this.maintainCountOfUnits(CARPENTER_GAME_UNIT, 20);
        this.maintainCountOfUnits(MINER_GAME_UNIT, 10);
        this.maintainCountOfUnits(LegacyRandomMoverUnit, 15);
        this.maintainCountOfUnits(SoldierUnit, 15);
        this.maintainCountOfUnits(GorillaWarfareUnit, 2);
        this.maintainCountOfUnits(new SummonerUnit(), 3);
        this.maintainCountOfUnits(FireballThrowerUnit, 1);
        this.attemptUpgradeEra();
    }
    fourthEra(): void {
        this.maintainCountOfUnits(SCAVENGER_GAME_UNIT, 30);
        this.maintainCountOfUnits(MASON_GAME_UNIT, 10);
    }
    fifthEra(): void {
        return;
    }
    sixthEra(): void {
        return;
    }

    maintainCountOfUnits(unit: GameUnit, targetCount: number): void {
        super.maintainCountOfUnits(unit, targetCount, this.savings.copy());
    }

    maintainResourceUnit(unit: GameUnit, targetCount: number): void {

    }
}