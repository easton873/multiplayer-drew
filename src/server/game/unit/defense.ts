import { Board } from "../board.js";
import { Player } from "../player.js";
import { Pos } from "../pos.js";
import { Unit, UnitWithTarget } from "./unit.js";

export abstract class Defense extends UnitWithTarget {
    constructor(player: Player, name: string, pos: Pos, hp: number, speed: number, color: string, public range : number, public damage : number) {
        super(player, name, pos, hp, speed, color);
    }
    doMove(board: Board) {
        this.findTargetWithPredicate(board.entities, (unit : Unit) => {
            return this.pos.distanceTo(unit.pos) <= this.range &&
            unit.team != this.team;
        });
        if (this.hasTarget()) {
            this.target.doDamage(this.damage);
        }
    }
}