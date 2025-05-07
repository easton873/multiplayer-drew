import { Heart } from "../heart.js";
import { Player } from "../player.js";
import { Pos } from "../pos.js";
import { Resources } from "../resources.js";
import { GameUnit } from "./game_unit.js";
import { Melee } from "./melee_unit.js";
import { ResourceUnit } from "./resource_unit.js";
import { Unit } from "./unit.js";

export class Sabotager extends Melee {
    constructor(player: Player, pos: Pos) {
            super(player, SabotagerUnit.NAME, pos, SabotagerUnit.HP, SabotagerUnit.SPEED, SabotagerUnit.COLOR, SabotagerUnit.DAMAGE);
        }
        findNewTarget(units: Unit[]): void {
            if (this.hasTarget()) {
                return;
            }
            super.findNewTarget(this.getResources(units));
        }
        getResources(units : Unit[]) : Unit[] {
            return units.filter((unit : Unit) => unit instanceof ResourceUnit && !(unit instanceof Heart));
        }
}

export class SabotagerUnit extends GameUnit {
    static NAME = "Sabotager";
    static COST = new Resources(20, 10, 0);
    static SPEED = 5;
    static DAMAGE = 2;
    static HP = 5;
    static COLOR = "#00AA00";
    static BLURB = "Goes straight for the closest enemy resources, ignoring all other units";
    constructor() {
        super(SabotagerUnit.NAME, SabotagerUnit.COST, SabotagerUnit.BLURB);
    }
    construct(player: Player, pos: Pos): Unit {
        return new Sabotager(player, pos);
    }
}