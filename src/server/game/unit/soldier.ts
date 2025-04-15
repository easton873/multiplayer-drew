import { Unit } from "./unit.js";
import { MeleeUnit } from "./melee_unit.js";
import { Player } from "../player.js";
import { Pos } from "../pos.js";
import { Resources } from "../resources.js";

export const SOLDIER_NAME = "Soldier";

export class Soldier extends MeleeUnit {
    inRange(other: Unit): boolean {
        return this.pos.isAdjacent(other.pos);
    }

    constructor(player : Player, pos : Pos) {
        super(player, pos, 1, 5, new Resources(5, 0, 0));
        this.damage = 1;
        this.name = SOLDIER_NAME;
    }
}