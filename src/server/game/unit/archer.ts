import { Player } from "../player.js";
import { Pos } from "../pos.js";
import { Resources } from "../resources.js";
import { GameUnit } from "./game_unit.js";
import { RangedUnit } from "./ranged_unit.js";
import { Unit } from "./unit.js";

export class Archer extends RangedUnit {
    constructor(player : Player, pos : Pos) {
        super(player, ArcherUnit.NAME, pos, ArcherUnit.HP, ArcherUnit.SPEED, ArcherUnit.COLOR, ArcherUnit.DAMAGE, ArcherUnit.RANGE);
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