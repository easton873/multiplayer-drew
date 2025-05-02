import * as assert from "assert";
import { Board } from "../src/server/game/board.js";
import { Player } from "../src/server/game/player.js";
import { Unit, UnitWithTarget } from "../src/server/game/unit/unit.js";
import { Pos } from "../src/server/game/pos.js";
import { Soldier } from "../src/server/game/unit/soldier.js";
import { Archer } from "../src/server/game/unit/archer.js";
import { Kamakaze } from "../src/server/game/unit/kamakaze.js";

describe('Units Test', () => {
    it('archer test', () => {
        let board : Board = new Board(10, 10);
        let player : Player = new Player(0, new Pos(0, 0), board, "0", "", "");
        let p2 : Player = new Player(1, new Pos(0, 0), board, "1", "", "");
        let unit : UnitWithTarget = new Archer(player, "", new Pos(10, 5));
        let targetUnit : Unit = new Soldier(p2, "", new Pos(5, 5));
        unit.target = targetUnit;
        board.addEntity(unit);
        board.addEntity(targetUnit);
        
        unit.speed = 0;
        unit.counter = 0;
        unit.move(board);
        assert.strictEqual(targetUnit.currHp, Soldier.HP);
        assert.strictEqual(unit.pos.equals(new Pos(9, 5)), true);
        assert.strictEqual(unit.target, targetUnit);

        unit.move(board);
        assert.strictEqual(targetUnit.currHp, Soldier.HP - 1);
        assert.strictEqual(unit.pos.equals(new Pos(9, 5)), true);
        assert.strictEqual(unit.target, targetUnit);
    });

    it('kamakaze test', () => {
        let board : Board = new Board(10, 10);
        let player : Player = new Player(0, new Pos(0, 0), board, "0", "", "");
        let p2 : Player = new Player(1, new Pos(0, 0), board, "1", "", "");
        let unit : UnitWithTarget = new Kamakaze(player, "", new Pos(7, 5));
        let targetUnit : Unit = new Soldier(p2, "", new Pos(5, 5));
        unit.target = targetUnit;
        board.addEntity(unit);
        board.addEntity(targetUnit);
        assert.strictEqual(board.entities.length, 4);
        
        unit.speed = 0;
        unit.counter = 0;
        unit.move(board);
        assert.strictEqual(targetUnit.currHp, Soldier.HP);
        assert.strictEqual(unit.pos.equals(new Pos(6, 5)), true);
        assert.strictEqual(unit.target, targetUnit);

        unit.move(board);
        assert.strictEqual(targetUnit.currHp, Soldier.HP - Kamakaze.DAMAGE);
        assert.strictEqual(board.entities.length, 2);
    });
});
