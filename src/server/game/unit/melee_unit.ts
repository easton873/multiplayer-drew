import { Board } from "../board.js";
import { Player } from "../player.js";
import { Pos } from "../pos.js";
import { Resources } from "../resources.js";
import { UnitWithTarget } from "./unit.js";

export abstract class MeleeUnit extends UnitWithTarget {
    protected damage;
    constructor(player : Player, pos : Pos, hp : number, speed : number, cost : Resources, color : string) {
        super(player, pos, hp, speed, cost, color);
        this.range = 1;
    }
    inRangeMove(board : Board) {
        this.target.doDamage(this.damage);
    }
}