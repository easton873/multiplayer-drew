import { Board } from "../../board.js";
import { drawRandomPath, drawShrinkingCircle } from "../../drawing/helper.js";
import { Heart } from "../../heart.js";
import { Random } from "../../math.js";
import { Counter } from "../../move/counter.js";
import { Player } from "../../player.js";
import { Pos } from "../../pos.js";
import { Resources } from "../../resources.js";
import { findEnemyInRange, findEnemyUnit, randomPos } from "../combat/helper.js";
import { GameUnit } from "../game_unit.js";
import { Ranged } from "../ranged_unit.js";
import { ObservableUnit, Unit, UnitWithCounter } from "../unit.js";

class Voldemort extends Ranged {
    private ready: boolean = false;
    private horcruxes: Unit[] = [];
    private theBoyWhoLived: Unit | undefined;
    private markerCounter: Counter = new Counter(90);
    private avadaKedavraCounter: Counter = new Counter(90);
    private greenColor: string = "#4df50a"
    doAcutalMove(board: Board): void {
        if (!this.ready) {
            for (let i = 0; i < 6; ++i) {
                let horcurx: Unit = new class extends Unit {
                    doAcutalMove(board: Board): void {}
                }(this.owner, "Horcrux", randomPos(board), 100, "#000000")
                this.forceSummonUnit(horcurx, board);
                horcurx.registerObserver(this);
                this.horcruxes.push(horcurx);
            }
            this.theBoyWhoLived = findEnemyUnit(board, this);
            if (this.theBoyWhoLived) {
                this.theBoyWhoLived.registerObserver(this);
            }
            this.ready = true;
        }
        this.theBoyWhoLivedActions();
        this.avadaKedavra(board);
        super.doAcutalMove(board);
    }

    theBoyWhoLivedActions(): void {
        if (!this.theBoyWhoLived) {
            return;
        }
        if (this.markerCounter.tick()) {
            drawShrinkingCircle(this.theBoyWhoLived.pos, 6, 2, this.greenColor, this.getDrawingManager());
        }
    }

    isUnkillable(): boolean {
        if (this.theBoyWhoLived || this.horcruxes.length > 0) {
            return true;
        }
        return false;
    }

    avadaKedavra(board: Board): void {
        if (!this.avadaKedavraCounter.tick()) {
            return;
        }
        const target: Unit | undefined = findEnemyInRange(board, this, 225);
        if (!target) {
            return;
        }
        drawRandomPath(this.pos, target.pos, this.greenColor, this.getDrawingManager());
        target.kill();
    }

    takeDamage(damage: number): void {
        if (this.isUnkillable()) {
            return;
        }
        super.takeDamage(damage);
    }

    doDamage(unit: Unit, damage: number): void {
        unit.takeMagicDamage(damage);
    }

    notifyDeath(unit: ObservableUnit): void {
        for (let i = 0; i < this.horcruxes.length; ++i) {
            if (this.horcruxes[i] == unit) {
                this.horcruxes.splice(i, 1);
                i--;
            }
        }
        if (unit == this.theBoyWhoLived) {
            this.theBoyWhoLived = undefined;
        }
        super.notifyDeath(unit)
    }
}

class voldemortUnit extends GameUnit {
    construct(player: Player, pos: Pos): Unit {
        return new Voldemort(player, this.getName(), pos, 100, 20, 10, "#595959", 10, 49);
    }
}

export const VoldemortUnit: GameUnit = new voldemortUnit("Voldemort", new Resources(), "The Dark Lord is unstoppable until his life lines have been destroyed");