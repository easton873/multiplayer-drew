import { Board } from "../board.js";
import { EraHeartInfo, Heart } from "../heart.js";
import { Player } from "../player.js";
import { Pos } from "../pos.js";
import { Resources } from "../resources.js";
import { GameUnit } from "./game_unit.js";
import { ResourceUnit } from "./resource_unit.js";
import { TargetChasingUnit, Unit, } from "./unit.js";

class Settler extends Unit {
    moveCount = 0;
    goal = 25;
    doMove(board: Board) {
        if (this.moveCount >= this.goal) {
            // heart
            this.owner.addHeart(new Heart(this.owner, this.pos.clone(), new EraHeartInfo(10, 30, new Resources(1, 0, 0), 25)));
            this.doDamage(this.hp);
        }
        this.pos.moveRight();
        this.moveCount++;
    }
}

class settlerUnit extends GameUnit {
    static NAME = "Settler";
        static COST = new Resources(500, 125, 0);
        static HP = 10;
        static SPEED = 10;
        static COLOR = "#7d560d";
        static BLURB = "Moves 25 blocks away from your heart and spawns a new heart";
        constructor() {
            super(settlerUnit.NAME, settlerUnit.COST, settlerUnit.BLURB);
        }
        construct(player: Player, pos: Pos): Unit {
            return new Settler(player, settlerUnit.NAME, pos, settlerUnit.HP, settlerUnit.SPEED, settlerUnit.COLOR);
        }
}

export const SettlerUnit : settlerUnit = new settlerUnit();