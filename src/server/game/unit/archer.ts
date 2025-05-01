import { ARCHER_NAME } from "../../../shared/types.js";
import { Player } from "../player.js";
import { Pos } from "../pos.js";
import { Resources } from "../resources.js";
import { MeleeUnit } from "./melee_unit.js";
import { Unit } from "./unit.js";

export class Archer extends MeleeUnit {
    static GOLD_COST = 15;
    static WOOD_COST = 5;
    static STONE_COST = 0;
    static SPEED = 10;
    static DAMAGE = 1;
    static HP = 1;
    static COLOR = "#66ffff";
    static RANGE = 16;
    constructor(player : Player, pos : Pos) {
        super(player, pos, Archer.HP, Archer.SPEED, new Resources(Archer.GOLD_COST, Archer.WOOD_COST, Archer.STONE_COST), Archer.COLOR);
        this.damage = Archer.DAMAGE;
        this.name = ARCHER_NAME;
    }
    inRange(other: Unit) : boolean {
        return this.pos.distanceTo(other.pos) <= Archer.RANGE;
    }
}