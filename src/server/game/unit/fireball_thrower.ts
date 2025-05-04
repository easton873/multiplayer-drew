import { Board } from "../board.js";
import { Player } from "../player.js";
import { Pos } from "../pos.js";
import { Resources } from "../resources.js";
import { GameUnit } from "./game_unit.js";
import { RangedUnit } from "./ranged_unit.js";
import { Unit } from "./unit.js";

export class FireballThrower extends RangedUnit {
    constructor(player: Player, pos: Pos, public explosionRange : number) {
        super(player, FireballThrowerUnit.NAME, pos, FireballThrowerUnit.HP, FireballThrowerUnit.SPEED, FireballThrowerUnit.COLOR, FireballThrowerUnit.DAMAGE, FireballThrowerUnit.RANGE);
    }

    inRangeMove(board: Board): void {
        this.doDamageInArea(board, this.target.pos, this.explosionRange, this.damage)
    }
}

export class FireballThrowerUnit extends GameUnit {
    static NAME = "Fireball Thrower";
    static COST = new Resources(75, 5, 35);
    static SPEED = 10;
    static DAMAGE = 3;
    static HP = 3;
    static COLOR = "#cc7a00";
    static BLURB = "Throws fireballs dealing 3 damage to anything adjacent to its target";
    static RANGE = 16;
    static EXPLOSION_RANGE = 1;
    constructor() {
        super(FireballThrowerUnit.NAME, FireballThrowerUnit.COST, FireballThrowerUnit.BLURB);
    }
    construct(player: Player, pos: Pos): Unit {
        return new FireballThrower(player, pos, FireballThrowerUnit.EXPLOSION_RANGE);
    }
}