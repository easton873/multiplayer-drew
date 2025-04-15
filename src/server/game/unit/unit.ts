import { Board } from "../board.js";
import { Player } from "../player.js";
import { Pos } from "../pos.js";
import { Resources } from "../resources.js";

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
        this.observers.forEach((o : UnitObserver) => {
            o.notifyDeath(this);
        });
    }
}

export interface UnitObserver {
    notifyDeath(unit : ObservableUnit);
}

export abstract class Unit extends ObservableUnit {
    name : string;
    pos : Pos;
    hp : number;
    currHp : number;
    speed : number;
    counter : number;
    team : Player;
    cost : Resources;

    constructor(player : Player, pos : Pos, hp : number, speed : number, cost : Resources) {
        super();
        this.team = player;
        this.pos = pos;
        this.hp = hp;
        this.currHp = hp;
        this.speed = speed;
        this.counter = speed;
        this.cost = cost;
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
        this.currHp -= damage;
        if (this.currHp <= 0) {
            this.notifyObserversDeath();
        }
    }
}

export abstract class UnitWithTarget extends Unit implements UnitObserver {
    private _target : Unit;
    range : number;

    doMove(board : Board) {
        this.findNewTarget(board);
        if (this.hasNoTarget()) {
            return;
        }
        if (this.inRange(this._target)) {
            this.inRangeMove();
        } else {
            this.pos.moveTowards(this._target.pos);
        }
    }

    abstract inRange(other : Unit) : boolean;

    abstract inRangeMove();

    findNewTarget(board : Board) {
        if (this.hasTarget()) {
            return;
        }
        let currDist = -1;
        board.entities.forEach((unit : Unit) => {
            let dist = this.pos.distanceTo(unit.pos);
            if (unit.team != this.team && (currDist == -1 || dist < currDist)) {
                this.target = unit;
                currDist = dist;
            }
        });
    }

    notifyDeath(unit: ObservableUnit) {
        if (unit == this.target) {
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
        this._target = target;
        target.registerObserver(this);
    }

    get target() {
        return this._target;
    }
}