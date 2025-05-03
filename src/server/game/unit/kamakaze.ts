import { Board } from "../board.js";
import { Player } from "../player.js";
import { Pos } from "../pos.js";
import { Resources } from "../resources.js";
import { GameUnit } from "./game_unit.js";
import { Unit, UnitWithTarget } from "./unit.js";

export class Kamakaze extends UnitWithTarget {
    constructor(player : Player, pos : Pos, private damage : number = KamakazeUnit.DAMAGE, private range : number = KamakazeUnit.RANGE) {
        super(player, KamakazeUnit.NAME, pos, KamakazeUnit.HP, KamakazeUnit.SPEED, KamakazeUnit.COLOR);
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
        return dist <= this.range;
    }

    explode(board : Board) {
        board.entities.forEach((unit : Unit) => {
            if (unit === this) {
                return;
            }
            if (this.inExplosionRange(unit)) {
                unit.doDamage(this.damage);
            }
        });
        this.doDamage(this.currHp);
    }
}

export class KamakazeUnit extends GameUnit {
    static NAME = "Kamakaze";
    static COST = new Resources(50, 30, 0);
    static SPEED = 9;
    static DAMAGE = 10;
    static HP = 3;
    static COLOR = "#DD0000";
    static RANGE = 16;
    constructor() {
        super(KamakazeUnit.NAME, KamakazeUnit.COST);
    }
    construct(player: Player, pos: Pos): Unit {
        return new Kamakaze(player, pos);
    }
}