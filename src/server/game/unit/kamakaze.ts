import { KAMAKAZE_NAME } from "../../../shared/types.js";
import { Board } from "../board.js";
import { Player } from "../player.js";
import { Pos } from "../pos.js";
import { Resources } from "../resources.js";
import { Unit, UnitWithTarget } from "./unit.js";

export class Kamakaze extends UnitWithTarget {
    static GOLD_COST = 50;
    static WOOD_COST = 30;
    static STONE_COST = 0;
    static SPEED = 9;
    static DAMAGE = 10;
    static HP = 3;
    static COLOR = "#DD0000";
    static RANGE = 16;
    constructor(player : Player, pos : Pos) {
        super(player, pos, Kamakaze.HP, Kamakaze.SPEED, new Resources(Kamakaze.GOLD_COST, Kamakaze.WOOD_COST, Kamakaze.STONE_COST), Kamakaze.COLOR);
        this.name = KAMAKAZE_NAME;
    }
    inRange(other: Unit): boolean {
        return this.pos.isAdjacent(other.pos);
    }

    inRangeMove(board : Board) {
        if (this.inRange(this.target)) {
            this.explode(board);
        }
    }

    inExplosionRange(other : Unit) : boolean {
        let dist =  this.pos.distanceTo(other.pos);
        return dist <= Kamakaze.RANGE;
    }

    explode(board : Board) {
        board.entities.forEach((unit : Unit) => {
            if (unit === this) {
                return;
            }
            if (this.inExplosionRange(unit)) {
                unit.doDamage(Kamakaze.DAMAGE);
            }
        });
        this.doDamage(this.currHp);
    }
}