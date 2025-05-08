import * as assert from "assert";
import { Board } from "../src/server/game/board.js";
import { Player } from "../src/server/game/player.js";
import { Unit, TargetChasingUnit } from "../src/server/game/unit/unit.js";
import { Pos } from "../src/server/game/pos.js";
import { Kamakaze, KamakazeUnit } from "../src/server/game/unit/kamakaze.js";
import { Summoner } from "../src/server/game/unit/summoner.js";
import { Healer, HealerUnit } from "../src/server/game/unit/healer.js";
import { Turret, TurretUnit } from "../src/server/game/unit/turret.js";
import { SoldierUnit, TankUnit, GoblinUnit } from "../src/server/game/unit/melee_unit.js";
import { ArcherUnit, FireballThrowerUnit, Ranged } from "../src/server/game/unit/ranged_unit.js";
import { Counter } from "../src/server/game/move/counter.js";
import { GorillaWarfarer, GorillaWarfareUnit } from "../src/server/game/unit/gorilla_warfare.js";

describe('Units Test', () => {
    it('archer test', () => {
        let board : Board = new Board(10, 10);
        let player : Player = new Player(0, new Pos(0, 0), board, "0", "", "");
        let p2 : Player = new Player(1, new Pos(0, 0), board, "1", "", "");
        let unit : TargetChasingUnit = ArcherUnit.construct(player, new Pos(10, 5)) as TargetChasingUnit;
        let targetUnit : Unit = SoldierUnit.construct(p2, new Pos(5, 5));
        unit.target = targetUnit;
        board.addEntity(unit);
        board.addEntity(targetUnit);
        
        unit.moveCounter = new Counter(0);
        unit.move(board);
        assert.strictEqual(targetUnit.hp, SoldierUnit.hp);
        assert.strictEqual(unit.pos.equals(new Pos(9, 5)), true);
        assert.strictEqual(unit.target, targetUnit);

        unit.move(board);
        assert.strictEqual(targetUnit.hp, SoldierUnit.hp - 1);
        assert.strictEqual(unit.pos.equals(new Pos(9, 5)), true);
        assert.strictEqual(unit.target, targetUnit);
    });

    it('kamakaze test', () => {
        let board : Board = new Board(10, 10);
        let player : Player = new Player(0, new Pos(0, 0), board, "0", "", "");
        let p2 : Player = new Player(1, new Pos(0, 0), board, "1", "", "");
        let unit : TargetChasingUnit = new Kamakaze(player, new Pos(7, 5));
        let targetUnit : Unit = SoldierUnit.construct(p2, new Pos(5, 5));
        unit.target = targetUnit;
        board.addEntity(unit);
        board.addEntity(targetUnit);
        assert.strictEqual(board.entities.length, 4);
        
        unit.moveCounter = new Counter(0);
        unit.move(board);
        assert.strictEqual(targetUnit.hp, SoldierUnit.hp);
        assert.strictEqual(unit.pos.equals(new Pos(6, 5)), true);
        assert.strictEqual(unit.target, targetUnit);

        unit.move(board);
        assert.strictEqual(targetUnit.hp, SoldierUnit.hp - KamakazeUnit.DAMAGE);
        assert.strictEqual(board.entities.length, 2);
    });

    it('tank test', () => {
        let board : Board = new Board(10, 10);
        let player : Player = new Player(0, new Pos(0, 0), board, "0", "", "");
        let p2 : Player = new Player(1, new Pos(0, 0), board, "1", "", "");
        let unit : TargetChasingUnit = TankUnit.construct(player, new Pos(7, 5)) as TargetChasingUnit;
        let targetUnit : Unit = SoldierUnit.construct(p2, new Pos(5, 5));
        unit.target = targetUnit;
        board.addEntity(unit);
        board.addEntity(targetUnit);
        assert.strictEqual(board.entities.length, 4);
        
        unit.moveCounter = new Counter(0);
        unit.move(board);
        assert.strictEqual(unit.pos.equals(new Pos(6, 5)), true);
        assert.strictEqual(unit.target, targetUnit);

        let beforeHP = targetUnit.hp;
        unit.move(board);
        assert.strictEqual(targetUnit.hp, beforeHP - TankUnit.damage);
    });

    it('goblin test', () => {
        let board : Board = new Board(10, 10);
        let player : Player = new Player(0, new Pos(0, 0), board, "0", "", "");
        let p2 : Player = new Player(1, new Pos(0, 0), board, "1", "", "");
        let unit : TargetChasingUnit = GoblinUnit.construct(player, new Pos(7, 5)) as TargetChasingUnit;
        let targetUnit : Unit = SoldierUnit.construct(p2, new Pos(5, 5));
        board.addEntity(unit);
        board.addEntity(targetUnit);
        assert.strictEqual(board.entities.length, 4);
        
        unit.moveCounter = new Counter(0);
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
        let soldier = SoldierUnit.construct(player, new Pos(8, 5));
        let targetUnit : Unit = SoldierUnit.construct(p2, new Pos(5, 5));
        board.addEntity(unit);
        board.addEntity(targetUnit);
        board.addEntity(soldier);
        assert.strictEqual(board.entities.length, 5);
        
        unit.moveCounter = new Counter(0);
        unit.summonTimer = 0;
        unit.range = 0;
        unit.move(board);
        assert.strictEqual(unit.target, soldier);
        assert.strictEqual(board.entities.length, 6);
        assert.strictEqual(unit.summonTimer, unit.summonTimerTime);
        assert.strictEqual(unit.numSummons, 2);
        assert.strictEqual(unit.pos.equals(soldier.pos), true);
        unit.move(board);
        assert.strictEqual(unit.summonTimer, unit.summonTimerTime - 1);
    });

    it('healer test', () => {
        let board : Board = new Board(10, 10);
        let player : Player = new Player(0, new Pos(0, 0), board, "0", "", "");
        let p2 : Player = new Player(1, new Pos(0, 0), board, "1", "", "");
        let unit : Healer = new Healer(player, new Pos(7, 5), HealerUnit.RANGE, HealerUnit.HEAL_RANGE);
        let soldier = SoldierUnit.construct(player, new Pos(9, 5));
        let soldier2 = SoldierUnit.construct(player, new Pos(9, 5));
        let soldier3 = SoldierUnit.construct(player, new Pos(8, 5));
        board.addEntity(unit);
        board.addEntity(soldier);
        assert.strictEqual(board.entities.length, 4);
        
        unit.moveCounter = new Counter(0);
        unit.range = 9;
        unit.move(board);
        assert.strictEqual(unit.target, soldier);
        board.addEntity(soldier2);
        soldier2.hp = soldier2.totalHP - 1;
        unit.move(board);
        assert.strictEqual(unit.target, soldier2);
        assert.strictEqual(soldier2.hp, soldier2.totalHP);
        board.addEntity(soldier3);
        unit.move(board);
        assert.strictEqual(unit.target, soldier3);

        soldier2.hp = soldier2.totalHP - 1;
        soldier2.pos = new Pos(12, 5);
        assert.strictEqual(unit.pos.equals(new Pos(7, 5)), true);
        unit.move(board);
        assert.strictEqual(unit.target, soldier2);
        assert.strictEqual(unit.pos.equals(new Pos(8, 5)), true);
        assert.strictEqual(soldier2.hp, soldier2.totalHP);
    });

    it('fireball thrower test', () => {
        let board : Board = new Board(10, 10);
        let player : Player = new Player(0, new Pos(0, 0), board, "0", "", "");
        let p2 : Player = new Player(1, new Pos(0, 0), board, "1", "", "");
        let unit : Ranged = FireballThrowerUnit.construct(player, new Pos(5, 5)) as Ranged;
        let soldier = SoldierUnit.construct(p2, new Pos(9, 5));
        let soldier2 = SoldierUnit.construct(p2, new Pos(9, 5));
        let soldier3 = SoldierUnit.construct(p2, new Pos(10, 5));
        let soldier4 = SoldierUnit.construct(p2, new Pos(11, 5));
        board.addEntity(unit);
        board.addEntity(soldier);
        board.addEntity(soldier2);
        board.addEntity(soldier3);
        board.addEntity(soldier4);
        assert.strictEqual(board.entities.length, 7);
        unit.target = soldier;
        
        unit.moveCounter = new Counter(0);
        assert.strictEqual(unit.pos.equals(new Pos(5, 5)), true);
        unit.move(board);
        assert.strictEqual(soldier.hp, soldier.totalHP - unit.damage);
        assert.strictEqual(soldier2.hp, soldier2.totalHP - unit.damage);
        assert.strictEqual(soldier3.hp, soldier3.totalHP - unit.damage);
        assert.strictEqual(soldier4.hp, soldier4.totalHP);
        assert.strictEqual(unit.hp, unit.totalHP);
    });

    it('Turret test', () => {
        let board : Board = new Board(10, 10);
        let player : Player = new Player(0, new Pos(0, 0), board, "0", "", "");
        let p2 : Player = new Player(1, new Pos(0, 0), board, "1", "", "");
        let unit : Turret = new Turret(player, new Pos(5, 5));
        let soldier = SoldierUnit.construct(p2, new Pos(11, 5));
        board.addEntity(unit);
        board.addEntity(soldier);
        assert.strictEqual(board.entities.length, 4);
        
        unit.moveCounter = new Counter(0);
        unit.move(board);
        assert.strictEqual(unit.pos.equals(new Pos(5, 5)), true);
        assert.strictEqual(soldier.hp, soldier.totalHP);
        assert.strictEqual(unit.target, null);
        soldier.pos = new Pos(10, 5);
        unit.move(board);
        assert.strictEqual(unit.target, soldier);
        let hpAfterOneShot = soldier.totalHP - unit.damage;
        assert.strictEqual(soldier.hp, hpAfterOneShot);
        soldier.pos = new Pos(11, 5);
        unit.move(board);
        assert.strictEqual(unit.target, null);
        assert.strictEqual(soldier.hp, hpAfterOneShot);
    });

    it('Gorilla Warfare test', () => {
        let board : Board = new Board(30, 30);
        let player : Player = new Player(0, new Pos(0, 0), board, "0", "", "");
        let p2 : Player = new Player(1, new Pos(0, 0), board, "1", "", "");
        let unit : GorillaWarfarer = GorillaWarfareUnit.construct(player, new Pos(18, 22)) as GorillaWarfarer;
        let soldier = SoldierUnit.construct(p2, new Pos(18, 0));
        board.addEntity(unit);
        board.addEntity(soldier);
        assert.strictEqual(board.entities.length, 4);
        
        unit.moveCounter = new Counter(0);
        unit.move(board);
        // assert.strictEqual(unit.target, soldier);
        // assert.strictEqual(unit.retreatPos, null);
        // unit.move(board);
        // assert.strictEqual(unit.retreatPos.equals(new Pos(18, 16)), true);
        // for (let i = 0; i < 12; ++i) {
        //     unit.move(board);
        // }
        // assert.strictEqual(unit.retreating, true);
        // assert.strictEqual(unit.pos.equals(new Pos(18, 5)), true);
        // unit.move(board);
        // unit.move(board);
        // assert.strictEqual(unit.pos.equals(new Pos(18, 6)), true);
    });
});
