import * as assert from "assert";
import { Board } from "../src/server/game/board.js";
import { Player } from "../src/server/game/player.js";
import { Unit, UnitWithTarget } from "../src/server/game/unit/unit.js";
import { Soldier } from "../src/server/game/unit/soldier.js";
import { Pos } from "../src/server/game/pos.js";
import { ResourceUnitFactory } from "../src/server/game/unit/resource_unit.js";
import { Resources } from "../src/server/game/resources.js";

describe('Unit Test', () => {
    it('removal test', () => {
        let board : Board = new Board(10, 10);
        let player : Player = new Player(new Pos(0, 0), board);
        let p2 : Player = new Player(new Pos(0, 0), board);
        let unit : UnitWithTarget = new Soldier(player, new Pos(0, 0));
        let targetUnit : Unit = new Soldier(p2, new Pos(5, 5));
        unit.target = targetUnit;
        assert.strictEqual(targetUnit.TESTObservers.length, 1);
        targetUnit.notifyObserversDeath();
        assert.strictEqual(unit.target, null);
        assert.strictEqual(targetUnit.TESTObservers.length, 0);
    });

    it('death test', () => {
        let board : Board = new Board(10, 10);
        let player : Player = new Player(new Pos(0, 0), board);
        let p2 : Player = new Player(new Pos(0, 0), board);
        let unit : UnitWithTarget = new Soldier(player, new Pos(0, 0));
        let targetUnit : Unit = new Soldier(p2, new Pos(3, 3));
        unit.target = targetUnit;
        assert.strictEqual(targetUnit.TESTObservers.length, 1);
        targetUnit.currHp = 1;
        targetUnit.doDamage(1);
        assert.strictEqual(unit.target, null);
        assert.strictEqual(targetUnit.TESTObservers.length, 0);
    });

    it('target test', () => {
        let board : Board = new Board(10, 10);
        let player : Player = new Player(new Pos(0, 0), board);
        let p2 : Player = new Player(new Pos(0, 0), board);
        let unit : UnitWithTarget = new Soldier(player, new Pos(3, 2));
        let targetUnit : Unit = new Soldier(p2, new Pos(4, 4));
        board.addEntity(unit);
        board.addEntity(targetUnit);
        assert.strictEqual(unit.target, undefined);
        unit.findNewTarget(board);
        assert.strictEqual(unit.target, targetUnit);   
    });

    it('counter test', () => {
        let board : Board = new Board(10, 10);
        let player : Player = new Player(new Pos(0, 0), board);
        let factory : ResourceUnitFactory = new ResourceUnitFactory(player);
        let unit : Unit = factory.NewMiner(new Pos(0, 0));
        assert.strictEqual(player.resources.equals(new Resources(5, 0, 0)), true);
        assert.strictEqual(unit.counter, 5);
        unit.move(board);
        assert.strictEqual(player.resources.equals(new Resources(5, 0, 0)), true);
        assert.strictEqual(unit.counter, 4);
    });
});