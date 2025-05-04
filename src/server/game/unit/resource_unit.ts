import { Board } from "../board.js";
import { Player } from "../player.js";
import { Pos } from "../pos.js";
import { Resources } from "../resources.js";
import { GameUnit } from "./game_unit.js";
// import { GameUnit } from "./game_unit.js";
import { Unit } from "./unit.js";

export class ResourceUnit extends Unit {
    constructor(player : Player, pos : Pos, name : string, hp : number, speed : number, private resources : Resources, color : string) {
        super(player, name, pos, hp, speed, color);
        this.name = name;
    }
    doMove(_ : Board) {
        this.team.resources.add(this.resources);
    }
}

export class GameResourceUnit extends GameUnit {
    constructor(name : string, cost : Resources, private hp : number, private speed : number, private resources : Resources, private color : string, private blurb : string) {
        super(name, cost, blurb);
    }
    construct(player: Player, pos: Pos): Unit {
        return new ResourceUnit(player, pos, this.creationInfo.getName(), this.hp, this.speed, this.resources, this.color);
    }
    getBlurb(): string {
        return this.blurb
    }
}

export const MERCHANT_NAME = "Merchant";
export const LUMBER_JACK_NAME = "Lumber Jack";
export const MINER_NAME = "Miner";

const MERCHANT_COLOR = "#ffff00";
const LUMBER_JACK_COLOR = "#009900";
const MINER_COLOR = "#666699";

export const MERCHANT_BLURB = "Produces 1 gold a second";
export const LUMBER_JACK_BLURB = "Produces 1 wood a second";
export const MINER_BLURB = "Produces 1 stone a second";

const MERCHANT_PRODUCTION = new Resources(1, 0, 0);
const LUMBER_JACK_PRODUCTION = new Resources(0, 1, 0);
const MINER_PRODUCTION = new Resources(0, 0, 1);

export const MERCHANT_COST = new Resources(25, 0, 0);
export const LUMBER_JACK_COST = new Resources(50, 0, 0);
export const MINER_COST = new Resources(100, 25, 0);

export const MINER_SPEED = 10;

export const MERCHANT_GAME_UNIT = new GameResourceUnit(MERCHANT_NAME, MERCHANT_COST, 1, 10, MERCHANT_PRODUCTION, MERCHANT_COLOR, MERCHANT_BLURB);
export const LUMBER_JACK_GAME_UNIT = new GameResourceUnit(LUMBER_JACK_NAME, LUMBER_JACK_COST, 1, 10, LUMBER_JACK_PRODUCTION, LUMBER_JACK_COLOR, LUMBER_JACK_BLURB);
export const MINER_GAME_UNIT = new GameResourceUnit(MINER_NAME, MINER_COST, 1, MINER_SPEED, MINER_PRODUCTION, MINER_COLOR, MINER_BLURB);

export class ResourceUnitFactory {
    constructor(private player : Player) {}

    NewMerchant(pos : Pos) : ResourceUnit {
        return new ResourceUnit(this.player, pos, MERCHANT_NAME, 1, 10, MERCHANT_PRODUCTION, MERCHANT_COLOR);
    }

    NewLumberJack(pos : Pos) : ResourceUnit {
        return new ResourceUnit(this.player, pos, LUMBER_JACK_NAME, 1, 10, LUMBER_JACK_PRODUCTION, LUMBER_JACK_COLOR);
    }

    NewMiner(pos : Pos) : ResourceUnit {
        return new ResourceUnit(this.player, pos, MINER_NAME, 1, MINER_SPEED, MINER_PRODUCTION, MINER_COLOR);
    }
}