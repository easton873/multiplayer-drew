import { UnitRangedAttackData } from "../../../shared/types.js";
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
        this.doDamage(this.target, this.damage);
    }

    inRange(other: Unit): boolean {
        return this.inRangeForDistance(other, this.range);
    }

    getRangedData() : UnitRangedAttackData {
        if (!this.target) {
            return super.getRangedData();
        }
        return {
            attacking: this.attacking,
            ranged: true,
            targetX: this.target.pos.x,
            targetY: this.target.pos.y,
            counter: this.attackCounter.remaining,
            counterTotal: this.attackCounter.total
        };
    }
}

export class RangedAreaDamage extends Ranged {
    constructor(player : Player, name : string, pos : Pos, hp : number, moveSpeed : number, attackSpeed : number, color : string, public damage : number, public range : number, private areaRadius: number) {
        super(player, name, pos, hp, moveSpeed, attackSpeed, color, damage, range);
    }
    inRangeMove(board: Board): void {
        this.doDamageInArea(board, this.target.pos, this.areaRadius, this.damage)
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

export class rangedAreaDamageUnit extends RangedUnit {
    constructor(name: string, cost: Resources, moveSpeed: number, attackSpeed: number, damage: number, hp: number, color: string, blurb: string, range: number, private areaRadius: number) {
        super(name, cost, moveSpeed, attackSpeed, damage, hp, color, blurb, range);
    }
    construct(player: Player, pos: Pos): Unit {
        return new RangedAreaDamage(player, this.name, pos, this.hp, this.moveSpeed, this.attackSpeed, this.color, this.damage, this.range, this.areaRadius);
    }
}

export const ArcherUnit : RangedUnit = new RangedUnit("Archer", new Resources({ gold: 40 }), 10, 10, 3, 1, "#66ffff", "With 1 HP, shoots its target from 4 blocks away for 1 damage", 16);
export const SniperUnit : RangedUnit = new RangedUnit("Sniper", new Resources({ gold: 30, wood: 250, stone: 60 }), 60, 30, 20, 3, "#1b6026", "Shoots really far and slow", 400);
export const FireballThrowerUnit : rangedAreaDamageUnit = new rangedAreaDamageUnit("Fireball Thrower", new Resources({ gold: 75, wood: 5, stone: 35 }), 10, 10, 3, 3, "#cc7a00", "Throws fireballs dealing 3 damage to anything adjacent to its target", 16, 1);