import { Resources } from "../../resources.js";
import { Board } from "../../board.js";
import { Player } from "../../player.js";
import { Pos } from "../../pos.js";
import { Unit } from "../unit.js";
import { Melee, MeleeUnit } from "../melee_unit.js";
import { UnitData } from "../../../../shared/types.js";

class Ninja extends Melee {
    constructor(player : Player, name : string, pos : Pos, hp : number, moveSpeed : number, attackSpeed : number, color : string, damage : number, public range : number) {
        super(player, name, pos, hp, moveSpeed, attackSpeed, color, damage);
    }

    inRangeMove(board: Board): void {
        this.invisible = false;
        super.inRangeMove(board);
    }

    doMove(board: Board): void {
        this.invisible = true;
        if (this.inRangeForDistance(this.target, this.range)) {
            this.invisible = false;
        }
        super.doMove(board);
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

export const NinjaUnit : ninjaUnit = new ninjaUnit("Ninja", new Resources(333, 56, 23), 7, 3, 20, "#000000", "Invisible until its time for combat", 25);