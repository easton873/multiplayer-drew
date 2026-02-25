import { Player } from "../player.js";
import { Pos } from "../pos.js";
import { Resources } from "../resources.js";
import { Melee, MeleeUnit } from "./melee_unit.js";
import { Unit } from "./unit.js";

export class Tank extends Melee {
    takeDamage(damage: number): void {
        super.takeDamage(1);
    }
}

class tankUnit extends MeleeUnit {
    constructor() {
        super("Tank", new Resources(50, 50, 50), 30, 10, 1, 50, "#AAAAAA", "50 HP, moves once every 3 seconds and does 1 damage to its target when adjacent to it");
    }

    construct(player: Player, pos: Pos): Unit {
        return new Tank(player, this.name, pos, this.hp, this.moveSpeed, this.attackSpeed, this.color, this.damage);
    }
}

export const TankUnit : tankUnit = new tankUnit();