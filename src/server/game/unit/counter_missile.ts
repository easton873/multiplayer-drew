import { Board } from "../board.js";
import { Player } from "../player.js";
import { Pos } from "../pos.js";
import { Resources } from "../resources.js";
import { GameUnit } from "./game_unit.js";
import { Missile } from "./missile.js";
import { TargetChasingUnit, Unit, } from "./unit.js";

class CounterMissile extends TargetChasingUnit {
    private startPos : Pos;
    constructor(player : Player, pos : Pos, name : string, hp : number, speed : number, color : string) {
        super(player, name, pos, hp, speed, color);
        this.startPos = pos.clone();
    }
    inRange(other: Unit): boolean {
        return this.inRangeForDistance(other, 5);
    }
    inRangeMove(board: Board) {
        this.target.doDamage(this.target.hp);
        this.doDamage(this.hp);
        return;
    }

    findNewTarget(units : Unit[]) {
        this.findTargetWithPredicate(units, (unit : Unit) => {
            return unit.team != this.team && this.willTarget(unit);
        });
    }
    
    willTarget(unit : Unit) : boolean {
        return unit instanceof Missile;
    }

    hasNoTargetMove(): void {
        if (this.startPos == this.pos) {
            return;
        }
        this.pos.moveTowards(this.startPos);
    }
}

class counterMissileUnit extends GameUnit {
    constructor(
        public name : string, public cost : Resources, public speed : number,
        public hp : number, public color : string, public blurb : string,
    ) {
        super(name, cost, blurb);
    }
    construct(player: Player, pos: Pos): Unit {
        return new CounterMissile(player, pos, this.name, this.hp, this.speed, this.color);
    }
}

export const CounterMissileUnit : counterMissileUnit = new counterMissileUnit("Counter Missile", new Resources(500, 500, 500), 0, 10, "#ff4343ff", "Takes out missiles");

class CounterCounterMissile extends CounterMissile {
    willTarget(unit : Unit) : boolean {
        return unit instanceof CounterMissile;
    }
}

class counterCounterMissileUnit extends GameUnit {
    constructor(
        public name : string, public cost : Resources, public speed : number,
        public hp : number, public color : string, public blurb : string,
    ) {
        super(name, cost, blurb);
    }
    construct(player: Player, pos: Pos): Unit {
        return new CounterCounterMissile(player, pos, this.name, this.hp, this.speed, this.color);
    }
}

export const CounterCounterMissileUnit : counterCounterMissileUnit = new counterCounterMissileUnit("Counter Counter Missile", new Resources(400, 400, 400), 0, 5, "#ff9a9aff", "Takes out counter missiles");