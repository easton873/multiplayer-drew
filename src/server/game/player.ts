import { Board } from "./board.js";
import { Heart } from "./heart.js";
import { Resources } from "./resources.js";
import { ResourceUnit } from "./unit/resource_unit.js";
import { Unit } from "./unit/unit.js";
import { UnitFactory } from "./unit_factory.js";
import { Pos } from "./pos.js";
import { Era } from "./era.js";
import { ARCHER_NAME, KAMAKAZE_NAME, LUMBER_JACK_NAME, MERCHANT_NAME, MINER_NAME, PlayerSpecificData, SOLDIER_NAME } from "../../shared/types.js";

export class Player {
    resources: Resources = new Resources(5, 0, 0);
    private unitFactory: UnitFactory = new UnitFactory(this);
    board: Board;
    era: Era = new Era();
    protected unitCount = 0;

    heart: ResourceUnit;

    constructor(private team: number, pos: Pos, board: Board, private id: string, private name: string, private color: string) {
        this.board = board;
        this.heart = new Heart(this, pos, this.era.currEra.getHeart());
        this.board.addEntity(this.heart);
    }

    getColor() : string {
        return this.color;
    }

    getTeam(): number {
        return this.team;
    }

    NewUnit(unitType: string, pos: Pos) {
        let unit: Unit = this.whichUnit(unitType, pos);
        if (this.resources.canAfford(unit.cost)) {
            this.resources.spend(unit.cost);
            this.board.addEntity(unit);
        }
    }

    whichUnit(s: string, pos: Pos): Unit {
        switch (s) {
            case MERCHANT_NAME:
                return this.unitFactory.NewMerchant(pos);
            case LUMBER_JACK_NAME:
                return this.unitFactory.NewLumberJack(pos);
            case MINER_NAME:
                return this.unitFactory.NewMiner(pos);
            case SOLDIER_NAME:
                return this.unitFactory.NewSoldier(pos);
            case ARCHER_NAME:
                return this.unitFactory.NewArcher(pos);
            case KAMAKAZE_NAME:
                return this.unitFactory.NewKamakaze(pos);
            default:
                console.log("unrecognized unit type");
        }
    }

    isDead(): Boolean {
        return this.heart.currHp <= 0;
    }

    attemptUpgradeEra(): boolean {
        return this.era.advanceToNextEra(this.resources);
    }

    getID(): string {
        return this.id;
    }

    getPlayerSpecificData() : PlayerSpecificData {
        return {
            pos: this.heart.pos.getPosData(), 
            radius: this.era.getRadius(), 
            health: this.heart.currHp, 
            totalHealth: this.heart.hp,
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
        this.unitCount = this.countUnits();
    }

    private countUnits(): number {
        let count = 0;
        this.board.entities.forEach((unit: Unit) => {
            if (unit.team == this) {
                count++;
            }
        });
        return count;
    }
}