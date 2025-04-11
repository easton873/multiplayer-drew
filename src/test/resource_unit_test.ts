import * as assert from "assert";
import { Player } from "../server/player";
import { Resources } from "../server/resources";
import { Pos } from "../server/pos";
import { Board } from "../server/board";
import { LUMBER_JACK_NAME, MERCHANT_NAME, MINER_NAME } from "../server/unit/resource_unit";
import { UnitFactory } from "../server/unit_factory";

describe('Resource Unit Tests', () => {
    it('Merchant test', () => {
        let board : Board = new Board(10, 10);
        let player : Player = new Player(new Pos(0, 0), board);
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
        let player : Player = new Player(new Pos(0, 0), board);
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
        let player : Player = new Player(new Pos(0, 0), board);
        let unitFactory : UnitFactory = new UnitFactory(player);
        let unit = unitFactory.NewMiner(new Pos(0, 0));

        player.resources = new Resources(0, 0, 0);
        let r = player.resources.copy();
        r.add(new Resources(0, 0, 1));
        
        unit.doMove(board);
        assert.strictEqual(player.resources.equals(r), true);
    });
})