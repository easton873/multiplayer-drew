import * as assert from "assert";
import { Board } from "../src/server/game/board.js";
import { Pos } from "../src/server/game/pos.js";
import { Unit } from "../src/server/game/unit/unit.js";
import { RandomComputer } from "../src/server/game/computer/random.js";
import { MERCHANT_GAME_UNIT, ResourceUnit } from "../src/server/game/unit/resource_unit.js";



describe('Board Test', () => {
    it('removal test', () => {
        let board : Board = new Board(10, 10);
        let player : RandomComputer = new RandomComputer(1, new Pos(0, 0), board, "", "", "");
        let unit : Unit = MERCHANT_GAME_UNIT.construct(player, new Pos(0, 0));
        board.addEntity(unit);
        player.getRateOfIncome();
    });
});