import { FIFTH_ERA_NAME, FOURTH_ERA_NAME, SECOND_ERA_NAME, SIXTH_ERA_NAME, STARTING_ERA_NAME, THIRD_ERA_NAME } from "../era.js";
import { PlayerProxy } from "../player.js";
import { Pos } from "../pos.js";
import { Resources } from "../resources.js";
import { GameUnit } from "../unit/game_unit.js";
import { GorillaWarfareUnit } from "../unit/gorilla_warfare.js";
import { QuickAttackerUnit, RandomMoverUnit, SoldierUnit } from "../unit/melee_unit.js";
import { ArcherUnit, FireballThrowerUnit } from "../unit/ranged_unit.js";
import { CARPENTER_GAME_UNIT, LUMBER_JACK_GAME_UNIT, MASON_GAME_UNIT, MERCHANT_GAME_UNIT, MINER_GAME_UNIT, SCAVENGER_GAME_UNIT } from "../unit/resource_unit.js";
import { SummonerUnit } from "../unit/summoner.js";
import { Unit } from "../unit/unit.js";

export class NoOpComputer extends PlayerProxy {
    
}