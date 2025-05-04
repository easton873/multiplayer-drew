import { Board } from "../board.js";
import { Player } from "../player.js";
import { Pos } from "../pos.js";
import { Unit, TargetChasingUnit } from "./unit.js";

export abstract class RangedUnit extends TargetChasingUnit {
    constructor(player : Player, name : string, pos : Pos, hp : number, speed : number, color : string, public damage : number, public range : number) {
        super(player, name, pos, hp, speed, color);
    }
    inRangeMove(board : Board) {
        this.target.doDamage(this.damage);
    }

    inRange(other: Unit): boolean {
        return this.inRangeForDistance(other, this.range);
    }
}