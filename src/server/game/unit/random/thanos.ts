import { Board } from "../../board.js";
import { drawExpandingCircle, drawRandomPath } from "../../drawing/helper.js";
import { Random } from "../../math.js";
import { Counter } from "../../move/counter.js";
import { Player } from "../../player.js";
import { Pos } from "../../pos.js";
import { Resources } from "../../resources.js";
import { CombatUnit } from "../combat/combat.js";
import { isEnemyNonHeart } from "../combat/helper.js";
import { GameUnit } from "../game_unit.js";
import { Melee } from "../melee_unit.js";
import { Unit } from "../unit.js";

class Thanos extends Melee {
    private hasSnapped: boolean = false
    private snapCounter: Counter = new Counter(60);
    private powerStoneCounter: Counter = new Counter(90);
    private spaceStoneCounter: Counter = new Counter(150);
    private range: number = 400;
    doAcutalMove(board: Board): void {
        if (!this.hasSnapped && this.snapCounter.tick()) {
            this.hasSnapped = true;
            this.snap(board);
        }
        if (this.powerStoneCounter.tick()) {
            this.powerStone(board);
        }
        if (this.spaceStoneCounter.tick()) {
            this.spaceStone(board);
        }
        super.doAcutalMove(board);
    }

    // space: retreat/move to better board positions
    // reality: summon

    snap(board: Board): void {
        board.entities.forEach((unit: Unit) => {
            if (isEnemyNonHeart(this, unit) && Random.fromRange(0, 1) == 0) {
                unit.kill();
            }
        })
    }

    powerStone(board: Board): void {
        let target: Unit | null = this.findStrongestInRange(board);
        if (target) {
            drawRandomPath(this.pos, target.pos, "#cd08ef", this.getDrawingManager());
            target.kill();
        }
    }

    spaceStone(board: Board): void {
        drawExpandingCircle(this.pos.clone(), 6, 2, "#3653d5", this.getDrawingManager());
        board.entities.forEach((u: Unit) => {
            if (u.team == this.team && u instanceof CombatUnit && Random.fromRange(1, 10) == 1) {
                u.pos = this.pos.clone();
            }
        });
        // also a tactical retreat could be cool too, based on how much health you have
    }

    findStrongestInRange(board: Board): Unit | null {
        return this.findBestEnemyInRange(board.entities, this.range, (u: Unit, target: Unit) => u.totalHP > target.totalHP);
    }
}

class thanosUnit extends GameUnit {
    construct(player: Player, pos: Pos): Unit {
        return new Thanos(player, this.getName(), pos, 1000, 30, 30, "#a006f9", 100);
    }
}

export const ThanosUnit: GameUnit = new thanosUnit("Thanos", new Resources( {randomonium: 1} ), "You've seen the movies, you know what this means");