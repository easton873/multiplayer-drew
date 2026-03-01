import { Resources } from "../../resources.js";
import { Board } from "../../board.js";
import { Player } from "../../player.js";
import { Pos } from "../../pos.js";
import { GameUnit } from "../game_unit.js";
import { Unit } from "../unit.js";
import { TargetChasingUnit } from "./combat.js";
import { Heart } from "../..//heart.js";

class Missionary extends TargetChasingUnit {
    constructor(player : Player, name : string, pos : Pos, hp : number, color : string, moveSpeed : number, attackSpeed : number, public range : number) {
        super(player, name, pos, hp, color, moveSpeed, attackSpeed);
    }

    inRange(other: Unit): boolean {
        return this.inRangeForDistance(other, this.range);
    }

    inRangeMove(board: Board) {
        if (this.owner.atUnitCap()) {
            return;
        }
        this.target.owner.notifyDeath(this.target);
        this.owner.addUnit(this.target);

        this.target.team = this.team
        this.target.owner = this.owner;

        this.target = null;
    }

    hasNoTargetMove(): void {
        if (!this.attackCounter.hasOneTickLeft()) {
            this.attackCounter.tick();
        }
    }

    tickMoveCounter(): boolean {
        if (!this.attackCounter.hasOneTickLeft()) {
            this.attackCounter.tick();
            return false;
        }
        return super.tickMoveCounter();
    }

    isValidTarget(unit: Unit): boolean {
        return unit.team != this.team &&
            !(unit instanceof Heart);
    }
}

class missionaryUnit extends GameUnit {
    constructor(public name : string, cost : Resources, public moveSpeed : number, 
            public attackSpeed : number, public hp : number, public color : string, 
            blurb : string, public range : number) {
        super(name, cost, blurb);
    }
    construct(player: Player, pos: Pos): Unit {
        return new Missionary(player, this.name, pos, this.hp, this.color, this.moveSpeed, this.attackSpeed, this.range);
    }
}

export const MissionaryUnit : missionaryUnit = new missionaryUnit("Missionary", new Resources(0, 300, 250), 10, 100, 15, "#000000", "Converts units to your side", 5);