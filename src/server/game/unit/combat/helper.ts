import { Random } from "../../../game/math.js";
import { Pos } from "../../../game/pos.js";
import { Board } from "../../../game/board.js";
import { Unit } from "../unit.js";
import { Heart, Hearts } from "../../heart.js";
import { Player } from "../../player.js";

export function clampHealth(unit : Unit): void {
    if (unit.hp > unit.totalHP) {
        unit.hp = unit.totalHP;
    }
}

export function healUnit(unit : Unit, healAmount : number): void {
    unit.hp += healAmount
    clampHealth(unit);
}

export function randomPos(board : Board): Pos {
    return new Pos(
        Random.fromRange(0, board.width),
        Random.fromRange(0, board.height)
    );
}

export function getTerritory(board: Board, hearts : Hearts): Pos[] {
    let spots : Pos[] = [];
    for (let y = 0; y < board.height; y++) {
        for (let x = 0; x < board.width; x++) {
            let pos : Pos = new Pos(x, y);
            if (hearts.isInRange(pos)) {
                spots.push(pos);
            }
        }
    }
    return spots;
}

export function findUnit(board: Board, predicate: (u: Unit) => boolean): Unit | undefined {
    return Random.fromList(board.entities.filter(predicate));
}

export function isEnemy(self: Unit, other: Unit): boolean {
    return other.team != self.team;
}

export function isEnemyNonHeart(self: Unit, other: Unit): boolean {
    return isEnemy(self, other) && !(other instanceof Heart);
}

export function isEnemyInRange(self: Unit, other: Unit, range: number): boolean {
    return isEnemy(self, other) && self.inRangeForDistance(other, range);
}

export function findEnemyUnit(board: Board, unit: Unit): Unit | undefined {
    return findUnit(board, (u: Unit) => isEnemyNonHeart(unit, u));
}

export function findEnemyInRange(board: Board, unit: Unit, range: number): Unit | undefined {
    return findUnit(board, (u: Unit) => isEnemyInRange(unit, u, range));
}