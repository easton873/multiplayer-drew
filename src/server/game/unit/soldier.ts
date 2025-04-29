import { Unit } from "./unit.js";
import { MeleeUnit } from "./melee_unit.js";
import { Player } from "../player.js";
import { Pos } from "../pos.js";
import { Resources } from "../resources.js";
import { SOLDIER_NAME } from "../../../shared/types.js";

export class Soldier extends MeleeUnit {
    static GOLD_COST = 5;
    static WOOD_COST = 0;
    static STONE_COST = 0;
    inRange(other: Unit): boolean {
        return this.pos.isAdjacent(other.pos);
    }

    constructor(player : Player, pos : Pos) {
        super(player, pos, 1, 5, new Resources(Soldier.GOLD_COST, Soldier.WOOD_COST, Soldier.STONE_COST));
        this.damage = 1;
        this.name = SOLDIER_NAME;
    }
}