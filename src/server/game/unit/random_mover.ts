import { Board } from "../board.js";
import { Random } from "../math.js";
import { Player } from "../player.js";
import { Pos } from "../pos.js";
import { Resources } from "../resources.js";
import { GameUnit } from "./game_unit.js";
import { Melee } from "./melee_unit.js";
import { Unit } from "./unit.js";

export class RandomMover extends Melee {
    constructor(player: Player, pos: Pos) {
        super(player, RandomMoverUnit.NAME, pos, RandomMoverUnit.HP, RandomMoverUnit.SPEED, RandomMoverUnit.COLOR, RandomMoverUnit.DAMAGE);
    }
    doMove(board: Board): void {
        if (Random.fromRange(1, 10) == 1) {
            this.pos = new Pos(
                Random.fromRange(0, board.width),
                Random.fromRange(0, board.height)
            );
        }
        super.doMove(board);
    }
}

export class RandomMoverUnit extends GameUnit {
    static NAME = "Random Mover";
    static COST = new Resources(5, 5, 0);
    static SPEED = 10;
    static DAMAGE = 1;
    static HP = 3;
    static COLOR = "#ccccff";
    static BLURB = "Is just like a soldier but randomly teleports to different parts of the map";
    constructor() {
        super(RandomMoverUnit.NAME, RandomMoverUnit.COST, RandomMoverUnit.BLURB);
    }
    construct(player: Player, pos: Pos): Unit {
        return new RandomMover(player, pos);
    }
}