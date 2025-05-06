import { Heart } from "../heart.js";
import { Player } from "../player.js";
import { Pos } from "../pos.js";
import { Resources } from "../resources.js";
import { GameUnit } from "./game_unit.js";
import { MeleeUnit } from "./melee_unit.js";
import { Unit } from "./unit.js";

export class Goblin extends MeleeUnit {
    constructor(player: Player, pos: Pos) {
        super(player, GoblinUnit.NAME, pos, GoblinUnit.HP, GoblinUnit.SPEED, GoblinUnit.COLOR, GoblinUnit.DAMAGE);
    }
    findNewTarget(units: Unit[]): void {
        if (this.hasTarget()) {
            return;
        }
        super.findNewTarget(this.getHearts(units));
    }
    getHearts(units : Unit[]) : Unit[] {
        return units.filter((unit : Unit) => unit instanceof Heart);
    }
}

export class GoblinUnit extends GameUnit {
    static NAME = "Goblin";
    static COST = new Resources(20, 10, 0);
    static SPEED = 7;
    static DAMAGE = 1;
    static HP = 1;
    static COLOR = "#008800";
    static BLURB = "Goes straight for the closest enemy heart, ignoring all other units";
    constructor() {
        super(GoblinUnit.NAME, GoblinUnit.COST, GoblinUnit.BLURB);
    }
    construct(player: Player, pos: Pos): Unit {
        return new Goblin(player, pos);
    }
}