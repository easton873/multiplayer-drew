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
    inRange(other: Unit): boolean {
        return this.pos.isAdjacent(other.pos);
    }
    findNewTarget(units: Unit[]): void {
        if (this.hasTarget()) {
            return;
        }
        super.findNewTarget(this.getHearts(units));
    }
    getHearts(units : Unit[]) : Unit[] {
        let result : Unit[] = [];
        units.forEach((unit : Unit) => {
            if (unit instanceof Heart) {
                result.push(unit);
            }
        });
        return result
    }
}

export class GoblinUnit extends GameUnit {
    static NAME = "Goblin";
    static COST = new Resources(20, 10, 0);
    static SPEED = 7;
    static DAMAGE = 1;
    static HP = 1;
    static COLOR = "#008800";
    constructor() {
        super(GoblinUnit.NAME, GoblinUnit.COST);
    }
    construct(player: Player, pos: Pos): Unit {
        return new Goblin(player, pos);
    }

}