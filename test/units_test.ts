import * as assert from "assert";
import { Board } from "../src/server/game/board.js";
import { Player } from "../src/server/game/player.js";
import { Unit, UnitWithTarget } from "../src/server/game/unit/unit.js";
import { Pos } from "../src/server/game/pos.js";
import { Kamakaze, KamakazeUnit } from "../src/server/game/unit/kamakaze.js";
import { Summoner } from "../src/server/game/unit/summoner.js";
import { Healer, HealerUnit } from "../src/server/game/unit/healer.js";
import { Turret, TurretUnit } from "../src/server/game/unit/turret.js";
import { SoldierUnit, GoblinUnit } from "../src/server/game/unit/melee_unit.js";
import { ArcherUnit, FireballThrowerUnit, Ranged } from "../src/server/game/unit/ranged_unit.js";
import { Counter } from "../src/server/game/move/counter.js";
import { GorillaWarfarer, GorillaWarfareUnit } from "../src/server/game/unit/gorilla_warfare.js";
import { TargetChasingUnit } from "../src/server/game/unit/combat/combat.js";
import { TankUnit } from "../src/server/game/unit/tank.js";
import { CatapultUnit } from "../src/server/game/unit/catapult.js";
import { MissionaryUnit } from "../src/server/game/unit/combat/missionary.js";
import { NinjaUnit, SpyUnit, AssassainUnit } from "../src/server/game/unit/combat/stealth.js";
import { MERCHANT_GAME_UNIT } from "../src/server/game/unit/resource_unit.js";
import { VampireUnit } from "../src/server/game/unit/combat/vampire.js";

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
        unit.attackCounter = new Counter(0);
        board.moveUnit(unit);
        assert.strictEqual(targetUnit.hp, SoldierUnit.hp);
        assert.strictEqual(unit.pos.equals(new Pos(9, 5)), true);
        assert.strictEqual(unit.target, targetUnit);

        board.moveUnit(unit);
        assert.strictEqual(targetUnit.hp, SoldierUnit.hp - ArcherUnit.damage);
        assert.strictEqual(unit.pos.equals(new Pos(9, 5)), true);
        assert.strictEqual(unit.target, targetUnit);
    });

    it('kamakaze test', () => {
        let board : Board = new Board(10, 10);
        let player : Player = new Player(0, new Pos(0, 0), board, "0", "", "");
        let p2 : Player = new Player(1, new Pos(0, 0), board, "1", "", "");
        let unit : TargetChasingUnit = KamakazeUnit.construct(player, new Pos(7, 5)) as TargetChasingUnit;
        let targetUnit : Unit = SoldierUnit.construct(p2, new Pos(5, 5));
        unit.target = targetUnit;
        board.addEntity(unit);
        board.addEntity(targetUnit);
        assert.strictEqual(board.entities.length, 4);
        
        unit.moveCounter = new Counter(0);
        unit.attackCounter = new Counter(0);
        board.moveUnit(unit);
        assert.strictEqual(targetUnit.hp, SoldierUnit.hp);
        assert.strictEqual(unit.pos.equals(new Pos(6, 5)), true);
        assert.strictEqual(unit.target, targetUnit);

        board.moveUnit(unit);
        assert.strictEqual(targetUnit.hp, SoldierUnit.hp - KamakazeUnit.damage);
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
        unit.attackCounter = new Counter(0);
        board.moveUnit(unit);
        assert.strictEqual(unit.pos.equals(new Pos(6, 5)), true);
        assert.strictEqual(unit.target, targetUnit);

        let beforeHP = targetUnit.hp;
        board.moveUnit(unit);
        assert.strictEqual(targetUnit.hp, beforeHP - TankUnit.damage);

        // tank only takes 1 damage no matter what
        beforeHP = unit.hp;
        unit.takeDamage(10000);
        assert.strictEqual(unit.hp, beforeHP - 1);
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
        board.moveUnit(unit);
        assert.strictEqual(unit.target, p2.heart);

        board.moveUnit(unit);
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
        unit.attackCounter = new Counter(0);
        unit.summonTimer = new Counter(0);
        unit.range = 0;
        board.moveUnit(unit);
        assert.strictEqual(unit.target, soldier);
        assert.strictEqual(board.entities.length, 6);
        assert.strictEqual(unit.numSummons, 2);
        assert.strictEqual(unit.pos.equals(soldier.pos), true);
        board.moveUnit(unit);
    });

    it('healer test', () => {
        let board : Board = new Board(10, 10);
        let player : Player = new Player(0, new Pos(0, 0), board, "0", "", "");
        let p2 : Player = new Player(1, new Pos(0, 0), board, "1", "", "");
        let unit : Healer = HealerUnit.construct(player, new Pos(7, 5)) as Healer;
        let soldier = SoldierUnit.construct(player, new Pos(9, 5));
        let soldier2 = SoldierUnit.construct(player, new Pos(9, 5));
        let soldier3 = SoldierUnit.construct(player, new Pos(8, 5));
        board.addEntity(unit);
        board.addEntity(soldier);
        assert.strictEqual(board.entities.length, 4);
        
        unit.moveCounter = new Counter(0);
        unit.attackCounter = new Counter(0);
        unit.range = 9;
        board.moveUnit(unit);

        assert.strictEqual(unit.target, soldier);
        board.addEntity(soldier2);
        soldier2.hp = soldier2.totalHP - 1;
        board.moveUnit(unit);
        assert.strictEqual(unit.target, soldier2);
        assert.strictEqual(soldier2.hp, soldier2.totalHP);
        board.addEntity(soldier3);
        board.moveUnit(unit);
        // This test used to pass because the healer would retarget sombody closer if his current target
        // was healed all the way. At the moment we would rather he just keep the same target and not
        // switch just because he can.
        // assert.strictEqual(unit.target, soldier3);

        soldier2.hp = soldier2.totalHP - 1;
        soldier2.pos = new Pos(12, 5);
        assert.strictEqual(unit.pos.equals(new Pos(7, 5)), true);
        board.moveUnit(unit);
        assert.strictEqual(unit.target, soldier2);
        assert.strictEqual(unit.pos.equals(new Pos(8, 5)), true);
        board.moveUnit(unit);
        board.moveUnit(unit);
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
        unit.attackCounter = new Counter(0);
        assert.strictEqual(unit.pos.equals(new Pos(5, 5)), true);
        board.moveUnit(unit);
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
        
        unit.attackCounter = new Counter(0);
        board.moveUnit(unit);
        assert.strictEqual(unit.pos.equals(new Pos(5, 5)), true);
        assert.strictEqual(soldier.hp, soldier.totalHP);
        soldier.pos = new Pos(10, 5);
        board.moveUnit(unit);
        assert.strictEqual(unit.target, soldier);
        let hpAfterOneShot = soldier.totalHP - unit.damage;
        assert.strictEqual(soldier.hp, hpAfterOneShot);
        soldier.pos = new Pos(11, 5);
        board.moveUnit(unit);
        assert.strictEqual(soldier.hp, hpAfterOneShot);

        // turret takes less damage from soldier
        let startingHP = unit.hp;
        soldier.doDamage(unit, 10);
        assert.strictEqual(unit.hp, startingHP - 1);
    });

    it('Catapult test', () => {
        let board : Board = new Board(30, 30);
        let player : Player = new Player(0, new Pos(0, 0), board, "0", "", "");
        let p2 : Player = new Player(1, new Pos(0, 0), board, "1", "", "");
        let turret : Turret = new Turret(player, new Pos(15, 15));
        let catapult = CatapultUnit.construct(p2, new Pos(15, 10)) as Ranged;
        board.addEntity(turret);
        board.addEntity(catapult);
        assert.strictEqual(board.entities.length, 4);

        catapult.attackCounter = new Counter(0);
        board.moveUnit(catapult);
        board.moveUnit(catapult);
        assert.strictEqual(board.entities.length, 3);
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
        board.moveUnit(unit);
        // assert.strictEqual(unit.target, soldier);
        // assert.strictEqual(unit.retreatPos, null);
        // board.moveUnit(unit);
        // assert.strictEqual(unit.retreatPos.equals(new Pos(18, 16)), true);
        // for (let i = 0; i < 12; ++i) {
        //     board.moveUnit(unit);
        // }
        // assert.strictEqual(unit.retreating, true);
        // assert.strictEqual(unit.pos.equals(new Pos(18, 5)), true);
        // board.moveUnit(unit);
        // board.moveUnit(unit);
        // assert.strictEqual(unit.pos.equals(new Pos(18, 6)), true);
    });

    it('missionary conversion test', () => {
        let board: Board = new Board(10, 10);
        let player: Player = new Player(0, new Pos(0, 0), board, "0", "", "");
        let p2: Player = new Player(1, new Pos(10, 10), board, "1", "", "");

        let missionary = MissionaryUnit.construct(player, new Pos(5, 5)) as TargetChasingUnit;
        let soldier = SoldierUnit.construct(p2, new Pos(5, 5));
        p2.addUnit(soldier);  // register p2 as observer so notifyDeath works correctly
        board.addEntity(missionary);
        assert.strictEqual(board.entities.length, 4);  // 2 hearts + missionary + soldier

        // initial observer/unit-count state (p2 + board = 2)
        assert.strictEqual(soldier.TESTObservers.length, 2);
        assert.strictEqual(p2.unitCount, 1);
        assert.strictEqual(player.unitCount, 0);

        missionary.target = soldier;
        missionary.moveCounter = new Counter(0);
        missionary.attackCounter = new Counter(0);
        board.moveUnit(missionary);

        // entity count unchanged - soldier was converted, not killed
        assert.strictEqual(board.entities.length, 4);

        // soldier now belongs to player
        assert.strictEqual(soldier.owner, player);
        assert.strictEqual(soldier.team, player.getTeam());

        // p2 unregistered, player registered (board + player = 2)
        assert.strictEqual(soldier.TESTObservers.length, 2);
        assert.strictEqual(p2.unitCount, 0);
        assert.strictEqual(player.unitCount, 1);

        // missionary cleared its target
        assert.strictEqual(missionary.target, null);
    });

    it('missionary does not target hearts', () => {
        let board: Board = new Board(10, 10);
        let player: Player = new Player(0, new Pos(9, 9), board, "0", "", "");
        let p2: Player = new Player(1, new Pos(3, 3), board, "1", "", "");

        // missionary at (3, 3), p2 heart also at (3, 3) - within range 5
        let missionary = MissionaryUnit.construct(player, new Pos(3, 3)) as TargetChasingUnit;
        board.addEntity(missionary);
        // board: player.heart (9,9), p2.heart (3,3), missionary (3,3) - no non-heart enemies

        missionary.moveCounter = new Counter(0);
        missionary.attackCounter = new Counter(0);
        board.moveUnit(missionary);

        // missionary must not have targeted p2's heart
        assert.strictEqual(missionary.target, null);
    });

    it('missionary does not convert when at unit cap', () => {
        let board: Board = new Board(10, 10);
        let player: Player = new Player(0, new Pos(0, 0), board, "0", "", "");
        let p2: Player = new Player(1, new Pos(10, 10), board, "1", "", "");

        let missionary = MissionaryUnit.construct(player, new Pos(5, 5)) as TargetChasingUnit;
        let soldier = SoldierUnit.construct(p2, new Pos(5, 5));
        p2.addUnit(soldier);
        board.addEntity(missionary);

        // force player to unit cap
        player.unitCount = player.era.getUnitLimit();

        missionary.target = soldier;
        missionary.moveCounter = new Counter(0);
        missionary.attackCounter = new Counter(0);
        board.moveUnit(missionary);

        // soldier not converted
        assert.strictEqual(soldier.owner, p2);
        assert.strictEqual(soldier.TESTObservers.length, 3);  // p2 + board + missionary (still targeting)
        assert.strictEqual(p2.unitCount, 1);
        assert.strictEqual(player.unitCount, player.era.getUnitLimit());
    });

    it('ninja is invisible when far from an enemy', () => {
        let board: Board = new Board(20, 20);
        let player: Player = new Player(0, new Pos(0, 0), board, "0", "", "");
        // Place p2 heart far from the ninja so it doesn't trigger the proximity check
        let p2: Player = new Player(1, new Pos(19, 19), board, "1", "", "");
        let ninja: TargetChasingUnit = NinjaUnit.construct(player, new Pos(10, 5)) as TargetChasingUnit;
        let soldier = SoldierUnit.construct(p2, new Pos(0, 5));
        // From ninja (10,5): soldier dist²=100, p2 heart (19,19) dist²=277 — both > 25
        board.addEntity(ninja);
        board.addEntity(soldier);

        ninja.moveCounter = new Counter(0);
        ninja.attackCounter = new Counter(0);
        board.moveUnit(ninja);

        assert.strictEqual(ninja.isInvisible(), true);
    });

    it('ninja becomes visible when close to an enemy', () => {
        let board: Board = new Board(20, 20);
        let player: Player = new Player(0, new Pos(0, 0), board, "0", "", "");
        let p2: Player = new Player(1, new Pos(0, 0), board, "1", "", "");
        let ninja: TargetChasingUnit = NinjaUnit.construct(player, new Pos(9, 5)) as TargetChasingUnit;
        let soldier = SoldierUnit.construct(p2, new Pos(5, 5));
        // distance² = (9-5)²+(5-5)² = 16 ≤ 25, proximity check passes
        // Δx=4, not adjacent, so doMove (not inRangeMove) is called
        ninja.target = soldier;
        board.addEntity(ninja);
        board.addEntity(soldier);

        ninja.moveCounter = new Counter(0);
        ninja.attackCounter = new Counter(0);
        board.moveUnit(ninja);

        assert.strictEqual(ninja.isInvisible(), false);
    });

    it('ninja is not targetable when invisible', () => {
        let board: Board = new Board(10, 10);
        let player: Player = new Player(0, new Pos(0, 0), board, "0", "", "");
        let p2: Player = new Player(1, new Pos(0, 0), board, "1", "", "");
        let ninja: TargetChasingUnit = NinjaUnit.construct(player, new Pos(5, 5)) as TargetChasingUnit;
        let p2Soldier: TargetChasingUnit = SoldierUnit.construct(p2, new Pos(6, 5)) as TargetChasingUnit;
        ninja.goInvisible();
        board.addEntity(ninja);
        board.addEntity(p2Soldier);

        p2Soldier.moveCounter = new Counter(0);
        p2Soldier.attackCounter = new Counter(0);
        board.moveUnit(p2Soldier);

        // invisible ninja is skipped; p2Soldier should target player's heart instead
        assert.strictEqual(p2Soldier.target, player.heart);
        assert.notStrictEqual(p2Soldier.target, ninja);
    });

    it('spy turns invisible while walking toward first target', () => {
        let board: Board = new Board(20, 20);
        let player: Player = new Player(0, new Pos(0, 0), board, "0", "", "");
        let p2: Player = new Player(1, new Pos(19, 19), board, "1", "", "");
        let spy: TargetChasingUnit = SpyUnit.construct(player, new Pos(10, 5)) as TargetChasingUnit;
        let merchant = MERCHANT_GAME_UNIT.construct(p2, new Pos(0, 5));
        // dist² from spy (10,5) to merchant (0,5) = 100 > 9 (SpyUnit.range)
        board.addEntity(spy);
        board.addEntity(merchant);

        spy.moveCounter = new Counter(0);
        spy.attackCounter = new Counter(0);
        board.moveUnit(spy);

        assert.strictEqual(spy.isInvisible(), true);
    });

    it('spy does not go invisible again after already going invisible once', () => {
        let board: Board = new Board(20, 20);
        let player: Player = new Player(0, new Pos(0, 0), board, "0", "", "");
        let p2: Player = new Player(1, new Pos(19, 19), board, "1", "", "");
        let spy: TargetChasingUnit = SpyUnit.construct(player, new Pos(10, 5)) as TargetChasingUnit;
        let merchant = MERCHANT_GAME_UNIT.construct(p2, new Pos(0, 5));
        board.addEntity(spy);
        board.addEntity(merchant);

        spy.moveCounter = new Counter(0);
        spy.attackCounter = new Counter(0);
        // Move 1: spy goes invisible for the first time, moves from (10,5) to (9,5)
        board.moveUnit(spy);
        assert.strictEqual(spy.isInvisible(), true);

        // Simulate spy reaching its target and becoming visible again
        spy.goVisibile();

        // Move 2: merchant still far (dist² from (9,5) to (0,5) = 81 > 9)
        // goInvisible() is now a no-op since goneInvisible=true
        board.moveUnit(spy);
        assert.strictEqual(spy.isInvisible(), false);
    });

    it('assassin insta-kills first target and becomes visible', () => {
        let board: Board = new Board(20, 20);
        let player: Player = new Player(0, new Pos(0, 0), board, "0", "", "");
        let p2: Player = new Player(1, new Pos(19, 19), board, "1", "", "");
        let assassin: TargetChasingUnit = AssassainUnit.construct(player, new Pos(5, 5)) as TargetChasingUnit;
        let soldier = SoldierUnit.construct(p2, new Pos(6, 5));  // adjacent: dist²=1
        soldier.totalHP = 1000;
        soldier.hp = 1000;
        board.addEntity(assassin);
        board.addEntity(soldier);
        assert.strictEqual(board.entities.length, 4);

        assassin.moveCounter = new Counter(0);
        assassin.attackCounter = new Counter(0);
        board.moveUnit(assassin);

        assert.strictEqual(board.entities.length, 3);    // soldier insta-killed and removed
        assert.strictEqual(assassin.isInvisible(), false); // assassin revealed after assassination
    });

    it('after assassination, assassin stays visible and deals normal melee damage', () => {
        let board: Board = new Board(20, 20);
        let player: Player = new Player(0, new Pos(0, 0), board, "0", "", "");
        let p2: Player = new Player(1, new Pos(19, 19), board, "1", "", "");
        let assassin: TargetChasingUnit = AssassainUnit.construct(player, new Pos(5, 5)) as TargetChasingUnit;
        let soldier1 = SoldierUnit.construct(p2, new Pos(6, 5));  // adjacent: dist²=1
        let soldier2 = SoldierUnit.construct(p2, new Pos(8, 5));  // dist²=9
        board.addEntity(assassin);
        board.addEntity(soldier1);
        board.addEntity(soldier2);
        assert.strictEqual(board.entities.length, 5);

        // Move 1: assassinate soldier1
        assassin.moveCounter = new Counter(0);
        assassin.attackCounter = new Counter(0);
        board.moveUnit(assassin);
        assert.strictEqual(board.entities.length, 4);
        assert.strictEqual(assassin.isInvisible(), false);

        // Move 2: retarget to soldier2 (dist²=9), doMove → (5,5) → (6,5)
        assassin.moveCounter = new Counter(0);
        assassin.attackCounter = new Counter(0);
        board.moveUnit(assassin);
        assert.strictEqual(assassin.isInvisible(), false);
        assert.strictEqual(assassin.pos.equals(new Pos(6, 5)), true);

        // Move 3: doMove from (6,5) toward soldier2 (8,5) → (7,5)
        assassin.moveCounter = new Counter(0);
        board.moveUnit(assassin);
        assert.strictEqual(assassin.pos.equals(new Pos(7, 5)), true);

        // Move 4: soldier2 at (8,5) from (7,5): dist²=1, adjacent → inRangeMove → normal melee damage
        assassin.moveCounter = new Counter(0);
        assassin.attackCounter = new Counter(0);
        board.moveUnit(assassin);
        assert.strictEqual(soldier2.hp, SoldierUnit.hp - AssassainUnit.damage);  // normal damage, not insta-kill
        assert.strictEqual(board.entities.length, 4);   // soldier2 still alive
        assert.strictEqual(assassin.isInvisible(), false);
    });

    it('vampire heals by damage dealt to normal unit', () => {
        let board: Board = new Board(10, 10);
        let player: Player = new Player(0, new Pos(0, 0), board, "0", "", "");
        let p2: Player = new Player(1, new Pos(0, 0), board, "1", "", "");
        let vampire: TargetChasingUnit = VampireUnit.construct(player, new Pos(6, 5)) as TargetChasingUnit;
        let soldier = SoldierUnit.construct(p2, new Pos(5, 5));
        vampire.target = soldier;
        board.addEntity(vampire);
        board.addEntity(soldier);

        vampire.hp = 5;
        vampire.moveCounter = new Counter(0);
        vampire.attackCounter = new Counter(0);
        board.moveUnit(vampire);

        assert.strictEqual(vampire.hp, 8);  // 5 + 3 damage dealt
    });

    it('vampire only heals by actual damage taken (tank absorbs only 1)', () => {
        let board: Board = new Board(10, 10);
        let player: Player = new Player(0, new Pos(0, 0), board, "0", "", "");
        let p2: Player = new Player(1, new Pos(0, 0), board, "1", "", "");
        let vampire: TargetChasingUnit = VampireUnit.construct(player, new Pos(6, 5)) as TargetChasingUnit;
        let tank = TankUnit.construct(p2, new Pos(5, 5));
        vampire.target = tank;
        board.addEntity(vampire);
        board.addEntity(tank);

        vampire.hp = 5;
        vampire.moveCounter = new Counter(0);
        vampire.attackCounter = new Counter(0);
        board.moveUnit(vampire);

        assert.strictEqual(vampire.hp, 6);          // 5 + 1 (not 5 + 3)
        assert.strictEqual(tank.hp, TankUnit.hp - 1);
    });

    it('vampire HP is clamped at totalHP (no overheal)', () => {
        let board: Board = new Board(10, 10);
        let player: Player = new Player(0, new Pos(0, 0), board, "0", "", "");
        let p2: Player = new Player(1, new Pos(0, 0), board, "1", "", "");
        let vampire: TargetChasingUnit = VampireUnit.construct(player, new Pos(6, 5)) as TargetChasingUnit;
        let soldier = SoldierUnit.construct(p2, new Pos(5, 5));
        vampire.target = soldier;
        board.addEntity(vampire);
        board.addEntity(soldier);

        vampire.hp = 19;  // 1 below max; healing 3 would give 22
        vampire.moveCounter = new Counter(0);
        vampire.attackCounter = new Counter(0);
        board.moveUnit(vampire);

        assert.strictEqual(vampire.hp, VampireUnit.hp);  // clamped at totalHP=20
    });

    // it('missiles and what not test', () => {
    //     let board : Board = new Board(100, 100);
    //     let player : Player = new Player(0, new Pos(90, 90), board, "0", "", "");
    //     let p2 : Player = new Player(1, new Pos(90, 90), board, "1", "", "");
    //     let unit : Missile = MissileUnit.construct(player, new Pos(5, 5)) as Missile;
    //     let soldier : Unit = SoldierUnit.construct(player, new Pos(1, 1));
    //     let flare = FlareUnit.construct(p2, new Pos(5, 15));
    //     let counterMissile : UnitWithTarget = CounterMissileUnit.construct(p2, new Pos(5, 10)) as UnitWithTarget;
    //     let counterMissile2 : UnitWithTarget = CounterMissileUnit.construct(p2, new Pos(5, 15)) as UnitWithTarget;
    //     board.addEntity(unit);
    //     assert.strictEqual(board.entities.length, 3);
    //     board.moveUnit(unit);
    //     assert.strictEqual(unit.target, p2.heart);
    //     board.addEntity(soldier)
    //     board.moveUnit(unit);
    //     assert.strictEqual(unit.target, p2.heart);
    //     board.addEntity(flare);
    //     board.moveUnit(unit);
    //     assert.strictEqual(unit.target, flare);
    //     board.addEntity(counterMissile);
    //     counterMissile.move(board);
    //     board.moveUnit(unit);
    //     // assert.strictEqual(unit.target, flare);
    //     // assert.strictEqual(counterMissile.target, unit);
    //     board.addEntity(counterMissile2);
    //     // only one counter used
    //     assert.strictEqual(board.entities.length, 7);
    //     while (counterMissile.hp > 0) {
    //         counterMissile.move(board);
    //         counterMissile2.move(board);
    //     }
    //     assert.strictEqual(board.entities.length, 5);
    //     // returns to original spot test
    //     assert.notStrictEqual(counterMissile2.pos, new Pos(5, 15));
    //     for (let i = 0; i < 100; ++i) {
    //         counterMissile2.move(board);
    //     }
    //     let expectedSpot : boolean = (counterMissile2.pos.equals(new Pos(5, 15)));
    //     assert.strictEqual(expectedSpot, true);
    // });
});
