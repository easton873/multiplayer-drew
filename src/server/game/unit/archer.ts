import { Player } from "../player.js";
import { Pos } from "../pos.js";
import { Resources } from "../resources.js";
import { GameUnit } from "./game_unit.js";
import { MeleeUnit } from "./melee_unit.js";
import { Unit } from "./unit.js";

export class Archer extends MeleeUnit {
    constructor(player : Player, pos : Pos, private range : number = ArcherUnit.RANGE) {
        super(player, ArcherUnit.NAME, pos, ArcherUnit.HP, ArcherUnit.SPEED, ArcherUnit.COLOR, ArcherUnit.DAMAGE);
    }
    inRange(other: Unit) : boolean {
        return this.pos.distanceTo(other.pos) <= this.range;
    }
}

export class ArcherUnit extends GameUnit {
    static NAME = "Archer";
    static COST = new Resources(15, 5, 0);
    static SPEED = 10;
    static DAMAGE = 1;
    static HP = 1;
    static COLOR = "#66ffff";
    static RANGE = 16;
    constructor() {
        super(ArcherUnit.NAME, ArcherUnit.COST);
    }
    construct(player: Player, pos: Pos): Unit {
        return new Archer(player, pos);
    }
}