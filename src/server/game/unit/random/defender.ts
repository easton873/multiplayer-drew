import { Random } from "../../math.js";
import { Board } from "../../board.js";
import { Pos } from "../../pos.js";
import { getTerritory } from "../combat/helper.js";
import { Unit, UnitWithCounter } from "../unit.js";
import { GameUnit } from "../game_unit.js";
import { Player } from "../../player.js";
import { Resources } from "../../resources.js";

class Defender extends UnitWithCounter {
    private spots: Pos[];
    private hasTerritory: boolean = false;
    constructor(player: Player, name: string, pos: Pos, hp: number, speed: number, color: string, private damage: number) {
        super(player, name, pos, hp, speed, color);
    }
    doMove(board: Board) {
        if (!this.hasTerritory) {
            this.spots = getTerritory(board, this.owner.hearts);
            this.hasTerritory = true;
        }
        this.pos = Random.fromList(this.spots).clone();
        for (let i = 0; i < board.entities.length; ++i) {
            if (board.entities[i].pos.equals(this.pos) && board.entities[i].team != this.team) {
                this.doDamage(board.entities[i], this.damage);
                this.kill()
                return;
            }
        }
    }
}

class defenderUnit extends GameUnit {
    constructor(name: string, cost: Resources, blurb: string, private hp: number, private speed: number, private color: string, private damage: number) {
        super(name, cost, blurb);
    }
    construct(player: Player, pos: Pos): Unit {
        return new Defender(player, this.getName(), pos, this.hp, this.speed, this.color, this.damage);
    }
}

export const WeakDefenderUnit: defenderUnit = new defenderUnit("Weak Defender", new Resources({ randomonium: 2}), "Randomly defends your territory", 10, 30, "#c51919", 10);
export const DefenderUnit: defenderUnit = new defenderUnit("Defender", new Resources( {randomonium: 100}), "Randomly defends your territory", 100, 10, "#700909", 20);
export const SuperDefenderUnit: defenderUnit = new defenderUnit("Super Defender", new Resources({randomonium: 250}), "Randomly defends your territory", 1000, 2, "#450667", 100);