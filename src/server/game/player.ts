import { Board } from "./board.js";
import { Heart } from "./heart.js";
import { Resources } from "./resources.js";
import { MERCHANT_GAME_UNIT, ResourceUnit } from "./unit/resource_unit.js";
import { ObservableUnit, Unit, UnitObserver } from "./unit/unit.js";
import { Pos } from "./pos.js";
import { Era } from "./era.js";
import { PlayerSpecificData } from "../../shared/types.js";
import { GameUnit } from "./unit/game_unit.js";
import { UNIT_MAP } from "./unit/all_units.js";
import { SoldierUnit } from "./unit/melee_unit.js";
import { ArcherUnit } from "./unit/ranged_unit.js";

export class Player implements UnitObserver {
    resources: Resources = new Resources(50, 0, 0);
    board: Board;
    era: Era = new Era();
    unitCount = 0;

    heart: Heart;

    constructor(private team: number, pos: Pos, board: Board, private id: string, private name: string, private color: string) {
        this.board = board;
        this.heart = new Heart(this, pos, this.era.currEra.getHeart());
        this.board.addEntity(this.heart);
    }

    doTurn() {}

    notifyDeath(unit: ObservableUnit) {
        unit.unregisterObserver(this);
        this.unitCount--;
    }

    getColor() : string {
        return this.color;
    }

    getTeam(): number {
        return this.team;
    }

    DeleteUnits(pos : Pos) {
        for (let i = 0; i < this.board.entities.length; ++i) {
            let entity = this.board.entities[i];
            if (!(entity instanceof Heart) && entity.owner == this && entity.pos.equals(pos)) {
                entity.doDamage(entity.hp); // board is an observer so needs i--
                --i;
            }
        }
    }

    NewUnit(unitType: string, pos: Pos) {
        let gameUnit: GameUnit = this.whichUnit(unitType);
        if (!gameUnit) {
            return;
        }
        let unitCost = gameUnit.getUnitCreationInfo().getCost()
        if (this.resources.canAfford(unitCost)) {
            this.resources.spend(unitCost);
            let unit = gameUnit.construct(this, pos);
            unit.registerObserver(this);
            this.board.addEntity(unit);
            this.unitCount++;
        }
    }

    whichUnit(s: string): GameUnit {
        let unitInfo = UNIT_MAP.get(s);
        if (!unitInfo) {
            console.log("unrecognized unit type");
            return null;
        }
        return unitInfo;
    }

    isDead(): Boolean {
        return this.heart.hp <= 0;
    }

    attemptUpgradeEra(): boolean {
        if (this.era.advanceToNextEra(this.resources)) {
            this.heart.updateHeart(this.era.currEra.getHeart());
            return true;
        }
        return false
    }

    getID(): string {
        return this.id;
    }

    getPlayerSpecificData() : PlayerSpecificData {
        return {
            pos: this.heart.pos.getPosData(), 
            radius: this.era.getRadius(), 
            health: this.heart.hp, 
            totalHealth: this.heart.totalHP,
            numUnits: this.unitCount,
            maxUnits: this.era.getUnitLimit()
        }
    }
}

export class PlayerProxy extends Player {
    constructor(team: number, pos: Pos, board: Board, id: string, name: string, color: string) {
        super(team, pos, board, id, name, color);
    }

    NewUnit(unitType: string, pos: Pos): void {
        if (this.heart.pos.distanceTo(pos) > this.era.getRadius() ||
            this.unitCount >= this.era.getUnitLimit()) {
            return;
        }
        super.NewUnit(unitType, pos);
    }
}

export class AIPlayer extends PlayerProxy {
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