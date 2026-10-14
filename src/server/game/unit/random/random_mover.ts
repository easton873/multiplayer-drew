import { Random } from "../../math.js";
import { Board } from "../../board.js";
import { Pos } from "../../pos.js";
import { randomPos } from "../combat/helper.js";
import { Unit } from "../unit.js";
import { Player } from "../../player.js";
import { Resources } from "../../resources.js";
import { Melee, MeleeUnit } from "../melee_unit.js";
import { GameUnit } from "../game_unit.js";

class RandomMover extends Melee {
    constructor(player : Player, name : string, pos : Pos, hp : number, moveSpeed : number, attackSpeed : number, color : string, damage : number, private numTeleports : number) {
        super(player, name, pos, hp, moveSpeed, attackSpeed, color, damage);
    }
    doMove(board: Board): void {
        this.tryTeleport(board);
        super.doMove(board);
    }
    tryTeleport(board: Board) {
        if (this.hasTeleportsRemaining() && Random.fromRange(1, 10) == 1) {
            this.numTeleports--;
            this.pos = randomPos(board);
        }
    }
    hasTeleportsRemaining(): boolean {
        return this.numTeleports > 0;
    }
}

class randomMoverGameUnit extends MeleeUnit {
    constructor(name : string, cost : Resources, moveSpeed : number, attackSpeed : number, damage : number, hp : number, color : string, blurb : string, private numTeleports: number) {
        super(name, cost, moveSpeed, attackSpeed, damage, hp, color, blurb);
    }
    construct(player: Player, pos: Pos): Unit {
        return new RandomMover(player, this.getName(), pos, this.hp, this.moveSpeed, this.attackSpeed, this.color, this.damage, this.numTeleports);
    }
}

export const LegacyRandomMoverUnit = new randomMoverGameUnit("Random Mover", new Resources({ gold: 5, wood: 5 }), 10, 10, 1, 3, "#ccccff", "Is just like a soldier but randomly teleports to a part of the map", 1);
export const RandomMoverUnit: GameUnit = new randomMoverGameUnit("Random Mover", new Resources({ randomonium: 25 }), 10, 10, 1, 3, "#ccccff", "Is just like a soldier but randomly teleports to a part of the map", 1);
export const JackedRandomMoverUnit: GameUnit = new randomMoverGameUnit("Jacked Random Mover", new Resources({ randomonium: 250 }), 9, 8, 2, 25, "#ccccff", "What if a Random Mover went to the gym? Here's your answer", 25);