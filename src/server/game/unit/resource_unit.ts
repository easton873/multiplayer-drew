import { Board } from "../board.js";
import { Player } from "../player.js";
import { Pos } from "../pos.js";
import { Resources } from "../resources.js";
import { GameUnit } from "./game_unit.js";
// import { GameUnit } from "./game_unit.js";
import { Unit } from "./unit.js";

export class ResourceUnit extends Unit {
    constructor(player : Player, pos : Pos, name : string, hp : number, speed : number, protected resources : Resources, color : string) {
        super(player, name, pos, hp, speed, color);
        this.name = name;
    }
    doMove(_ : Board) {
        this.owner.resources.add(this.resources);
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

const MERCHANT_NAME = "Merchant";
const LUMBER_JACK_NAME = "Lumber Jack";
const MINER_NAME = "Miner";
const CARPENTER_NAME = "Carpenter";
const PROSPECTOR_NAME = "Prospector";
const INVESTMENT_BANKER_NAME = "Investment Banker";
const INDUSTRIAL_WORKER_NAME = "Industrial Worker";
const RICH_GUY_NAME = "Rich Guy";

const MERCHANT_COLOR = "#ffff00";
const LUMBER_JACK_COLOR = "#009900";
const MINER_COLOR = "#666699";
const CARPENTER_COLOR = "#A5CC19";
const PROSPECTOR_COLOR = "#C41AC7"
const INVESTMENT_BANKER_COLOR = "#430404ff"
const INDUSTRIAL_WORKER_COLOR = "#78490fff"
const RICH_GUY_COLOR = "#1d94bcff"

const MERCHANT_BLURB = "Produces 1 gold a second";
const LUMBER_JACK_BLURB = "Produces 1 wood a second";
const MINER_BLURB = "Produces 1 stone a second";
const CARPENTER_BLURB = "Produces 2 gold and 1 wood a second";
const PROSPECTOR_BLURB = "Produces 1 gold, 1 wood, and 1 stone a second";
const INVESTMENT_BANKER_BLURB = "Produces 5 gold a second";
const INDUSTRIAL_WORKER_BLURB = "Produces 3 gold, 3 wood, and 3 stone a second";
const RICH_GUY_BLURB = "Produces 20 gold a second";

const MERCHANT_PRODUCTION = new Resources(1, 0, 0);
const LUMBER_JACK_PRODUCTION = new Resources(0, 1, 0);
const MINER_PRODUCTION = new Resources(0, 0, 1);
const CARPENTER_PRODUCTION = new Resources(2, 1, 0);
const PROSPECTOR_PRODUCTION = new Resources(1, 1, 1);
const INVESTMENT_BANKER_PRODUCTION = new Resources(1, 0, 0);
const INDUSTRIAL_WORKER_PRODUCTION = new Resources(1, 1, 1);
const RICH_GUY_PRODUCTION = new Resources(1, 1, 1);

const MERCHANT_COST = new Resources(25, 0, 0);
const LUMBER_JACK_COST = new Resources(50, 0, 0);
const MINER_COST = new Resources(100, 25, 0);
const CARPENTER_COST = new Resources(100, 25, 0);
const PROSPECTOR_COST = new Resources(100, 25, 25);
const INVESTMENT_BANKER_COST = new Resources(75, 50, 50);
const INDUSTRIAL_WORKER_COST = new Resources(150, 100, 100);
const RICH_GUY_COST = new Resources(500, 500, 500);

export const MINER_SPEED = 20;

export const MERCHANT_GAME_UNIT = new GameResourceUnit(MERCHANT_NAME, MERCHANT_COST, 1, 20, MERCHANT_PRODUCTION, MERCHANT_COLOR, MERCHANT_BLURB);
export const LUMBER_JACK_GAME_UNIT = new GameResourceUnit(LUMBER_JACK_NAME, LUMBER_JACK_COST, 1, 20, LUMBER_JACK_PRODUCTION, LUMBER_JACK_COLOR, LUMBER_JACK_BLURB);
export const MINER_GAME_UNIT = new GameResourceUnit(MINER_NAME, MINER_COST, 1, MINER_SPEED, MINER_PRODUCTION, MINER_COLOR, MINER_BLURB);
export const CARPENTER_GAME_UNIT = new GameResourceUnit(CARPENTER_NAME, CARPENTER_COST, 3, 20, CARPENTER_PRODUCTION, CARPENTER_COLOR, CARPENTER_BLURB);
export const PROSPECTOR_GAME_UNIT = new GameResourceUnit(PROSPECTOR_NAME, PROSPECTOR_COST, 5, 20, PROSPECTOR_PRODUCTION, PROSPECTOR_COLOR, PROSPECTOR_BLURB);
export const INVESTMENT_BANKER_GAME_UNIT = new GameResourceUnit(INVESTMENT_BANKER_NAME, INVESTMENT_BANKER_COST, 2, 4, INVESTMENT_BANKER_PRODUCTION, INVESTMENT_BANKER_COLOR, INVESTMENT_BANKER_BLURB);
export const INDUSTRIAL_WORKER_GAME_UNIT = new GameResourceUnit(INDUSTRIAL_WORKER_NAME, INDUSTRIAL_WORKER_COST, 10, 6, INDUSTRIAL_WORKER_PRODUCTION, INDUSTRIAL_WORKER_COLOR, INDUSTRIAL_WORKER_BLURB);
export const RICH_GUY_GAME_UNIT = new GameResourceUnit(RICH_GUY_NAME, RICH_GUY_COST, 20, 0, RICH_GUY_PRODUCTION, RICH_GUY_COLOR, RICH_GUY_BLURB);