import { Board } from "./board.js";
import { EraHeartInfo, Heart } from "./heart.js";
import { Resources } from "./resources.js";
import { ResourceUnit } from "./unit/resource_unit.js";
import { Soldier } from "./unit/soldier.js";
import { Unit } from "./unit/unit.js";
import { UnitFactory } from "./unit_factory.js";
import { Pos } from "./pos.js";
import { Era } from "./era.js";
import { LUMBER_JACK_NAME, MERCHANT_NAME, MINER_NAME, SOLDIER_NAME } from "../../shared/types.js";

export class Player {
    resources : Resources = new Resources(5, 0, 0);
    private unitFactory : UnitFactory = new UnitFactory(this);
    board : Board;
    era : Era = new Era();

    heart : ResourceUnit;

    constructor(pos : Pos, board : Board, private id : string, private name : string) {
        this.board = board;
        this.heart = new Heart(this, pos, this.era.currEra.getHeart());
        this.board.addEntity(this.heart);
    }

    NewUnit(unitType : string, pos : Pos) {
        let unit : Unit = this.whichUnit(unitType, pos);
        if (this.resources.canAfford(unit.cost)) {
            this.resources.spend(unit.cost);
            this.board.addEntity(unit);
        }
    }

    whichUnit(s : string, pos : Pos) : Unit {
        switch(s) {
            case MERCHANT_NAME:
                return this.unitFactory.NewMerchant(pos);
            case LUMBER_JACK_NAME:
                return this.unitFactory.NewLumberJack(pos);
            case MINER_NAME:
                return this.unitFactory.NewMiner(pos);
            case SOLDIER_NAME:
                return this.unitFactory.NewSoldier(pos);
            default:
                console.log("unrecognized unit type");
        }
    }

    isDead() : Boolean {
        return this.heart.currHp <= 0;
    }

    attemptUpgradeEra() : boolean {
        return this.era.advanceToNextEra(this.resources);
    }
}