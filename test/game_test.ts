import * as assert from "assert";
import { Resources } from "../src/server/game/resources.js";
import { Pos } from "../src/server/game/pos.js";
import { Board } from "../src/server/game/board.js";
import { Player } from "../src/server/game/player.js";
import { Game } from "../src/server/game/game.js";
import { SoldierUnit } from "../src/server/game/unit/soldier.js";

describe('Game Test', () => {
    it('Remove all units of player', () => {
        let [game, board, p1, p2, p3] = newThreePlayerGame();
        p1.resources.add(new Resources(20, 0, 0));
        
        p1.NewUnit(SoldierUnit.NAME, new Pos(0, 0));
        p1.NewUnit(SoldierUnit.NAME, new Pos(0, 0));
        p1.NewUnit(SoldierUnit.NAME, new Pos(0, 0));

        p2.NewUnit(SoldierUnit.NAME, new Pos(0, 0));
        
        p3.NewUnit(SoldierUnit.NAME, new Pos(0, 0));

        assert.strictEqual(board.entities.length, 8);
        p1.heart.currHp = 0;
        game.arePlayersStillAlive();
        assert.strictEqual(board.entities.length, 4);
    });

    it('Game ends', () => {
        let [game, board, p1, p2, p3] = newThreePlayerGame();

        assert.strictEqual(game.checkGameStillGoing(), true);
        p2.heart.currHp = 0;
        game.arePlayersStillAlive();
        assert.strictEqual(game.players.length, 2);
        p3.heart.currHp = 0;
        game.arePlayersStillAlive();
        assert.strictEqual(game.players.length, 1);
        assert.strictEqual(game.checkGameStillGoing(), false);
    });
});

it('Short Game', () => {
    let [game, board, p1, p2, p3] = newThreePlayerGame();

    for (let i = 0; i < 1000; i++) {
        game.mainLoop()
    }

    assert.strictEqual(board.entities.length, 3);

    p1.NewUnit(SoldierUnit.NAME, new Pos(0, 4));

    assert.strictEqual(board.entities.length, 4);

    for (let i = 0; i < 1000; i++) {
        game.mainLoop();
    }

    assert.strictEqual(game.checkGameStillGoing(), false);
});

function newThreePlayerGame() : [Game, Board, Player, Player, Player] {
    let board : Board = new Board(10, 10);
    let p1 : Player = new Player(0, new Pos(0, 5), board, "0", "", "");
    let p2 : Player = new Player(1, new Pos(9, 5), board, "1", "", "");
    let p3 : Player = new Player(2, new Pos(5, 9), board, "2", "", "");
    let game : Game = new Game([p1, p2, p3], board);
    return [game, board, p1, p2, p3];
}