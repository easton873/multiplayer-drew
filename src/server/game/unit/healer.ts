import { Board } from "../board.js";
import { Heart } from "../heart.js";
import { Player } from "../player.js";
import { Pos } from "../pos.js";
import { Resources } from "../resources.js";
import { Defense } from "./defense.js";
import { Ranged, RangedUnit } from "./ranged_unit.js";
import { ResourceUnit } from "./resource_unit.js";
import { Unit } from "./unit.js";

// This probably breaks because when a unit takes damage it could die and then the target
// of a unit becomes null, this is a bug I just found, but I haven't looksed so I don't
// know if that is quite it.
export class Healer extends Ranged {
    inRangeMove(board: Board) {
        this.healTarget();
    }
    healTarget() {
        this.target.hp += this.damage;
        this.clampHealth(this.target);
    }
    clampHealth(unit : Unit) {
        if (unit.hp > unit.totalHP) {
            unit.hp = unit.totalHP;
        }
    }
    findNewTarget(units: Unit[]): void {
        this.findTargetWithPredicate(units, (unit : Unit) => {
            return this.isOnSameTeam(unit) &&
            unit.hp < unit.totalHP; // has to need healing
        });
        if (this.hasTarget()) {
            return;
        }
        this.findTargetWithPredicate(units, (unit : Unit) => {
            return this.isOnSameTeam(unit);
        });
    }

    isOnSameTeam(unit : Unit) : boolean {
        return this != unit && // won't target self
        unit.team == this.team; // has to be same team
    }
}

class healerUnit extends RangedUnit {
    construct(player: Player, pos: Pos): Unit {
        return new Healer(player, this.name, pos, this.hp, this.moveSpeed, this.attackSpeed, this.color, this.damage, this.range);
    }
}

export const HealerUnit : healerUnit = new healerUnit("Healer", new Resources(20, 100, 20), 8, 8, 2, 5, "#DDDDDD", "Targets friendly non-building units and heals them 2 hp every second or so", 25);