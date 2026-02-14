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

// Era 1
const MERCHANT_NAME = "Merchant💰"; 
// Era 2
const LUMBER_JACK_NAME = "Lumber Jack🪵";
// Era 3
const MINER_NAME = "Miner🪨";
const CARPENTER_NAME = "Carpenter💰🪵";
// Era 4
const MASON_NAME = "Mason💰🪨";
const SCAVENGER_NAME = "Scavenger💰🪵🪨";
// Era 5
const SCULPTOR_NAME = "Sculptor💰🪨";
const ARCHITECT_NAME = "Architect🪵🪨";
const BANKER_NAME = "Banker💵";
// Era 6
const ALCHEMIST_NAME = "Alchemist💰🪵🪨";
const ENGINEER_NAME = "Engineer💰🪨";
const DRUID_NAME = "Druid🪵🪨";

const MERCHANT_COLOR = "#ffff00";
const LUMBER_JACK_COLOR = "#009900";
const MINER_COLOR = "#666699";
const CARPENTER_COLOR = "#A5CC19";
const MASON_COLOR = "#8B7355";
const SCAVENGER_COLOR = "#B87333";
const SCULPTOR_COLOR = "#C0B8A8";
const ARCHITECT_COLOR = "#4A90D9";
const BANKER_COLOR = "#DAA520";
const ALCHEMIST_COLOR = "#9B59B6";
const ENGINEER_COLOR = "#708090";
const DRUID_COLOR = "#2E8B57";

const MERCHANT_BLURB = "Produces 1 gold a second";
const LUMBER_JACK_BLURB = "Produces 1 wood a second";
const MINER_BLURB = "Produces 1 stone a second";
const CARPENTER_BLURB = "Produces 1 gold and 2 wood a second";
const MASON_BLURB = "Produces 1 gold and 2 stone a second";
const SCAVENGER_BLURB = "Produces 1 gold, 1 wood, and 1 stone a second";
const SCULPTOR_BLURB = "Produces 2 gold and 2 stone a second";
const ARCHITECT_BLURB = "Produces 3 wood and 2 stone a second";
const BANKER_BLURB = "Produces 4 gold a second";
const ALCHEMIST_BLURB = "Produces 3 gold, 2 wood, and 3 stone a second";
const ENGINEER_BLURB = "Produces 5 gold and 4 stone a second";
const DRUID_BLURB = "Produces 5 wood and 3 stone a second";

const MERCHANT_PRODUCTION = new Resources(1, 0, 0);
const LUMBER_JACK_PRODUCTION = new Resources(0, 1, 0);
const MINER_PRODUCTION = new Resources(0, 0, 1);
const CARPENTER_PRODUCTION = new Resources(1, 2, 0);
const MASON_PRODUCTION = new Resources(1, 0, 2);
const SCAVENGER_PRODUCTION = new Resources(1, 1, 1);
const SCULPTOR_PRODUCTION = new Resources(2, 0, 2);
const ARCHITECT_PRODUCTION = new Resources(0, 3, 2);
const BANKER_PRODUCTION = new Resources(4, 0, 0);
const ALCHEMIST_PRODUCTION = new Resources(3, 2, 3);
const ENGINEER_PRODUCTION = new Resources(5, 0, 4);
const DRUID_PRODUCTION = new Resources(0, 5, 3);

const MERCHANT_COST = new Resources(25, 0, 0);
const LUMBER_JACK_COST = new Resources(50, 0, 0);
const MINER_COST = new Resources(100, 25, 0);
const CARPENTER_COST = new Resources(100, 25, 0);
const MASON_COST = new Resources(200, 75, 0);
const SCAVENGER_COST = new Resources(125, 75, 50);
const SCULPTOR_COST = new Resources(300, 150, 50);
const ARCHITECT_COST = new Resources(350, 50, 100);
const BANKER_COST = new Resources(250, 150, 100);
const ALCHEMIST_COST = new Resources(500, 300, 200);
const ENGINEER_COST = new Resources(600, 300, 100);
const DRUID_COST = new Resources(300, 400, 200);

export const MINER_SPEED = 20;

export const MERCHANT_GAME_UNIT = new GameResourceUnit(MERCHANT_NAME, MERCHANT_COST, 1, 30, MERCHANT_PRODUCTION, MERCHANT_COLOR, MERCHANT_BLURB);
export const LUMBER_JACK_GAME_UNIT = new GameResourceUnit(LUMBER_JACK_NAME, LUMBER_JACK_COST, 1, 30, LUMBER_JACK_PRODUCTION, LUMBER_JACK_COLOR, LUMBER_JACK_BLURB);
export const MINER_GAME_UNIT = new GameResourceUnit(MINER_NAME, MINER_COST, 1, MINER_SPEED, MINER_PRODUCTION, MINER_COLOR, MINER_BLURB);
export const CARPENTER_GAME_UNIT = new GameResourceUnit(CARPENTER_NAME, CARPENTER_COST, 3, 30, CARPENTER_PRODUCTION, CARPENTER_COLOR, CARPENTER_BLURB);
export const MASON_GAME_UNIT = new GameResourceUnit(MASON_NAME, MASON_COST, 3, 30, MASON_PRODUCTION, MASON_COLOR, MASON_BLURB);
export const SCAVENGER_GAME_UNIT = new GameResourceUnit(SCAVENGER_NAME, SCAVENGER_COST, 3, 30, SCAVENGER_PRODUCTION, SCAVENGER_COLOR, SCAVENGER_BLURB);
export const SCULPTOR_GAME_UNIT = new GameResourceUnit(SCULPTOR_NAME, SCULPTOR_COST, 5, 30, SCULPTOR_PRODUCTION, SCULPTOR_COLOR, SCULPTOR_BLURB);
export const ARCHITECT_GAME_UNIT = new GameResourceUnit(ARCHITECT_NAME, ARCHITECT_COST, 5, 30, ARCHITECT_PRODUCTION, ARCHITECT_COLOR, ARCHITECT_BLURB);
export const BANKER_GAME_UNIT = new GameResourceUnit(BANKER_NAME, BANKER_COST, 5, 30, BANKER_PRODUCTION, BANKER_COLOR, BANKER_BLURB);
export const ALCHEMIST_GAME_UNIT = new GameResourceUnit(ALCHEMIST_NAME, ALCHEMIST_COST, 8, 30, ALCHEMIST_PRODUCTION, ALCHEMIST_COLOR, ALCHEMIST_BLURB);
export const ENGINEER_GAME_UNIT = new GameResourceUnit(ENGINEER_NAME, ENGINEER_COST, 8, 30, ENGINEER_PRODUCTION, ENGINEER_COLOR, ENGINEER_BLURB);
export const DRUID_GAME_UNIT = new GameResourceUnit(DRUID_NAME, DRUID_COST, 8, 30, DRUID_PRODUCTION, DRUID_COLOR, DRUID_BLURB);