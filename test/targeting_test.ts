import * as assert from "assert";
import { Board } from "../src/server/game/board.js";
import { Player } from "../src/server/game/player.js";
import { Unit, UnitWithTarget } from "../src/server/game/unit/unit.js";
import { Pos } from "../src/server/game/pos.js";
import { SoldierUnit } from "../src/server/game/unit/melee_unit.js";
import { TankUnit } from "../src/server/game/unit/tank.js";
import { DefenderUnit } from "../src/server/game/unit/random/defender.js";

describe('Targeting Test', () => {
    // Each Player puts its heart on the board, so tests pass explicit unit lists to the finders
    // instead of board.entities. Otherwise the hearts would be candidates.
    let board: Board;
    let player: Player;
    let enemy: Player;
    let searcher: UnitWithTarget;

    beforeEach(() => {
        board = new Board(100, 100);
        player = new Player(0, new Pos(0, 0), board, "0", "", "");
        enemy = new Player(1, new Pos(99, 99), board, "1", "", "");
        searcher = SoldierUnit.construct(player, new Pos(0, 5)) as UnitWithTarget;
    });

    describe('findNewTarget', () => {
        it('targets the closest enemy', () => {
            const far = SoldierUnit.construct(enemy, new Pos(50, 5));
            const near = SoldierUnit.construct(enemy, new Pos(10, 5));
            searcher.findNewTarget([far, near]);
            assert.strictEqual(searcher.target, near);
        });

        it('keeps the first unit on a distance tie', () => {
            const first = SoldierUnit.construct(enemy, new Pos(10, 5));
            const second = SoldierUnit.construct(enemy, new Pos(10, 5));
            searcher.findNewTarget([first, second]);
            assert.strictEqual(searcher.target, first);
        });

        it('ignores units on its own team', () => {
            const friend = SoldierUnit.construct(player, new Pos(1, 5));
            const foe = SoldierUnit.construct(enemy, new Pos(50, 5));
            searcher.findNewTarget([friend, foe]);
            assert.strictEqual(searcher.target, foe);
        });

        it('has no target when nothing is valid', () => {
            const friend = SoldierUnit.construct(player, new Pos(1, 5));
            searcher.findNewTarget([friend]);
            assert.strictEqual(searcher.hasNoTarget(), true);
        });

        it('keeps its current target when a search finds nothing', () => {
            const foe = SoldierUnit.construct(enemy, new Pos(10, 5));
            searcher.target = foe;
            searcher.findNewTarget([]);
            assert.strictEqual(searcher.target, foe);
        });

        it('ignores invisible units', () => {
            const hidden = SoldierUnit.construct(enemy, new Pos(10, 5));
            const visible = SoldierUnit.construct(enemy, new Pos(50, 5));
            hidden.goInvisible();
            searcher.findNewTarget([hidden, visible]);
            assert.strictEqual(searcher.target, visible);
        });

        it('has no target when the only enemy is invisible', () => {
            const hidden = SoldierUnit.construct(enemy, new Pos(10, 5));
            hidden.goInvisible();
            searcher.findNewTarget([hidden]);
            assert.strictEqual(searcher.hasNoTarget(), true);
        });

        it('cannot target an untargetable defender, but still targets other enemies', () => {
            const defender = DefenderUnit.construct(enemy, new Pos(1, 5));
            const soldier = SoldierUnit.construct(enemy, new Pos(50, 5));
            searcher.findNewTarget([defender, soldier]);
            assert.strictEqual(searcher.target, soldier);
        });

        it('has no target when the only enemy is a defender', () => {
            const defender = DefenderUnit.construct(enemy, new Pos(1, 5));
            searcher.findNewTarget([defender]);
            assert.strictEqual(searcher.hasNoTarget(), true);
        });
    });

    describe('findBestEnemyInRange', () => {
        const strongest = (u: Unit, target: Unit) => u.totalHP > target.totalHP;

        it('picks the best enemy according to isBetter', () => {
            const soldier = SoldierUnit.construct(enemy, new Pos(10, 5));
            const tank = TankUnit.construct(enemy, new Pos(20, 5));
            assert.strictEqual(tank.totalHP > soldier.totalHP, true);
            assert.strictEqual(searcher.findBestEnemyInRange([soldier, tank], 100000, strongest), tank);
            assert.strictEqual(searcher.findBestEnemyInRange([tank, soldier], 100000, strongest), tank);
        });

        it('ignores enemies out of range', () => {
            const tank = TankUnit.construct(enemy, new Pos(50, 5));
            assert.strictEqual(searcher.findBestEnemyInRange([tank], 1, strongest), null);
        });

        it('ignores friendly units', () => {
            const friendlyTank = TankUnit.construct(player, new Pos(10, 5));
            const soldier = SoldierUnit.construct(enemy, new Pos(10, 5));
            assert.strictEqual(searcher.findBestEnemyInRange([friendlyTank, soldier], 100000, strongest), soldier);
        });

        it('returns null when there are no candidates', () => {
            assert.strictEqual(searcher.findBestEnemyInRange([], 100000, strongest), null);
        });

        it('skips invisible and defender enemies', () => {
            const hiddenTank = TankUnit.construct(enemy, new Pos(10, 5));
            hiddenTank.goInvisible();
            const defender = DefenderUnit.construct(enemy, new Pos(10, 5));
            const soldier = SoldierUnit.construct(enemy, new Pos(10, 5));
            assert.strictEqual(searcher.findBestEnemyInRange([hiddenTank, defender, soldier], 100000, strongest), soldier);
        });
    });
});
