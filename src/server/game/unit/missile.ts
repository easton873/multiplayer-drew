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

export const MissileUnit : missileUnit = new missileUnit("Missile", new Resources(5000, 5000, 5000), 0, 100, 100, "#000000", "Impacts with a devestating explosion", 100);

export const BallisticMissileUnit : missileUnit = new missileUnit("Ballistic Missile", new Resources(1000, 1000, 1000), 0, 5, 10, "#060e94ff", "Does a good amount of damage to buildings", 10);

export class UnitMissile extends Missile {
    willTarget(unit : Unit) : boolean {
        return true;
    }
}

class unitMissileUnit extends GameUnit {
    constructor(
        public name : string, public cost : Resources, public speed : number, public damage : number,
        public hp : number, public color : string, public blurb : string, public range,
    ) {
        super(name, cost, blurb);
    }
    construct(player: Player, pos: Pos): Unit {
        return new UnitMissile(player, pos, this.name, this.hp, this.speed, this.color, this.damage, this.range);
    }
}

export const UnitMissileUnit : unitMissileUnit = new unitMissileUnit("Unit Missile", new Resources(200, 200, 200), 0, 3, 10, "#aeac22ff", "Targets Units", 10);
