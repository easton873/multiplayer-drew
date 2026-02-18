import * as assert from "assert";
import { Board } from "../src/server/game/board.js";
import { Player } from "../src/server/game/player.js";
import { Pos } from "../src/server/game/pos.js";
import { Unit } from "../src/server/game/unit/unit.js";
import { SoldierUnit } from "../src/server/game/unit/melee_unit.js";
import { findFurthest } from "../src/server/game/game_room.js";



describe('Board Test', () => {
    it('removal test', () => {
        let board : Board = new Board(10, 10);
        let player : Player = new Player(1, new Pos(0, 0), board, "", "", "");
        let unit : Unit = SoldierUnit.construct(player, new Pos(0, 0));
        board.addEntity(unit);
        assert.strictEqual(board.entities.length, 2);
        assert.strictEqual(unit.TESTObservers.length, 1);
        assert.strictEqual(player.heart.TESTObservers.length, 2);
        unit.notifyObserversDeath();
        assert.strictEqual(board.entities.length, 1);
        assert.strictEqual(unit.TESTObservers.length, 0);
        assert.strictEqual(player.heart.TESTObservers.length, 2);
    });
});

describe('Furthest Spot Test', () => {
    it('corner', () => {
        let pos : Pos = findFurthest(10, 10, [new Pos(0, 0)]);
        assert.strictEqual(pos.equals(new Pos(9, 9)), true);
    });
});

describe('Furthest Spot Test', () => {
    it('middle', () => {
        let pos : Pos = findFurthest(10, 10, [new Pos(5, 5)]);
        assert.strictEqual(pos.equals(new Pos(1, 1)), true);
    });
});

describe('Furthest Spot Test', () => {
    it('pinned', () => {
        let pos : Pos = findFurthest(10, 10, [new Pos(9, 0), new Pos(0, 0)]);
        assert.strictEqual(pos.equals(new Pos(4, 9)), true);
    });
});

describe('Furthest Spot Test', () => {
    it('empty', () => {
        let pos : Pos = findFurthest(10, 10, []);
        assert.strictEqual(pos.equals(new Pos(9, 9)), true);
    });
});
