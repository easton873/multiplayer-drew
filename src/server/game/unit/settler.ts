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
    moveDir: { dx: number, dy: number };
    constructor(player : Player, name : string, pos : Pos, hp : number, speed : number, color : string) {
        super(player, name, pos, hp, speed, color);
        this.moveDir = this.getMoveDir();
    }

    getMoveDir()  {
        let pos = this.pos.clone();
        const closest = this.owner.hearts.getClosestHeart(pos);
        if (!closest || closest.pos.equals(pos)) {
            this.moveDir = { dx: 1, dy: 0 };
        } else {
            const rawDx = pos.x - closest.pos.x;
            const rawDy = pos.y - closest.pos.y;
            const angle = Math.atan2(rawDy, rawDx);
            const sector = ((Math.round(angle / (Math.PI / 4)) % 8) + 8) % 8;
            const dirs = [
                { dx: 1,  dy: 0  }, // 0: E
                { dx: 1,  dy: 1  }, // 1: NE
                { dx: 0,  dy: 1  }, // 2: N
                { dx: -1, dy: 1  }, // 3: NW
                { dx: -1, dy: 0  }, // 4: W
                { dx: -1, dy: -1 }, // 5: SW
                { dx: 0,  dy: -1 }, // 6: S
                { dx: 1,  dy: -1 }, // 7: SE
            ];
            return dirs[sector];
        }
    }

    doMove(board: Board) {
        if (this.moveCount >= this.goal) {
            this.spawnHeart();
            return;
        }
        if (this.moveDir.dx > 0) this.pos.moveRight();
        else if (this.moveDir.dx < 0) this.pos.moveLeft();
        if (this.moveDir.dy > 0) this.pos.moveUp();
        else if (this.moveDir.dy < 0) this.pos.moveDown();
        this.moveCount++;
    }

    spawnHeart() {
        this.owner.addHeart(new Heart(this.owner, this.pos.clone(), new EraHeartInfo(10, 30, new Resources(1, 0, 0), 25)));
        this.doDamage(this.hp);
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