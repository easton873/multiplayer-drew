import { Player } from "../player.js";
import { Pos } from "../pos.js";
import { Resources } from "../resources.js";
import { UnitWithTarget } from "./unit.js";

export abstract class MeleeUnit extends UnitWithTarget {
    protected damage;
    constructor(player : Player, pos : Pos, hp : number, speed : number, cost : Resources) {
        super(player, pos, hp, speed, cost);
        this.range = 1;
    }
    inRangeMove() {
        this.target.doDamage(this.damage);
    }
}