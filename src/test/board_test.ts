import * as assert from "assert";
import { Board } from "../server/board";
import { Soldier } from "../server/unit/soldier";
import { Player } from "../server/player";
import { Unit } from "../server/unit/unit";
import { Pos } from "../server/pos";


describe('Board Test', () => {
    it('removal test', () => {
        let board : Board = new Board(10, 10);
        let player : Player = new Player(new Pos(0, 0), board);
        let unit : Unit = new Soldier(player, new Pos(0, 0));
        board.addEntity(unit);
        assert.strictEqual(board.entities.length, 2);
        assert.strictEqual(unit.TESTObservers.length, 1);
        assert.strictEqual(player.heart.TESTObservers.length, 1);
        unit.notifyObserversDeath();
        assert.strictEqual(board.entities.length, 1);
        assert.strictEqual(unit.TESTObservers.length, 0);
        assert.strictEqual(player.heart.TESTObservers.length, 1);
    });
});
