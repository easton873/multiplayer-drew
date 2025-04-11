import * as assert from "assert";
import { Player } from "../server/player";
import { Soldier, SOLDIER_NAME } from "../server/unit/soldier";
import { Unit, UnitWithTarget } from "../server/unit/unit";
import { Pos } from "../server/pos";
import { Board } from "../server/board";
import { ResourceUnit, ResourceUnitFactory } from "../server/unit/resource_unit";
import { Resources } from "../server/resources";

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