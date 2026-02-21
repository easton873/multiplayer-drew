import { Board } from "../board.js";
import { Player } from "../player.js";
import { Pos } from "../pos.js";
import { Ranged } from "./ranged_unit.js";
import { Unit } from "./unit.js";

export abstract class Defense extends Ranged {
    constructor(player: Player, name: string, pos: Pos, hp: number, speed: number, color: string, range : number, damage : number) {
        super(player, name, pos, hp, speed, speed, color, damage, range);
    }
    
    doMove(board: Board): void {
        return;
    }
}