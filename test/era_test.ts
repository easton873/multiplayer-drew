
import * as assert from "assert";
import { Resources } from "../src/server/game/resources.js";
import { Era, EraState, StartingEra } from "../src/server/game/era.js";
import { EraHeartInfo } from "../src/server/game/heart.js";
import { Board } from "../src/server/game/board.js";
import { Player } from "../src/server/game/player.js";
import { PlayerProxy } from "../src/server/game/player.js";
import { Pos } from "../src/server/game/pos.js";
import { Counter } from "../src/server/game/move/counter.js";

describe('Era Test', () => {
    it('era test', () => {
        let era = new Era();
        let myResources = new Resources(5, 0, 0);
        assert.strictEqual(era.canAffordNextEra(myResources), false);
        era.advanceToNextEra(myResources);
        assert.strictEqual(myResources.equals(new Resources(5, 0, 0)), true);
        myResources.add(era.nextEraCost);
        assert.strictEqual(era.canAffordNextEra(myResources), true);
        era.advanceToNextEra(myResources);
        assert.strictEqual(myResources.equals(new Resources(5, 0, 0)), true);
        assert.strictEqual(era.canAffordNextEra(myResources), false);
    });

    it('heart upgrade', () => {
        let startHP = 1;
        let secondHP = 2;
        let firstHeartInfo = new Resources(0, 1, 0);
        let secondHeartInfo = new Resources(0, 0, 1);
        let cost = new Resources(100, 0, 0);
        class testEra extends StartingEra {
            getHeart(): EraHeartInfo {
                return new EraHeartInfo(startHP, 10, firstHeartInfo);
            }
            nextEraCost(): Resources {
                return cost;
            }
            nextState(): EraState {
                return new testEra2();
            }
        }
        class testEra2 extends StartingEra {
            getHeart(): EraHeartInfo {
                return new EraHeartInfo(2, 0, secondHeartInfo);
            }
            nextEraCost(): Resources {
                return cost;
            }
        }
        let board : Board = new Board(10, 10);
        let player : Player = new PlayerProxy(0, new Pos(0, 0), board, "0", "", "");
        player.era.currEra = new testEra();
        player.era.prepareNewEra(player.era.currEra);
        player.heart.updateHeart(player.era.currEra.getHeart());
        let startResources = player.resources.copy();
        player.heart.moveCounter = new Counter(0);
        player.heart.move(board);
        startResources.add(firstHeartInfo);
        assert.strictEqual(player.resources.equals(startResources), true);
        assert.strictEqual(player.heart.hp, startHP);
        assert.strictEqual(player.heart.totalHP, startHP);
        player.resources.add(cost);
        player.attemptUpgradeEra();
        assert.strictEqual(player.heart.hp, secondHP);
        assert.strictEqual(player.heart.totalHP, secondHP);
    });
});