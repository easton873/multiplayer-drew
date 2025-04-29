import * as assert from "assert";
import { Board } from "../src/server/game/board.js";
import { Player } from "../src/server/game/player.js";
import { UnitFactory } from "../src/server/game/unit_factory.js";
import { Pos } from "../src/server/game/pos.js";
import { Resources } from "../src/server/game/resources.js";

describe('Resource Unit Tests', () => {
    it('Merchant test', () => {
        let board : Board = new Board(10, 10);
        let player : Player = new Player(0, new Pos(0, 0), board, "0", "");
        let unitFactory : UnitFactory = new UnitFactory(player);
        let unit = unitFactory.NewMerchant(new Pos(0, 0));

        player.resources = new Resources(0, 0, 0);
        let r = player.resources.copy();
        r.add(new Resources(1, 0, 0));
        
        unit.doMove(board);
        assert.strictEqual(player.resources.equals(r), true);
    });

    it('Lumberjack test', () => {
        let board : Board = new Board(10, 10);
        let player : Player = new Player(0, new Pos(0, 0), board, "0", "");
        let unitFactory : UnitFactory = new UnitFactory(player);
        let unit = unitFactory.NewLumberJack(new Pos(0, 0));

        player.resources = new Resources(0, 0, 0);
        let r = player.resources.copy();
        r.add(new Resources(0, 1, 0));
        
        unit.doMove(board);
        assert.strictEqual(player.resources.equals(r), true);
    });

    it('Miner test', () => {
        let board : Board = new Board(10, 10);
        let player : Player = new Player(0, new Pos(0, 0), board, "0", "");
        let unitFactory : UnitFactory = new UnitFactory(player);
        let unit = unitFactory.NewMiner(new Pos(0, 0));

        player.resources = new Resources(0, 0, 0);
        let r = player.resources.copy();
        r.add(new Resources(0, 0, 1));
        
        unit.doMove(board);
        assert.strictEqual(player.resources.equals(r), true);
    });
})