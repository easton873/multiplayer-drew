import { Board } from "../board.js";
import { EraHeartInfo, Heart } from "../heart.js";
import { Player } from "../player.js";
import { Pos, PositionDifference } from "../pos.js";
import { Resources } from "../resources.js";
import { GameUnit } from "./game_unit.js";
import { Unit, } from "./unit.js";

class Teleporter extends Unit {
    private targetPos : Pos = new Pos(0, 0);
    private waitingGoal : number = 30 * 3; // in seconds
    private currWaitAmount : number = 0;
    constructor(player : Player, name : string, pos : Pos, hp : number, speed : number, color : string) {
        super(player, name, pos, hp, speed, color);

        let dir : PositionDifference = this.getDirectionFromHeart();

        const halfX = this.owner.board.width / 2;
        const halfY = this.owner.board.height / 2;
        this.targetPos = new Pos(
            Math.round(dir.dx * dir.magnitude * halfX + halfX),
            Math.round((dir.dy * dir.magnitude * halfY)  + halfY)
        );
    }

    doMove(board: Board) {
        if (this.currWaitAmount >= this.waitingGoal) {
            this.pos = this.targetPos.clone();
            return; // TODO kill unit
        }
        this.currWaitAmount++;
    }
}

class teleporterUnit extends GameUnit {
    constructor(public name : string, public cost : Resources, public hp : number, public speed : number, public color : string, public blurb : string) {
        super(name, cost, blurb);
    }
    construct(player: Player, pos: Pos): Unit {
        return new Teleporter(player, this.name, pos, this.hp, this.speed, this.color);
    }
}

export const TeleporterUnit = new teleporterUnit("Teleporter", new Resources(800, 300, 1000), 17, 0, "#ee70f5", "Teleports everybody by him to another place")
