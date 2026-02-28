import { Board } from "../board.js";
import { Player } from "../player.js";
import { Pos } from "../pos.js";
import { Resources } from "../resources.js";
import { Ranged, RangedUnit } from "./ranged_unit.js";
import { Unit } from "./unit.js";

class Catapult extends Ranged {
    doDamage(unit: Unit, damage: number): void {
        unit.takeSiegeDamage(damage);
    }

    inRangeMove(board: Board): void {
        this.doDamageInArea(board, this.target.pos, 3, 2);
        if (this.hasTarget()) { // if the target takes damage, it could die
            this.doDamage(this.target, this.damage);
        }
    }
}

class catapultUnit extends RangedUnit {
    construct(player: Player, pos: Pos): Unit {
        return new Catapult(player, this.name, pos, this.hp, this.moveSpeed, this.attackSpeed, this.color, this.damage, this.range);
    }
}

export const CatapultUnit : catapultUnit = new catapultUnit("Catapult", new Resources(35, 200, 20), 60, 60, 3, 10, "#000000", "Specializes at killing buildings", 100);