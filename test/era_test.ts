import * as assert from "assert";
import { Resources } from "../src/server/game/resources.js";
import { Era, EraInfo } from "../src/server/game/era.js";
import { Board } from "../src/server/game/board.js";
import { Player, PlayerProxy } from "../src/server/game/player.js";
import { Pos } from "../src/server/game/pos.js";
import { Counter } from "../src/server/game/move/counter.js";
import { EraUnit, Faction } from "../src/server/game/factions/faction.js";

const FIRST_COST = new Resources(100, 0, 0);
const SECOND_COST = new Resources(0, 50, 0);

const TEST_ERAS = [
    new EraInfo("first", new Resources(), new Resources(0, 1, 0), 10, 1, 5, 1),
    new EraInfo("second", FIRST_COST, new Resources(0, 0, 1), 10, 2, 10, 2),
    new EraInfo("third", SECOND_COST, new Resources(1, 1, 1), 10, 3, 15, 3),
];

class TestFaction extends Faction {
    getEraInfo(): EraInfo[] {
        return TEST_ERAS;
    }
    getMilitaryUnits(): EraUnit[] {
        return [];
    }
    getResourceUnits(): EraUnit[] {
        return [];
    }
}

describe('Era Test', () => {
    it('starts at the first era', () => {
        let era = new Era(TEST_ERAS);
        assert.strictEqual(era.level, 0);
        assert.strictEqual(era.getCurrEra().name, "first");
        assert.strictEqual(era.getNextEra().name, "second");
        assert.strictEqual(era.getUnitLimit(), 5);
    });

    it('cannot advance without enough resources', () => {
        let era = new Era(TEST_ERAS);
        let resources = new Resources(99, 0, 0);
        assert.strictEqual(era.canAffordNextEra(resources), false);
        assert.strictEqual(era.advanceToNextEra(resources), false);
        assert.strictEqual(era.level, 0);
        assert.strictEqual(resources.equals(new Resources(99, 0, 0)), true);
    });

    it('advancing spends the cost of the next era', () => {
        let era = new Era(TEST_ERAS);
        let resources = new Resources(105, 0, 0);
        assert.strictEqual(era.canAffordNextEra(resources), true);
        assert.strictEqual(era.advanceToNextEra(resources), true);
        assert.strictEqual(era.level, 1);
        assert.strictEqual(era.getCurrEra().name, "second");
        assert.strictEqual(era.getUnitLimit(), 10);
        assert.strictEqual(resources.equals(new Resources(5, 0, 0)), true);
        // the next advance costs the third era's price, not the second's
        assert.strictEqual(era.canAffordNextEra(resources), false);
    });

    it('cannot advance past the last era', () => {
        let era = new Era(TEST_ERAS);
        let resources = new Resources(1000, 1000, 1000);
        assert.strictEqual(era.advanceToNextEra(resources), true);
        assert.strictEqual(era.advanceToNextEra(resources), true);
        let before = resources.copy();
        assert.strictEqual(era.getEraData().hasNextEra, false);
        assert.strictEqual(era.advanceToNextEra(resources), false);
        assert.strictEqual(era.level, 2);
        assert.strictEqual(resources.equals(before), true);
    });

    it('era data reports the next era', () => {
        let era = new Era(TEST_ERAS);
        let data = era.getEraData();
        assert.strictEqual(data.eraName, "first");
        assert.strictEqual(data.hasNextEra, true);
        assert.deepStrictEqual(data.nextEraCost, FIRST_COST.getResourceData());
    });

    it('heart upgrade', () => {
        let board : Board = new Board(10, 10);
        let player : Player = new PlayerProxy(0, new Pos(0, 0), board, "0", "", "");
        player.faction = new TestFaction();
        player.heart.updateHeart(player.era.getHeart());

        let startResources = player.resources.copy();
        player.heart.moveCounter = new Counter(0);
        board.moveUnit(player.heart);
        startResources.add(TEST_ERAS[0].resources);
        assert.strictEqual(player.resources.equals(startResources), true);
        assert.strictEqual(player.heart.hp, 1);
        assert.strictEqual(player.heart.totalHP, 1);

        player.resources.add(FIRST_COST);
        assert.strictEqual(player.attemptUpgradeEra(), true);
        assert.strictEqual(player.heart.hp, 2);
        assert.strictEqual(player.heart.totalHP, 2);
    });
});
