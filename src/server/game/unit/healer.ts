import { Board } from "../board.js";
import { Heart } from "../heart.js";
import { Player } from "../player.js";
import { Pos } from "../pos.js";
import { Resources } from "../resources.js";
import { Defense } from "./defense.js";
import { GameUnit } from "./game_unit.js";
import { ResourceUnit } from "./resource_unit.js";
import { Unit, TargetChasingUnit } from "./unit.js";

export class Healer extends TargetChasingUnit {
    constructor(player: Player, pos: Pos, public range : number, public healRange) {
        super(player, HealerUnit.NAME, pos, HealerUnit.HP, HealerUnit.SPEED, HealerUnit.COLOR);
    }
    inRange(other: Unit): boolean {
        return this.inRangeForDistance(other, this.range);
    }
    inRangeMove(board: Board) {
        return
        if (this.target.hp < this.target.totalHP) {
            this.target.hp += 2;
            if (this.target.hp > this.target.totalHP) {
                this.target.hp = this.target.totalHP;
            }
        }
    }
    doMove(board: Board): void {
        super.doMove(board);
        if (this.inRangeForDistance(this.target, this.healRange)) {
            this.healTarget();
        }
    }
    healTarget() {
        if (this.target.hp < this.target.totalHP) {
            this.target.hp += 2;
            if (this.target.hp > this.target.totalHP) {
                this.target.hp = this.target.totalHP;
            }
        }
    }
    findNewTarget(units: Unit[]): void {
        if (this.hasTarget() && this.target.hp < this.target.totalHP) {
            return;
        }
        
        // either have no target or target is at full health
        this.target = null;
        // now no target
        // find a target not at full health
        this.findTargetWithPredicate(units, (unit : Unit) => {
            return unit.team == this.team && unit != this &&
                unit.hp < unit.totalHP &&
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
                !(unit instanceof ResourceUnit) &&
                !(unit instanceof Defense) &&
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
    static BLURB = "Targets friendly non-building units and heals them 2 hp every second or so";
    static RANGE = 16;
    static HEAL_RANGE = 25;
    constructor() {
        super(HealerUnit.NAME, HealerUnit.COST, HealerUnit.BLURB);
    }
    construct(player: Player, pos: Pos): Unit {
        return new Healer(player, pos, HealerUnit.RANGE, HealerUnit.HEAL_RANGE);
    }

}