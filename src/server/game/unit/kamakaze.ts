import { Board } from "../board.js";
import { Player } from "../player.js";
import { Pos } from "../pos.js";
import { Resources } from "../resources.js";
import { GameUnit } from "./game_unit.js";
import { Unit, UnitWithTarget } from "./unit.js";

export class Kamakaze extends UnitWithTarget {
    static NAME = "Kamakaze";
    static COST = new Resources(50, 30, 0);
    static SPEED = 9;
    static DAMAGE = 10;
    static HP = 3;
    static COLOR = "#DD0000";
    static RANGE = 16;
    constructor(player : Player, pos : Pos) {
        super(player, Kamakaze.NAME, pos, Kamakaze.HP, Kamakaze.SPEED, Kamakaze.COLOR);
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

export class KamakazeUnit extends GameUnit {
    constructor() {
        super(Kamakaze.NAME, Kamakaze.COST);
    }
    construct(player: Player, pos: Pos): Unit {
        return new Kamakaze(player, pos);
    }
}