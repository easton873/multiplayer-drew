import { Board } from "../board.js";
import { Player } from "../player.js";
import { Pos } from "../pos.js";
import { Resources } from "../resources.js";
import { Unit } from "./unit.js";

export class ResourceUnit extends Unit {
    constructor(player : Player, pos : Pos, name : string, hp : number, speed : number, private resources : Resources, cost : Resources) {
        super(player, pos, hp, speed, cost);
        this.name = name;
    }
    doMove(_ : Board) {
        this.team.resources.add(this.resources);
    }
}

export const MERCHANT_NAME = "Merchant";
export const LUMBER_JACK_NAME = "Lumber Jack";
export const MINER_NAME = "Miner";

export class ResourceUnitFactory {
    constructor(private player : Player) {}

    NewMerchant(pos : Pos) : ResourceUnit {
        return new ResourceUnit(this.player, pos, MERCHANT_NAME, 1, 5, new Resources(1, 0, 0), new Resources(3, 0, 0));
    }

    NewLumberJack(pos : Pos) : ResourceUnit {
        return new ResourceUnit(this.player, pos, LUMBER_JACK_NAME, 1, 5, new Resources(0, 1, 0), new Resources(5, 0, 0));
    }

    NewMiner(pos : Pos) : ResourceUnit {
        return new ResourceUnit(this.player, pos, MINER_NAME, 1, 5, new Resources(0, 0, 1), new Resources(8, 3, 0));
    }
}