import { Board } from "../board.js";
import { Player } from "../player.js";
import { Pos } from "../pos.js";
import { Resources } from "../resources.js";
import { TargetChasingUnit } from "./combat/combat.js";
import { GameUnit } from "./game_unit.js";
import { ResourceUnit } from "./resource_unit.js";
import { Unit, } from "./unit.js";

export class Flare extends TargetChasingUnit {
    constructor(player : Player, pos : Pos, name : string, hp : number, speed : number, color : string) {
        super(player, name, pos, hp, color, speed, speed);
    }
    inRange(other: Unit): boolean {
        return this.isAdjacent(other);
    }
    inRangeMove(board: Board) {
        return;
    }

    findNewTarget(units : Unit[]) {
        this.findTargetWithPredicate(units, (unit : Unit) => {
            return unit.team != this.team && this.willTarget(unit);
        });
    }
    
    willTarget(unit : Unit) : boolean {
        return unit instanceof ResourceUnit
    }
}

class flareUnit extends GameUnit {
    constructor(
        public name : string, public cost : Resources, public speed : number,
        public hp : number, public color : string, public blurb : string,
    ) {
        super(name, cost, blurb);
    }
    construct(player: Player, pos: Pos): Unit {
        return new Flare(player, pos, this.name, this.hp, this.speed, this.color);
    }
}

export const FlareUnit : flareUnit = new flareUnit("Flare", new Resources(100, 100, 100), 2, 10, "#ff4343ff", "Distracts missiles");