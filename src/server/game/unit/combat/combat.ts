import { Board } from "../../board.js";
import { Counter } from "../../move/counter.js";
import { Player } from "../../player.js";
import { Pos } from "../../pos.js";
import { ObservableUnit, Unit, UnitWithTarget } from "../unit.js";

export abstract class CombatUnit extends UnitWithTarget {
    public attackCounter : Counter;
    public moveCounter : Counter;
    constructor(player : Player, name : string, pos : Pos, hp : number, color : string, moveSpeed : number, attackSpeed : number) {
        super(player, name, pos, hp, color);
        this.attackCounter = new Counter(attackSpeed);
        this.moveCounter = new Counter(moveSpeed);
    }

    doAcutalMove(board: Board) {
        if (this.hasNoTarget() || !this.isValidTarget(this.target)) {
            this.findNewTarget(board.entities); // guarentee a target sort of
        }
        if (this.hasNoTarget()) { // still didn't find a valid target
            this.hasNoTargetMove();
            return;
        }
        if (this.inRange(this.target)) {
            this.attacking = true;
            if (this.attackCounter.tick()) {
                this.inRangeMove(board);
                this.findNewTarget(board.entities); // gives the unit the chance to retarget
            }
            return;
        } else {
            this.attacking = false;
            if (this.tickMoveCounter()) {
                this.findNewTarget(board.entities); // gives the unit the chance to retarget
                this.doMove(board);
            }
            return;
        }
    }

    tickMoveCounter() : boolean {
        return this.moveCounter.tick()
    }

    set moveSpeed(newSpeed : number) {
        this.moveCounter.setSpeed(newSpeed);
    }

    get moveSpeed() : number {
        return this.moveCounter.total;
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
}

export abstract class TargetChasingUnit extends CombatUnit {
    doMove(board: Board) {
        this.pos.moveTowards(this.target.pos);
    }
}