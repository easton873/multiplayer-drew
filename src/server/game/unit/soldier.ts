import { Unit } from "./unit.js";
import { MeleeUnit } from "./melee_unit.js";
import { Player } from "../player.js";
import { Pos } from "../pos.js";
import { Resources } from "../resources.js";
import { GameUnit } from "./game_unit.js";

export class Soldier extends MeleeUnit {
    inRange(other: Unit): boolean {
        return this.pos.isAdjacent(other.pos);
    }

    constructor(player : Player, pos : Pos) {
        super(player, SoldierUnit.NAME, pos, SoldierUnit.HP, SoldierUnit.SPEED, SoldierUnit.COLOR, SoldierUnit.DAMAGE);
    }
}

export class SoldierUnit extends GameUnit {
    static NAME = "Soldier";
    static COST = new Resources(5, 0, 0);
    static SPEED = 10;
    static DAMAGE = 1;
    static HP = 3;
    static COLOR = "#000000";
    constructor() {
        super(SoldierUnit.NAME, SoldierUnit.COST);
    }
    construct(player : Player, pos : Pos): Unit {
        return new Soldier(player, pos);
    }
}