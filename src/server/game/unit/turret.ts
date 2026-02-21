import { Player } from "../player.js";
import { Pos } from "../pos.js";
import { Resources } from "../resources.js";
import { Defense } from "./defense.js";
import { GameUnit } from "./game_unit.js";
import { Unit } from "./unit.js";

export class Turret extends Defense {
    constructor(player : Player, pos : Pos) {
        super(player, TurretUnit.NAME, pos, TurretUnit.HP, TurretUnit.SPEED, TurretUnit.COLOR, TurretUnit.RANGE, TurretUnit.DAMAGE);
    }
}

export class TurretUnit extends GameUnit {
    static NAME = "Turret";
    static COST = new Resources(200, 50, 0);
    static SPEED = 8;
    static DAMAGE = 1;
    static HP = 5;
    static COLOR = "#996633";
    static BLURB = "Stands guard whereever it is placed and shoots at anything that comes within";
    static RANGE = 25;
    constructor() {
        super(TurretUnit.NAME, TurretUnit.COST, TurretUnit.BLURB);
    }
    construct(player: Player, pos: Pos): Unit {
        return new Turret(player, pos);
    }
}