import { Board } from "../../board.js";
import { Counter } from "../../move/counter.js";
import { Player } from "../../player.js";
import { Pos } from "../../pos.js";
import { ObservableUnit, Unit, UnitWithTarget } from "../unit.js";

export abstract class CombatUnit extends UnitWithTarget implements ObservableUnit {
    public attackCounter : Counter;
    public moveCounter : Counter;
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
}

export abstract class TargetChasingUnit extends CombatUnit {
    doMove(board: Board) {
        this.pos.moveTowards(this.target.pos);
    }
}