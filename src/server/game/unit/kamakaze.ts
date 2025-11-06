import { Board } from "../board.js";
import { Player } from "../player.js";
import { Pos } from "../pos.js";
import { Resources } from "../resources.js";
import { GameUnit } from "./game_unit.js";
import { Unit, TargetChasingUnit } from "./unit.js";

export class Kamakaze extends TargetChasingUnit {
    constructor(player : Player, pos : Pos, name : string, hp : number, speed : number, color : string,  private damage : number, private range : number) {
        super(player, name, pos, hp, speed, color);
    }
    inRange(other: Unit): boolean {
        return this.isAdjacent(other);
    }

    inRangeMove(board : Board) {
        if (this.inRange(this.target)) {
            this.explode(board);
        }
    }

    explode(board : Board) {
        this.doDamageInArea(board, this.pos, this.range, this.damage);
        this.doDamage(this.hp); // make sure this unit died too
    }
}

class kamakazeUnit extends GameUnit {
    constructor(
        public name : string, public cost : Resources, public speed : number, public damage : number,
        public hp : number, public color : string, public blurb : string, public range,
    ) {
        super(name, cost, blurb);
    }
    construct(player: Player, pos: Pos): Unit {
        return new Kamakaze(player, pos, this.name, this.hp, this.speed, this.color, this.damage, this.range);
    }
}

export const KamakazeUnit : kamakazeUnit = new kamakazeUnit("Kamakaze", new Resources(50, 30, 0), 9, 10, 3, "#DD0000", "Explodes once adjacent to its target, hurting all units around it for 4 blocks with 10 points of damage", 16);
