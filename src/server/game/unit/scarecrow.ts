import { Player } from "../player.js";
import { Pos } from "../pos.js";
import { Resources } from "../resources.js";
import { Defense } from "./defense.js";
import { GameUnit } from "./game_unit.js";
import { Unit } from "./unit.js";

export class Scarecrow extends Defense {
    constructor(player: Player, pos: Pos) {
        super(player, ScarecrowUnit.NAME, pos, ScarecrowUnit.HP, ScarecrowUnit.SPEED, ScarecrowUnit.COLOR, ScarecrowUnit.RANGE, ScarecrowUnit.DAMAGE);
    }
}

export class ScarecrowUnit extends GameUnit {
    static NAME = "Scarecrow";
    static COST = new Resources(3, 0, 0);
    static SPEED = 10;
    static DAMAGE = 1;
    static HP = 2;
    static COLOR = "#cc9900";
    static BLURB = "A defensive structure that attacks units adjacent to it";
    static RANGE = 2;
    constructor() {
        super(ScarecrowUnit.NAME, ScarecrowUnit.COST, ScarecrowUnit.BLURB);
    }
    construct(player: Player, pos: Pos): Unit {
        return new Scarecrow(player, pos);
    }
}