import { Player } from "../player.js";
import { Pos } from "../pos.js";
import { Resources } from "../resources.js";
import { GameUnit } from "./game_unit.js";
import { MeleeUnit } from "./melee_unit.js";
import { Unit } from "./unit.js";

export class QuickAttacker extends MeleeUnit {
    constructor(player: Player, pos: Pos) {
        super(player, QuickAttackerUnit.NAME, pos, QuickAttackerUnit.HP, QuickAttackerUnit.SPEED, QuickAttackerUnit.COLOR, QuickAttackerUnit.DAMAGE);
    }
}

export class QuickAttackerUnit extends GameUnit {
    static NAME = "Sabotager";
    static COST = new Resources(30, 20, 0);
    static SPEED = 5;
    static DAMAGE = 1;
    static HP = 3;
    static COLOR = "#99ccff";
    static BLURB = "A soldier that got a speed boost";
    constructor() {
        super(QuickAttackerUnit.NAME, QuickAttackerUnit.COST, QuickAttackerUnit.BLURB);
    }
    construct(player: Player, pos: Pos): Unit {
        return new QuickAttacker(player, pos);
    }
}