import { Resources } from "../../resources.js";
import { Board } from "../../board.js";
import { Player } from "../../player.js";
import { Pos } from "../../pos.js";
import { GameUnit } from "../game_unit.js";
import { Unit } from "../unit.js";
import { TargetChasingUnit } from "../combat/combat.js";
import { isEnemyNonHeart } from "../combat/helper.js";

class Missionary extends TargetChasingUnit {
    constructor(player : Player, name : string, pos : Pos, hp : number, color : string, moveSpeed : number, attackSpeed : number, public range : number) {
        super(player, name, pos, hp, color, moveSpeed, attackSpeed);
    }

    inRange(other: Unit): boolean {
        return this.inRangeForDistance(other, this.range);
    }

    inRangeMove(board: Board): void {
        if (this.owner.atUnitCap()) {
            return;
        }
        let convert : Unit = this.target;
        this.target.notifyObserversDeath();
        this.target = convert;

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
        return isEnemyNonHeart(this, unit);
    }
}

export class MissionaryUnit extends GameUnit {
    constructor(cost : Resources) {
        super("Missionary", cost, "Converts units to your side");
    }
    construct(player: Player, pos: Pos): Unit {
        return new Missionary(player, this.getName(), pos, 15, "#000000", 10, 100, 5);
    }
}

export const LegacyMissionaryUnit : MissionaryUnit = new MissionaryUnit(new Resources({ wood: 300, stone: 250 }));