import { Player } from "../player";
import { Pos } from "../pos";
import { Resources } from "../resources";
import { UnitWithTarget } from "./unit";

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