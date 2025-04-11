import { Era } from "./era";
import { Board } from "./board";
import { EraHeartInfo, Heart } from "./heart";
import { Pos } from "./pos";
import { Resources } from "./resources";
import { LUMBER_JACK_NAME, MERCHANT_NAME, MINER_NAME, ResourceUnit } from "./unit/resource_unit";
import { Soldier, SOLDIER_NAME } from "./unit/soldier";
import { Unit } from "./unit/unit";
import { UnitFactory } from "./unit_factory";

export class PlayerBuilder {
    constructor(public pos : Pos){}
}

export class Player {
    resources : Resources = new Resources(5, 0, 0);
    private unitFactory : UnitFactory = new UnitFactory(this);
    board : Board;
    era : Era = new Era();

    heart : ResourceUnit;

    constructor(pos : Pos, board : Board) {
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
}