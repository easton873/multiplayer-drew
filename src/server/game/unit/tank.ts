import { Player } from "../player.js";
import { Pos } from "../pos.js";
import { Resources } from "../resources.js";
import { GameUnit } from "./game_unit.js";
import { MeleeUnit } from "./melee_unit.js";
import { Unit } from "./unit.js";

export class Tank extends MeleeUnit {
    constructor(player: Player, pos: Pos) {
        super(player, TankUnit.NAME, pos, TankUnit.HP, TankUnit.SPEED, TankUnit.COLOR, TankUnit.DAMAGE);
    }
}

export class TankUnit extends GameUnit {
    static NAME = "Tank";
    static COST = new Resources(50, 50, 50);
    static SPEED = 30;
    static DAMAGE = 1;
    static HP = 50;
    static COLOR = "#AAAAAA";
    static BLURB = "50 HP, moves once every 3 seconds and does 1 damage to its target when adjacent to it";
    constructor() {
        super(TankUnit.NAME, TankUnit.COST, TankUnit.BLURB);
    }
    construct(player: Player, pos: Pos): Unit {
        return new Tank(player, pos);
    }
}