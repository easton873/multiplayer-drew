import { Random } from "../../../game/math.js";
import { Pos } from "../../../game/pos.js";
import { Board } from "../../../game/board.js";
import { Unit } from "../unit.js";
import { Hearts } from "../../heart.js";

export function clampHealth(unit : Unit) {
    if (unit.hp > unit.totalHP) {
        unit.hp = unit.totalHP;
    }
}

export function healUnit(unit : Unit, healAmount : number) {
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