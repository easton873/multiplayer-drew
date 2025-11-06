import { Player } from "../player.js";
import { Pos } from "../pos.js";
import { Resources } from "../resources.js";
import { Defense } from "./defense.js";
import { Flare } from "./flare.js";
import { GameUnit } from "./game_unit.js";
import { Kamakaze } from "./kamakaze.js";
import { ResourceUnit } from "./resource_unit.js";
import { Unit } from "./unit.js";

export class Missile extends Kamakaze {
    constructor(player : Player, pos : Pos, name : string, hp : number, speed : number, color : string, damage : number, range : number) {
        super(player, pos, name, hp, speed, color, damage, range);
    }
    
    findNewTarget(units : Unit[]) {
        this.findTargetWithPredicate(units, (unit : Unit) => {
            return unit.team != this.team && this.willTarget(unit);
        });
    }

    willTarget(unit : Unit) : boolean {
        return unit instanceof Defense || unit instanceof ResourceUnit || unit instanceof Flare
    }
}

class missileUnit extends GameUnit {
    constructor(
        public name : string, public cost : Resources, public speed : number, public damage : number,
        public hp : number, public color : string, public blurb : string, public range,
    ) {
        super(name, cost, blurb);
    }
    construct(player: Player, pos: Pos): Unit {
        return new Missile(player, pos, this.name, this.hp, this.speed, this.color, this.damage, this.range);
    }
}

export const MissileUnit : missileUnit = new missileUnit("Missile", new Resources(2000, 2000, 2000), 0, 100, 100, "#000000", "Impacts with a devestating explosion", 100);