import { Random } from "../../math.js";
import { Board } from "../../board.js";
import { Pos } from "../../pos.js";
import { getTerritory } from "../combat/helper.js";
import { Unit, UnitWithCounter } from "../unit.js";
import { GameUnit } from "../game_unit.js";
import { Player } from "../../player.js";
import { Resources } from "../../resources.js";

class WeakDefender extends UnitWithCounter {
    private spots: Pos[];
    private hasTerritory: boolean = false;
    doMove(board: Board) {
        if (!this.hasTerritory) {
            this.spots = getTerritory(board, this.owner.hearts);
            this.hasTerritory = true;
        }
        this.pos = Random.fromList(this.spots).clone();
        for (let i = 0; i < board.entities.length; ++i) {
            if (board.entities[i].pos.equals(this.pos) && board.entities[i].team != this.team) {
                this.doDamage(board.entities[i], 10);
                this.kill()
                return;
            }
        }
    }
}

class weakDefenderUnit extends GameUnit {
    construct(player: Player, pos: Pos): Unit {
        return new WeakDefender(player, this.getName(), pos, 1000, 1, "#c51919")
    }
}

export const WeakDefenderUnit: weakDefenderUnit = new weakDefenderUnit("Weak Defender", new Resources({ randomonium: 2}), "Randomly defends your territory");