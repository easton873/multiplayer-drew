import { Board } from "../board.js";
import { Player } from "../player.js";
import { Pos } from "../pos.js";
import { Resources } from "../resources.js";
import { GameUnit } from "./game_unit.js";
import { Unit, TargetChasingUnit } from "./unit.js";

export class Melee extends TargetChasingUnit {
    constructor(player : Player, name : string, pos : Pos, hp : number, speed : number, color : string, protected damage : number) {
        super(player, name, pos, hp, speed, color);
    }
    inRangeMove(board : Board) {
        this.target.doDamage(this.damage);
    }

    inRange(other: Unit): boolean {
        return this.isAdjacent(other);
    }
}

export class MeleeUnit extends GameUnit {
    constructor(public name : string, cost : Resources, public speed : number, public damage : number,
        public hp : number, public color : string, blurb : string) {
            super(name, cost, blurb);
    }
    construct(player: Player, pos: Pos): Unit {
        return new Melee(player, this.name, pos, this.hp, this.speed, this.color, this.damage);
    }
}

class soldierUnit extends MeleeUnit {
    constructor() {
        super("Soldier", new Resources(5, 0, 0), 10, 1, 3, "#000000", "Moves once a second and does one damage to its target when adjacent to it");
    }
}

class tankUnit extends MeleeUnit {
    constructor() {
        super("Tank", new Resources(50, 50, 50), 30, 1, 50, "#AAAAAA", "50 HP, moves once every 3 seconds and does 1 damage to its target when adjacent to it");
    }
}

class quickAttackerUnit extends MeleeUnit {
    constructor() {
        super("Quick Attacker", new Resources(30, 20, 0), 5, 1, 3, "#99ccff", "A soldier that got a speed boost");
    }
}

export const SoldierUnit : soldierUnit = new soldierUnit();
export const TankUnit : tankUnit = new tankUnit();
export const QuickAttackerUnit : quickAttackerUnit = new quickAttackerUnit();