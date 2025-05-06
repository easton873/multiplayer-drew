import { Board } from "../board.js";
import { Player } from "../player.js";
import { Pos } from "../pos.js";

export abstract class ObservableUnit {
    private observers : UnitObserver[] = [];

    get TESTObservers() {
        return this.observers;
    }

    registerObserver(o : UnitObserver) {
        this.observers.push(o);
    }

    unregisterObserver(o : UnitObserver) {
        let index = this.observers.findIndex((observer : UnitObserver) => observer === o);
        if (index == -1) {
            console.log("issue removing observer");
        }
        this.observers.splice(index, 1);
    }

    notifyObserversDeath() {
        let currLength = this.observers.length;
        for (let i = 0; i < this.observers.length; ++i) {
            let o = this.observers[i];
            o.notifyDeath(this);
            if (currLength != this.observers.length) { // this check will ensure we don't go into an infinite loop probably
                currLength = this.observers.length;
                i--;
            }
        }
    }
}

export interface UnitObserver {
    notifyDeath(unit : ObservableUnit); // when implementing this, unregister the observer
}

export abstract class Unit extends ObservableUnit {
    name : string;
    pos : Pos;
    totalHP : number;
    hp : number;
    speed : number;
    counter : number;
    team : number;
    owner : Player;
    color : string;

    constructor(player : Player, name : string, pos : Pos, hp : number, speed : number, color : string) {
        super();
        this.team = player.getTeam();
        this.owner = player;
        this.name = name;
        this.pos = pos;
        this.totalHP = hp;
        this.hp = hp;
        this.speed = speed;
        this.counter = speed;
        this.color = color;
    }

    move(board : Board) {
        if (this.counter <= 0) {
            this.doMove(board);
            this.counter = this.speed;
        } else {
            this.counter--;
        }
    }

    abstract doMove(board : Board);

    doDamage(damage : number) {
        this.hp -= damage;
        if (this.isDead()) {
            this.notifyObserversDeath();
        }
    }

    isDead() : boolean {
        return this.hp <= 0;
    }

    inRangeForDistance(other : Unit, range : number) : boolean {
        return this.inRangeFromPoint(other, range, this.pos);
    }

    inRangeFromPoint(other : Unit, range : number, pos : Pos) : boolean {
        return pos.distanceTo(other.pos) <= range;
    }

    isAdjacent(other : Unit) : boolean {
        return this.pos.isAdjacent(other.pos);
    }
}

export abstract class UnitWithTarget extends Unit implements UnitObserver {
    private _target : Unit = null;
    notifyDeath(unit: ObservableUnit) {
        if (unit == this._target) {
            this._target = null;
            unit.unregisterObserver(this);
        }
    }

    hasNoTarget() : boolean {
        return this._target == null || this._target == undefined;
    }

    hasTarget() : boolean {
        return !this.hasNoTarget();
    }

    set target(target : Unit) {
        if (this._target) {
            this._target.unregisterObserver(this);
        }
        this._target = target;
        if (this._target) {
            target.registerObserver(this);
        }
    }

    get target() {
        return this._target;
    }

    findNewTarget(units : Unit[]) {
        // if (this.hasTarget()) {
        //     return;
        // }
        this.findTargetWithPredicate(units, (unit : Unit) => {
            return unit.team != this.team;
        });
    }

    findTargetWithPredicate(units : Unit[], predicate : (unit : Unit) => boolean) {
        let currDist = -1;
        units.forEach((unit : Unit) => {
            let dist = this.pos.distanceTo(unit.pos);
            if (predicate(unit) && (currDist == -1 || dist < currDist)) {
                this.target = unit;
                currDist = dist;
            }
        });
    }

    doDamageInArea(board : Board, pos : Pos, range : number, damage : number) {
        for (let i = 0; i < board.entities.length; ++i) {
            let unit = board.entities[i];
            if (this.inRangeFromPoint(unit, range, pos)) {
                unit.doDamage(damage);
            }
            if (unit.isDead()) { // if doDamage killed them, then this list is shorter
                i--;
            }
        }
    }
}

export abstract class TargetChasingUnit extends UnitWithTarget {
    doMove(board : Board) {
        this.findNewTarget(board.entities);
        if (this.hasNoTarget()) {
            return;
        }
        if (this.inRange(this.target)) {
            this.inRangeMove(board);
        } else {
            this.pos.moveTowards(this.target.pos);
        }
    }

    abstract inRange(other : Unit) : boolean;

    abstract inRangeMove(board : Board);
}