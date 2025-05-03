import { Board } from "../board.js";
import { Heart } from "../heart.js";
import { Player } from "../player.js";
import { Pos } from "../pos.js";
import { Resources } from "../resources.js";
import { GameUnit } from "./game_unit.js";
import { Unit, UnitWithTarget } from "./unit.js";

export class Healer extends UnitWithTarget {
    constructor(player: Player, pos: Pos, public range : number) {
        super(player, HealerUnit.NAME, pos, HealerUnit.HP, HealerUnit.SPEED, HealerUnit.COLOR);
    }
    inRange(other: Unit): boolean {
        return this.inRangeForDistance(other, this.range);
    }
    inRangeMove(board: Board) {
        if (this.target.currHp < this.target.hp) {
            this.target.currHp += 2;
            if (this.target.currHp > this.target.hp) {
                this.target.currHp = this.target.hp;
            }
        }
    }
    findNewTarget(units: Unit[]): void {
        if (this.hasTarget() && this.target.currHp < this.target.hp) {
            return;
        }
        
        // either have no target or target is at full health
        this.target = null;
        // now no target
        // find a target not at full health
        this.findTargetWithPredicate(units, (unit : Unit) => {
            return unit.team == this.team && unit != this &&
                unit.currHp < unit.hp &&
                !(unit instanceof Heart) &&
                !(unit instanceof Healer);
        });
        if (this.hasTarget()) {
            return;
        }
        // if this point is reached, none of your units need healing
        // so just find the closest unit to hang out with
        this.findTargetWithPredicate(units, (unit : Unit) => {
            return unit.team == this.team && unit != this &&
                !(unit instanceof Heart) &&
                !(unit instanceof Healer);
        });
    }
}

export class HealerUnit extends GameUnit {
    static NAME = "Healer";
    static COST = new Resources(20, 100, 20);
    static HP = 5;
    static SPEED = 8;
    static COLOR = "#DDDDDD";
    static RANGE = 9;
    constructor() {
        super(HealerUnit.NAME, HealerUnit.COST);
    }
    construct(player: Player, pos: Pos): Unit {
        return new Healer(player, pos, HealerUnit.RANGE);
    }

}