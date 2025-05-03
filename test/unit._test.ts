import * as assert from "assert";
import { Board } from "../src/server/game/board.js";
import { Player, PlayerProxy } from "../src/server/game/player.js";
import { Unit, UnitWithTarget } from "../src/server/game/unit/unit.js";
import { Soldier } from "../src/server/game/unit/soldier.js";
import { Pos } from "../src/server/game/pos.js";
import { MINER_SPEED, ResourceUnitFactory } from "../src/server/game/unit/resource_unit.js";
import { Resources } from "../src/server/game/resources.js";
import { StartingEra } from "../src/server/game/era.js";

describe('Unit Test', () => {
    it('removal test', () => {
        let board : Board = new Board(10, 10);
        let player : Player = new Player(0, new Pos(0, 0), board, "0", "", "");
        let p2 : Player = new Player(1, new Pos(0, 0), board, "1", "", "");
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
        let player : Player = new Player(0, new Pos(0, 0), board, "0", "", "");
        let p2 : Player = new Player(1, new Pos(0, 0), board, "1", "", "");
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
        let player : Player = new Player(0, new Pos(0, 0), board, "0", "", "");
        let p2 : Player = new Player(1, new Pos(0, 0), board, "1", "", "");
        let unit : UnitWithTarget = new Soldier(player, new Pos(3, 2));
        let targetUnit : Unit = new Soldier(p2, new Pos(4, 4));
        board.addEntity(unit);
        board.addEntity(targetUnit);
        assert.strictEqual(unit.target, undefined);
        unit.findNewTarget(board);
        assert.strictEqual(unit.target, targetUnit);   
    });

    it('more complicated target test', () => {
        let board : Board = new Board(10, 10);
        let player : Player = new Player(0, new Pos(0, 0), board, "0", "", "");
        let p2 : Player = new Player(1, new Pos(0, 0), board, "1", "", "");
        let unit : UnitWithTarget = new Soldier(player, new Pos(3, 2));
        let unit2 : UnitWithTarget = new Soldier(player, new Pos(3, 2));
        let targetUnit : Unit = new Soldier(p2, new Pos(4, 4));
        unit.speed = 0;
        unit.counter = 0;
        unit2.speed = 0;
        unit2.counter = 0;
        assert.strictEqual(targetUnit.TESTObservers.length, 0);  
        board.addEntity(unit);
        board.addEntity(unit2);
        board.addEntity(targetUnit);
        assert.strictEqual(targetUnit.TESTObservers.length, 1);
        unit.target = targetUnit;
        assert.strictEqual(targetUnit.TESTObservers.length, 2);
        unit.target = targetUnit;
        assert.strictEqual(targetUnit.TESTObservers.length, 2);
        unit2.target = targetUnit;
        assert.strictEqual(targetUnit.TESTObservers.length, 3);
        unit.move(board);
        assert.strictEqual(targetUnit.TESTObservers.length, 3);
        unit2.move(board);
        assert.strictEqual(targetUnit.TESTObservers.length, 3);
        targetUnit.doDamage(targetUnit.currHp);
        assert.strictEqual(targetUnit.TESTObservers.length, 0);
    });

    it('counter test', () => {
        let board : Board = new Board(10, 10);
        let player : Player = new Player(0, new Pos(0, 0), board, "0", "", "");
        let factory : ResourceUnitFactory = new ResourceUnitFactory(player);
        let unit : Unit = factory.NewMiner(new Pos(0, 0));
        assert.strictEqual(player.resources.equals(new Resources(5, 0, 0)), true);
        assert.strictEqual(unit.counter, MINER_SPEED);
        unit.move(board);
        assert.strictEqual(player.resources.equals(new Resources(5, 0, 0)), true);
        assert.strictEqual(unit.counter, MINER_SPEED - 1);
    });

    it('unit placement restriction test', () => {
        let unitLimit = 1;
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
        let player : Player = new PlayerProxy(0, new Pos(0, 0), board, "0", "", "");
        player.era.currEra = new testEra();

        // range test
        player.resources.add(Soldier.COST);
        assert.strictEqual(board.entities.length, 1);
        player.NewUnit(Soldier.NAME, new Pos(1, 0));
        assert.strictEqual(board.entities.length, 1);
        radius++;
        player.NewUnit(Soldier.NAME, new Pos(1, 0));
        assert.strictEqual(board.entities.length, 2);

        // unit limit test
        player.resources.add(Soldier.COST);
        assert.strictEqual(board.entities.length, 2);
        player.NewUnit(Soldier.NAME, new Pos(0, 0));
        assert.strictEqual(board.entities.length, 2);
        unitLimit++;
        player.NewUnit(Soldier.NAME, new Pos(0, 0));
        assert.strictEqual(board.entities.length, 3);
    });

    it('no observers on death/unit count', () => {
        let unitLimit = 5;
        let radius = 25;
        class testEra extends StartingEra {
            getRadius() : number {
                return radius;
            }
            getUnitLimmit(): number {
                return unitLimit;
            }
        }
        let board : Board = new Board(10, 10);
        let player : Player = new PlayerProxy(0, new Pos(0, 0), board, "0", "", "");
        let p2 : Player = new PlayerProxy(0, new Pos(0, 0), board, "1", "", "");
        player.era.currEra = new testEra();
        p2.era.currEra = new testEra();
        player.resources.add(Soldier.COST);
        assert.strictEqual(board.entities.length, 2);
        player.NewUnit(Soldier.NAME, new Pos(1, 0));
        assert.strictEqual(board.entities.length, 3);
        assert.strictEqual(player.unitCount, 1);
        let target : Unit = board.entities[2];
        assert.strictEqual(target.TESTObservers.length, 2);

        p2.resources.add(Soldier.COST);
        p2.NewUnit(Soldier.NAME, new Pos(1, 1));
        assert.strictEqual(board.entities.length, 4);
        let attacker : UnitWithTarget = (board.entities[3] as UnitWithTarget);
        attacker.target = target;
        assert.strictEqual(target.TESTObservers.length, 3);
        target.doDamage(target.currHp);
        assert.strictEqual(target.currHp, 0);
        assert.strictEqual(target.TESTObservers.length, 0);
        assert.strictEqual(player.unitCount, 0);
    });
});