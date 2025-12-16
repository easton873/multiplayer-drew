import { FIFTH_ERA_NAME, FOURTH_ERA_NAME, SECOND_ERA_NAME, SIXTH_ERA_NAME, STARTING_ERA_NAME, THIRD_ERA_NAME } from "../era.js";
import { PlayerProxy } from "../player.js";
import { Pos } from "../pos.js";
import { Resources } from "../resources.js";
import { GameUnit } from "../unit/game_unit.js";
import { GorillaWarfareUnit } from "../unit/gorilla_warfare.js";
import { QuickAttackerUnit, RandomMoverUnit, SoldierUnit } from "../unit/melee_unit.js";
import { ArcherUnit, FireballThrowerUnit } from "../unit/ranged_unit.js";
import { CARPENTER_GAME_UNIT, LUMBER_JACK_GAME_UNIT, MERCHANT_GAME_UNIT, MINER_GAME_UNIT } from "../unit/resource_unit.js";
import { SummonerUnit } from "../unit/summoner.js";
import { Unit } from "../unit/unit.js";

export abstract class BaseComputerPlayer extends PlayerProxy {
    doTurn(): void {
        switch(this.era.getEraData().eraName) {
            case STARTING_ERA_NAME:
                this.firstEra();
                return;
            case SECOND_ERA_NAME:
                this.secontEra();
                return;
            case THIRD_ERA_NAME:
                this.thirdEra();
                return;
            case FOURTH_ERA_NAME:
                this.fourthEra();
                return;
            case FIFTH_ERA_NAME:
                this.fifthEra();
                return;
            case SIXTH_ERA_NAME:
                this.sixthEra();
                return;
            default:
                return;
        }
    }

    abstract firstEra();
    abstract secontEra();
    abstract thirdEra();
    abstract fourthEra();
    abstract fifthEra();
    abstract sixthEra();

    placeUnit(unit : GameUnit, pos : Pos, num : number = 1) {
        for (let i = 0; i < num; i++) {
            this.NewUnit(unit.getName(), pos.clone());
        }
    }
    
    countUnit(gameUnit : GameUnit) : number {
        let count = 0;
        this.board.entities.forEach((unit : Unit) => {
            if (unit.name == gameUnit.getName()) {
                count++
            }
        });
        return count;
    }

    maintainCountOfUnits(unit : GameUnit, targetCount : number) {
        if (this.countUnit(unit) < targetCount) {
            this.placeUnit(unit, this.heart.pos);
        }
    }

    protectBase(defenseUnit : GameUnit) {
        this.board.entities.forEach((unit : Unit) => {
            if (unit.team != this.getTeam() && this.heart.pos.distanceTo(unit.pos) <= this.era.getRadius()) {
                this.placeUnit(defenseUnit, unit.pos, 3);
            }
        })
    }
}

export class WinnerComputerPlayer extends BaseComputerPlayer {
    firstEra() {
        this.protectBase(SoldierUnit);
        if (!this.resources.canAfford(new Resources(35, 0, 0))) {
            return;
        }
        this.maintainCountOfUnits(MERCHANT_GAME_UNIT, 15);
        this.era.advanceToNextEra(this.resources);
        // this.board.entities.forEach((unit : Unit) => {
        //     if (unit.team == this.getTeam())
        // });
    }
    secontEra() {
        this.protectBase(QuickAttackerUnit);
        
        this.maintainCountOfUnits(MERCHANT_GAME_UNIT, 20);
        this.maintainCountOfUnits(LUMBER_JACK_GAME_UNIT, 7);
        this.maintainCountOfUnits(RandomMoverUnit, 10);
        this.era.advanceToNextEra(this.resources);
    }
    thirdEra() {
        this.maintainCountOfUnits(CARPENTER_GAME_UNIT, 20);
        this.maintainCountOfUnits(MINER_GAME_UNIT, 10);
        this.maintainCountOfUnits(RandomMoverUnit, 15);
        this.maintainCountOfUnits(GorillaWarfareUnit, 2);
        this.maintainCountOfUnits(new SummonerUnit(), 3);
        this.maintainCountOfUnits(FireballThrowerUnit, 1);
        this.era.advanceToNextEra(this.resources);
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
}

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