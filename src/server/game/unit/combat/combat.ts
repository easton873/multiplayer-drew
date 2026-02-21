import { Board } from "../../board.js";
import { Counter } from "../../move/counter.js";
import { Player } from "../../player.js";
import { Pos } from "../../pos.js";
import { ObservableUnit, Unit } from "../unit.js";

export abstract class CombatUnit extends Unit implements ObservableUnit {
    public attackCounter : Counter;
    public moveCounter : Counter;
    private attacking : boolean;
    constructor(player : Player, name : string, pos : Pos, hp : number, color : string, moveSpeed : number, attackSpeed : number) {
        super(player, name, pos, hp, color);
        this.attackCounter = new Counter(attackSpeed);
        this.moveCounter = new Counter(moveSpeed);
    }

    doAcutalMove(board: Board) {
        this.findNewTarget(board.entities); // guarentee a target
        if (this.hasNoTarget()) {
            this.hasNoTargetMove();
            return;
        }
        if (this.inRange(this.target)) {
            this.attacking = true;
            if (this.attackCounter.tick()) {
                this.inRangeMove(board);
            }
            return;
        } else {
            this.attacking = false;
            if (this.moveCounter.tick()) {
                this.doMove(board);
            }
            return;
        }
    }

    set moveSpeed(newSpeed : number) {
        this.moveCounter.setSpeed(newSpeed);
    }

    set attackSpeed(newSpeed : number) {
        this.attackCounter.setSpeed(newSpeed);
    }

    abstract inRange(other : Unit) : boolean;
    abstract inRangeMove(board : Board);
    abstract doMove(board : Board);

    hasNoTargetMove(): void {
        return;
    }

    // target stuff

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

export abstract class TargetChasingUnit extends CombatUnit {
    doMove(board: Board) {
        this.pos.moveTowards(this.target.pos);
    }
} 