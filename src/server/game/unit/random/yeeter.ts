import { Player } from "../../player.js";
import { Pos } from "../../pos.js";
import { Board } from "../../board.js";
import { randomPos } from "../combat/helper.js";
import { GameUnit } from "../game_unit.js";
import { Ranged } from "../ranged_unit.js";
import { Unit } from "../unit.js";
import { Resources } from "../../resources.js";

class Yeeter extends Ranged {
    inRangeMove(board: Board): void {
        super.inRangeMove(board);
        this.target.pos = randomPos(board);
    }
}

class yeeterGameUnit extends GameUnit {
    construct(player: Player, pos: Pos): Unit {
        return new Yeeter(player, this.getName(), pos, 20, 10, 10, "#991111", 1, 16);
    }
}

export const YeeterGameUnit = new yeeterGameUnit("Yeeter", new Resources({ randomonium: 10 }), "Yeets its targets to random parts of the board");