import * as assert from "assert";
import { Board } from "../src/server/game/board.js";
import { Player, PlayerProxy } from "../src/server/game/player.js";
import { Unit, UnitWithTarget } from "../src/server/game/unit/unit.js";
import { Soldier } from "../src/server/game/unit/soldier.js";
import { Pos } from "../src/server/game/pos.js";
import { ResourceUnitFactory } from "../src/server/game/unit/resource_unit.js";
import { Resources } from "../src/server/game/resources.js";
import { SOLDIER_NAME } from "../src/shared/types.js";
import { StartingEra } from "../src/server/game/era.js";

describe('Unit Test', () => {
    it('removal test', () => {
        let board : Board = new Board(10, 10);
        let player : Player = new Player(0, new Pos(0, 0), board, "0", "");
        let p2 : Player = new Player(1, new Pos(0, 0), board, "1", "");
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
        let player : Player = new Player(0, new Pos(0, 0), board, "0", "");
        let p2 : Player = new Player(1, new Pos(0, 0), board, "1", "");
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
        let player : Player = new Player(0, new Pos(0, 0), board, "0", "");
        let p2 : Player = new Player(1, new Pos(0, 0), board, "1", "");
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
        let player : Player = new Player(0, new Pos(0, 0), board, "0", "");
        let factory : ResourceUnitFactory = new ResourceUnitFactory(player);
        let unit : Unit = factory.NewMiner(new Pos(0, 0));
        assert.strictEqual(player.resources.equals(new Resources(5, 0, 0)), true);
        assert.strictEqual(unit.counter, 5);
        unit.move(board);
        assert.strictEqual(player.resources.equals(new Resources(5, 0, 0)), true);
        assert.strictEqual(unit.counter, 4);
    });

    it('unit placement restriction test', () => {
        let unitLimit = 2;
        let radius = 0;
        class testEra extends StartingEra {
            getRadius() : number {
                return radius;
            }
            getUnitLimmit(): number {
                return unitLimit;
            }
        }
        let board : Board = new Board(10, 10);
        let player : Player = new PlayerProxy(0, new Pos(0, 0), board, "0", "");
        player.era.currEra = new testEra();

        // range test
        player.resources.add(new Resources(Soldier.GOLD_COST, Soldier.WOOD_COST, Soldier.STONE_COST));
        assert.strictEqual(board.entities.length, 1);
        player.NewUnit(SOLDIER_NAME, new Pos(1, 0));
        assert.strictEqual(board.entities.length, 1);
        radius++;
        player.NewUnit(SOLDIER_NAME, new Pos(1, 0));
        assert.strictEqual(board.entities.length, 2);

        // unit limit test
        player.resources.add(new Resources(Soldier.GOLD_COST, Soldier.WOOD_COST, Soldier.STONE_COST));
        assert.strictEqual(board.entities.length, 2);
        player.NewUnit(SOLDIER_NAME, new Pos(0, 0));
        assert.strictEqual(board.entities.length, 2);
        unitLimit++;
        player.NewUnit(SOLDIER_NAME, new Pos(0, 0));
        assert.strictEqual(board.entities.length, 3);
    });
});