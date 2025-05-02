import { Unit } from "./unit.js";
import { MeleeUnit } from "./melee_unit.js";
import { Player } from "../player.js";
import { Pos } from "../pos.js";
import { Resources } from "../resources.js";
import { SOLDIER_NAME } from "../../../shared/types.js";
import { GameUnit } from "./game_unit.js";

export class Soldier extends MeleeUnit {
    static COST = new Resources(5, 0, 0);
    static SPEED = 10;
    static DAMAGE = 1;
    static HP = 3;
    static COLOR = "#000000";
    inRange(other: Unit): boolean {
        return this.pos.isAdjacent(other.pos);
    }

    constructor(player : Player, name : string, pos : Pos) {
        super(player, name, pos, Soldier.HP, Soldier.SPEED, Soldier.COLOR, Soldier.DAMAGE);
        this.damage = Soldier.DAMAGE;
    }
}

export class SoldierUnit extends GameUnit {
    constructor() {
        super(SOLDIER_NAME, Soldier.COST);
    }
    construct(player : Player, pos : Pos): Unit {
        return new Soldier(player, this.creationInfo.getName(), pos);
    }
}