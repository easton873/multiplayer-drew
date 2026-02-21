import { Board } from "../board.js";
import { Player } from "../player.js";
import { Pos } from "../pos.js";
import { Resources } from "../resources.js";
import { TargetChasingUnit } from "./combat/combat.js";
import { GameUnit } from "./game_unit.js";
import { Unit } from "./unit.js";

export class Ranged extends TargetChasingUnit {
    constructor(player : Player, name : string, pos : Pos, hp : number, moveSpeed : number, attackSpeed : number, color : string, public damage : number, public range : number) {
        super(player, name, pos, hp, color, moveSpeed, attackSpeed);
    }
    inRangeMove(board : Board) {
        this.target.doDamage(this.damage);
    }

    inRange(other: Unit): boolean {
        return this.inRangeForDistance(other, this.range);
    }
}

export class RangedUnit extends GameUnit {
    constructor(public name : string, cost : Resources, public moveSpeed : number, public attackSpeed : number,
        public damage : number, public hp : number, public color : string, blurb : string, public range : number) {
        super(name, cost, blurb);
    }

    construct(player: Player, pos: Pos): Unit {
        return new Ranged(player, this.name, pos, this.hp, this.moveSpeed, this.attackSpeed, this.color, this.damage, this.range);
    }
}

class fireballThrowerUnit extends RangedUnit {
    constructor() {
        super("Fireball Thrower", new Resources(75, 5, 35), 10, 10, 3, 3, "#cc7a00", "Throws fireballs dealing 3 damage to anything adjacent to its target", 16);
    }
    construct(player: Player, pos: Pos): Unit {
        return new class extends Ranged {
            inRangeMove(board: Board): void {
                this.doDamageInArea(board, this.target.pos, 1, this.damage)
            }
        }(player, this.name, pos, this.hp, this.moveSpeed, this.attackSpeed, this.color, this.damage, this.range);
    }
}

export const ArcherUnit : RangedUnit = new RangedUnit("Archer", new Resources(40, 0, 0), 10, 10, 3, 1, "#66ffff", "With 1 HP, shoots its target from 4 blocks away for 1 damage", 16);
export const SniperUnit : RangedUnit = new RangedUnit("Sniper", new Resources(30, 250, 60), 60, 30, 50, 3, "#1b6026", "Shoots really far and slow", 625);
export const FireballThrowerUnit : fireballThrowerUnit = new fireballThrowerUnit();