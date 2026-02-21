import { Board } from "../board.js";
import { Player } from "../player.js";
import { Pos } from "../pos.js";
import { Resources } from "../resources.js";
import { GameUnit } from "./game_unit.js";
import { SoldierUnit } from "./melee_unit.js";
import { Unit, UnitWithCounter } from "./unit.js";

export class Spawner extends UnitWithCounter {
    constructor(player : Player, name : string, pos : Pos, hp : number, speed : number, color : string, protected unitToSpawn : GameUnit) {
        super(player, name, pos, hp, speed, color);
    }
    doMove(board: Board) {
        if (this.owner.atUnitCap()) {
            return;
        }
        this.owner.addUnitToBoard(this.unitToSpawn, this.pos.clone());
    }
}

export class Barracks extends Spawner {
    constructor(player : Player, pos : Pos) {
        super(player, barracksUnit.NAME, pos, barracksUnit.HP, barracksUnit.SPEED, barracksUnit.COLOR, SoldierUnit);
    }
}

export class barracksUnit extends GameUnit {
    static NAME = "Barracks";
    static COST = new Resources(500, 250, 50);
    static SPEED = 100;
    static HP = 20;
    static COLOR = "#504337";
    static BLURB = "Spawns soldiers";
    constructor() {
        super(barracksUnit.NAME, barracksUnit.COST, barracksUnit.BLURB);
    }
    construct(player: Player, pos: Pos): Unit {
        return new Barracks(player, pos);
    }
}

export const BarracksUnit : barracksUnit = new barracksUnit();