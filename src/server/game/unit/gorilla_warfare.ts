import { Board } from "../board.js";
import { Player } from "../player.js";
import { Pos } from "../pos.js";
import { Resources } from "../resources.js";
import { GameUnit } from "./game_unit.js";
import { Ranged, RangedUnit } from "./ranged_unit.js";
import { Unit } from "./unit.js";

export class GorillaWarfarer extends Ranged {
    retreatPos : Pos = null;
    retreating = false;
    retreatDist = 625;
    originalSpeed;
    constructor(player : Player, name : string, pos : Pos, hp : number, speed : number, color : string, public damage : number, public range : number) {
        super(player, name, pos, hp, speed, color, damage, range);
        this.originalSpeed = speed;
    }
    doMove(board: Board): void {
        if (this.retreat()) {
            return;
        }
        super.doMove(board);
        if (!this.retreatPos && this.target && this.inRangeForDistance(this.target, this.retreatDist)) {
            this.retreatPos = this.pos.clone();
        }
    }
    inRangeMove(board: Board): void {
        super.inRangeMove(board);
        this.retreating = true;
        this.speed = 1;
    }
    retreat() : boolean {
        if (!this.retreating || !this.retreatPos) {
            return false;
        }
        if (this.pos.equals(this.retreatPos)) {
            this.reset();
            return false;
        }
        this.pos.moveTowards(this.retreatPos);
        return true;
    }
    reset() {
        this.retreating = false;
        this.speed = this.originalSpeed;
        this.retreatPos = null;
    }
}

class gorillaWarfareUnit extends RangedUnit {
    constructor() {
        super("Gorilla Warfarer", new Resources(100, 100, 100), 5, 3, 5, "#ff66ff", "A unit that attacks and then retreats, then repeats", 25)
    }
    construct(player: Player, pos: Pos): Unit {
        return new GorillaWarfarer(player, this.name, pos, this.hp, this.speed, this.color, this.damage, this.range);
    }
}

export const GorillaWarfareUnit : gorillaWarfareUnit = new gorillaWarfareUnit();