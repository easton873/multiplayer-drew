import { Player } from "../player.js";
import { Pos } from "../pos.js";
import { Resources } from "../resources.js";
import { GameUnit } from "./game_unit.js";
import { Kamakaze } from "./kamakaze.js";
import { MeleeUnit } from "./melee_unit.js";
import { Unit } from "./unit.js";

export class Archer extends MeleeUnit {
    static NAME = "Archer";
    static COST = new Resources(15, 5, 0);
    static SPEED = 10;
    static DAMAGE = 1;
    static HP = 1;
    static COLOR = "#66ffff";
    static RANGE = 16;
    constructor(player : Player, pos : Pos) {
        super(player, Archer.NAME, pos, Archer.HP, Archer.SPEED, Archer.COLOR, Archer.DAMAGE);
    }
    inRange(other: Unit) : boolean {
        return this.pos.distanceTo(other.pos) <= Archer.RANGE;
    }
}

export class ArcherUnit extends GameUnit {
    constructor() {
        super(Archer.NAME, Archer.COST);
    }
    construct(player: Player, pos: Pos): Unit {
        return new Archer(player, pos);
    }
}