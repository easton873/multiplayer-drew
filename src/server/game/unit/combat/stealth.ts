import { Resources } from "../../resources.js";
import { Board } from "../../board.js";
import { Player } from "../../player.js";
import { Pos } from "../../pos.js";
import { Unit } from "../unit.js";
import { Melee, MeleeUnit } from "../melee_unit.js";
import { ResourceUnit } from "../resource_unit.js";
import { Heart } from "../../heart.js";
import { CombatUnit } from "./combat.js";

class Ninja extends Melee {
    constructor(player : Player, name : string, pos : Pos, hp : number, moveSpeed : number, attackSpeed : number, color : string, damage : number, public range : number) {
        super(player, name, pos, hp, moveSpeed, attackSpeed, color, damage);
    }

    inRangeMove(board: Board): void {
        this.goVisibile();
        super.inRangeMove(board);
    }

    doMove(board: Board): void {
        this.goInvisible();
        if (this.inRangeForDistance(this.target, this.range)) {
            this.goVisibile();
        }
        super.doMove(board);
    }
}

class Spy extends Ninja {
    private goneInvisible : boolean = false;
    constructor(player : Player, name : string, pos : Pos, hp : number, moveSpeed : number, attackSpeed : number, color : string, damage : number, range : number) {
        super(player, name, pos, hp, moveSpeed, attackSpeed, color, damage, range);
    }

    isValidTarget(unit: Unit): boolean {
        return super.isValidTarget(unit) && 
        unit instanceof ResourceUnit &&
        !(unit instanceof Heart);
    }

    goInvisible(): void {
        if (this.goneInvisible) {
            return;
        }
        this.goneInvisible = true;
        return super.goInvisible();
    }
}

class Assassain extends Melee {
    private assassainationCompleted : boolean = false;
    constructor(player : Player, name : string, pos : Pos, hp : number, moveSpeed : number, attackSpeed : number, color : string, damage : number) {
        super(player, name, pos, hp, moveSpeed, attackSpeed, color, damage);
    }

    inRangeMove(board: Board): void {
        if (this.assassainationCompleted) {
            super.inRangeMove(board);
            return;
        }
        this.doAssassaination();
    }

    doAssassaination() {
        this.target.kill();
        this.assassainationCompleted = true;
        this.goVisibile();
    }

    doMove(board: Board): void {
        if (!this.assassainationCompleted) {
            this.goInvisible();
        }
        super.doMove(board);
    }

    findNewTarget(units: Unit[]): void {
        if (this.target && !this.assassainationCompleted) { 
            return;
        }
        super.findNewTarget(units);
    }

    isValidTarget(unit: Unit): boolean {
        if (this.assassainationCompleted) {
            return super.isValidTarget(unit);
        }
        return super.isValidTarget(unit) &&
        unit instanceof CombatUnit;
    }
}

class ninjaUnit extends MeleeUnit {
    constructor(name : string, cost : Resources, speed : number, damage : number, 
        hp : number, color : string, blurb : string, public range : number) {
        super(name, cost, speed, speed, damage, hp, color, blurb);
    }

    construct(player: Player, pos: Pos): Unit {
        return new Ninja(player, this.name, pos, this.hp, this.moveSpeed, this.attackSpeed, this.color, this.damage, this.range);
    }
}

class spyUnit extends ninjaUnit {
    construct(player: Player, pos: Pos): Unit {
        return new Spy(player, this.name, pos, this.hp, this.moveSpeed, this.attackSpeed, this.color, this.damage, this.range);
    }
}

class assassainUnit extends MeleeUnit {
     constructor(name : string, cost : Resources, speed : number, damage : number, 
        hp : number, color : string, blurb : string) {
        super(name, cost, speed, speed, damage, hp, color, blurb);
    }

    construct(player: Player, pos: Pos): Unit {
        return new Assassain(player, this.name, pos, this.hp, this.moveSpeed, this.attackSpeed, this.color, this.damage);
    }
}

export const NinjaUnit : ninjaUnit = new ninjaUnit("Ninja", new Resources(333, 56, 23), 7, 3, 20, "#000000", "Invisible until its time for combat", 25);
export const SpyUnit : spyUnit = new spyUnit("Spy", new Resources(350, 25, 125), 9, 1, 10, "#ac2020", "Turns invisible and attacks resources", 9);
export const AssassainUnit : assassainUnit = new assassainUnit("Assassain", new Resources(300, 0, 0), 5, 3, 20, "#660b0b", "Assassainates its target very effectively")