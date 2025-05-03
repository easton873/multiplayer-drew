import * as assert from "assert";
import { Board } from "../src/server/game/board.js";
import { Player } from "../src/server/game/player.js";
import { Unit, UnitWithTarget } from "../src/server/game/unit/unit.js";
import { Pos } from "../src/server/game/pos.js";
import { Soldier, SoldierUnit } from "../src/server/game/unit/soldier.js";
import { Archer } from "../src/server/game/unit/archer.js";
import { Kamakaze, KamakazeUnit } from "../src/server/game/unit/kamakaze.js";
import { Tank, TankUnit } from "../src/server/game/unit/tank.js";
import { Goblin } from "../src/server/game/unit/goblin.js";
import { Summoner } from "../src/server/game/unit/summoner.js";

describe('Units Test', () => {
    it('archer test', () => {
        let board : Board = new Board(10, 10);
        let player : Player = new Player(0, new Pos(0, 0), board, "0", "", "");
        let p2 : Player = new Player(1, new Pos(0, 0), board, "1", "", "");
        let unit : UnitWithTarget = new Archer(player, new Pos(10, 5));
        let targetUnit : Unit = new Soldier(p2, new Pos(5, 5));
        unit.target = targetUnit;
        board.addEntity(unit);
        board.addEntity(targetUnit);
        
        unit.speed = 0;
        unit.counter = 0;
        unit.move(board);
        assert.strictEqual(targetUnit.currHp, SoldierUnit.HP);
        assert.strictEqual(unit.pos.equals(new Pos(9, 5)), true);
        assert.strictEqual(unit.target, targetUnit);

        unit.move(board);
        assert.strictEqual(targetUnit.currHp, SoldierUnit.HP - 1);
        assert.strictEqual(unit.pos.equals(new Pos(9, 5)), true);
        assert.strictEqual(unit.target, targetUnit);
    });

    it('kamakaze test', () => {
        let board : Board = new Board(10, 10);
        let player : Player = new Player(0, new Pos(0, 0), board, "0", "", "");
        let p2 : Player = new Player(1, new Pos(0, 0), board, "1", "", "");
        let unit : UnitWithTarget = new Kamakaze(player, new Pos(7, 5));
        let targetUnit : Unit = new Soldier(p2, new Pos(5, 5));
        unit.target = targetUnit;
        board.addEntity(unit);
        board.addEntity(targetUnit);
        assert.strictEqual(board.entities.length, 4);
        
        unit.speed = 0;
        unit.counter = 0;
        unit.move(board);
        assert.strictEqual(targetUnit.currHp, SoldierUnit.HP);
        assert.strictEqual(unit.pos.equals(new Pos(6, 5)), true);
        assert.strictEqual(unit.target, targetUnit);

        unit.move(board);
        assert.strictEqual(targetUnit.currHp, SoldierUnit.HP - KamakazeUnit.DAMAGE);
        assert.strictEqual(board.entities.length, 2);
    });

    it('tank test', () => {
        let board : Board = new Board(10, 10);
        let player : Player = new Player(0, new Pos(0, 0), board, "0", "", "");
        let p2 : Player = new Player(1, new Pos(0, 0), board, "1", "", "");
        let unit : UnitWithTarget = new Tank(player, new Pos(7, 5));
        let targetUnit : Unit = new Soldier(p2, new Pos(5, 5));
        unit.target = targetUnit;
        board.addEntity(unit);
        board.addEntity(targetUnit);
        assert.strictEqual(board.entities.length, 4);
        
        unit.speed = 0;
        unit.counter = 0;
        unit.move(board);
        assert.strictEqual(unit.pos.equals(new Pos(6, 5)), true);
        assert.strictEqual(unit.target, targetUnit);

        let beforeHP = targetUnit.currHp;
        unit.move(board);
        assert.strictEqual(targetUnit.currHp, beforeHP - TankUnit.DAMAGE);
    });

    it('goblin test', () => {
        let board : Board = new Board(10, 10);
        let player : Player = new Player(0, new Pos(0, 0), board, "0", "", "");
        let p2 : Player = new Player(1, new Pos(0, 0), board, "1", "", "");
        let unit : UnitWithTarget = new Goblin(player, new Pos(7, 5));
        let targetUnit : Unit = new Soldier(p2, new Pos(5, 5));
        board.addEntity(unit);
        board.addEntity(targetUnit);
        assert.strictEqual(board.entities.length, 4);
        
        unit.speed = 0;
        unit.counter = 0;
        unit.move(board);
        assert.strictEqual(unit.target, p2.heart);

        unit.move(board);
        assert.strictEqual(unit.target, p2.heart);
    });

    it('summoner test', () => {
        let board : Board = new Board(10, 10);
        let player : Player = new Player(0, new Pos(0, 0), board, "0", "", "");
        let p2 : Player = new Player(1, new Pos(0, 0), board, "1", "", "");
        let unit : Summoner = new Summoner(player, new Pos(7, 5));
        let soldier : Soldier = new Soldier(player, new Pos(8, 5));
        let targetUnit : Unit = new Soldier(p2, new Pos(5, 5));
        board.addEntity(unit);
        board.addEntity(targetUnit);
        board.addEntity(soldier);
        assert.strictEqual(board.entities.length, 5);
        
        unit.speed = 0;
        unit.counter = 0;
        unit.summonTimer = 0;
        unit.range = 0;
        unit.move(board);
        assert.strictEqual(unit.target.name, soldier.name);
        assert.strictEqual(board.entities.length, 6);
        assert.strictEqual(unit.summonTimer, unit.summonTimerTime);
        assert.strictEqual(unit.numSummons, 2);
        assert.strictEqual(unit.pos.equals(soldier.pos), true);
        unit.move(board);
        assert.strictEqual(unit.summonTimer, unit.summonTimerTime - 1);
    });
});
