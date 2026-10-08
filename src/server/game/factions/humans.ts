import { HealerUnit } from "../unit/healer.js";
import { GoblinUnit, QuickAttackerUnit, RandomMoverUnit, SabotagerUnit, ScountUnit, SoldierUnit } from "../unit/melee_unit.js";
import { ArcherUnit, FireballThrowerUnit, SniperUnit } from "../unit/ranged_unit.js";
import {
    MERCHANT_GAME_UNIT,
    LUMBER_JACK_GAME_UNIT,
    MINER_GAME_UNIT,
    CARPENTER_GAME_UNIT,
    MASON_GAME_UNIT,
    SCAVENGER_GAME_UNIT,
    SCULPTOR_GAME_UNIT,
    ARCHITECT_GAME_UNIT,
    BANKER_GAME_UNIT,
    ALCHEMIST_GAME_UNIT,
    ENGINEER_GAME_UNIT,
    DRUID_GAME_UNIT,
} from '../unit/resource_unit.js';
import { TankUnit } from "../unit/tank.js";
import { KamakazeUnit } from "../unit/kamakaze.js";
import { SettlerUnit, CityBuilderUnit } from "../unit/settler.js";
import { TurretUnit } from "../unit/turret.js";
import { NinjaUnit, SpyUnit, AssassainUnit } from "../unit/combat/stealth.js";
import { CatapultUnit } from "../unit/catapult.js";
import { SummonerUnit } from "../unit/summoner.js";
import { MissionaryUnit } from "../unit/combat/missionary.js";
import { BarracksUnit } from "../unit/barracks.js";
import { VampireUnit } from "../unit/combat/vampire.js";
import { TeleporterUnit } from "../unit/teleporter.js";
import { GorillaWarfareUnit } from "../unit/gorilla_warfare.js";
import { FlareUnit } from "../unit/flare.js";
import { CounterMissileUnit, CounterCounterMissileUnit } from "../unit/counter_missile.js";
import { UnitMissileUnit, BallisticMissileUnit, MissileUnit } from "../unit/missile.js";
import { EraUnit, Faction } from "./faction.js";
import { EraInfo } from "../era.js";
import { Resources } from "../resources.js";
import { GOLD_RESOURCE, STONE_RESOURCE, WOOD_RESOURCE } from "../../../shared/resource_types.js";

export const STARTING_ERA_NAME = "The Starting Era";
export const SECOND_ERA_NAME = "The Second Era";
export const THIRD_ERA_NAME = "Third Era";
export const FOURTH_ERA_NAME = "Fourth Era";
export const FIFTH_ERA_NAME = "Fifth Era";
export const SIXTH_ERA_NAME = "Sixth Era";

export class Humans extends Faction {
    getEraInfo(): EraInfo[] {
        // cost is what it takes to advance *into* that era
        //            name                  cost                              resources                   speed hp   units radius
        return [
            new EraInfo(STARTING_ERA_NAME, new Resources(),                  new Resources({ gold: 1 }),     10,   10,  25,   25, [GOLD_RESOURCE]),
            new EraInfo(SECOND_ERA_NAME,   new Resources({ gold: 400 }),         new Resources({ gold: 2 }),     10,   20,  50,   49, [GOLD_RESOURCE, WOOD_RESOURCE]),
            new EraInfo(THIRD_ERA_NAME,        new Resources({ gold: 1000, wood: 300 }),      new Resources({ gold: 3, wood: 1 }),     10,   30,  100,  100, [GOLD_RESOURCE, WOOD_RESOURCE, STONE_RESOURCE]),
            new EraInfo(FOURTH_ERA_NAME,       new Resources({ gold: 3000, wood: 1000, stone: 300 }),   new Resources({ gold: 3, wood: 1, stone: 1 }),     10,   45,  200,  225, [GOLD_RESOURCE, WOOD_RESOURCE, STONE_RESOURCE]),
            new EraInfo(FIFTH_ERA_NAME,        new Resources({ gold: 5000, wood: 3000, stone: 1500 }),  new Resources({ gold: 5, wood: 3, stone: 2 }),     10,   70,  400,  400, [GOLD_RESOURCE, WOOD_RESOURCE, STONE_RESOURCE]),
            new EraInfo(SIXTH_ERA_NAME,        new Resources({ gold: 8000, wood: 5000, stone: 4000 }),  new Resources({ gold: 10, wood: 10, stone: 10 }),  10,   100, 800,  900, [GOLD_RESOURCE, WOOD_RESOURCE, STONE_RESOURCE]),
        ];
    }
    getResourceUnits(): EraUnit[] {
        return [
            new EraUnit(MERCHANT_GAME_UNIT, 0),

            new EraUnit(LUMBER_JACK_GAME_UNIT, 1),

            new EraUnit(MINER_GAME_UNIT, 2),
            new EraUnit(CARPENTER_GAME_UNIT, 2),

            new EraUnit(MASON_GAME_UNIT, 3),
            new EraUnit(SCAVENGER_GAME_UNIT, 3),

            new EraUnit(SCULPTOR_GAME_UNIT, 4),
            new EraUnit(ARCHITECT_GAME_UNIT, 4),
            new EraUnit(BANKER_GAME_UNIT, 4),

            new EraUnit(ALCHEMIST_GAME_UNIT, 5),
            new EraUnit(ENGINEER_GAME_UNIT, 5),
            new EraUnit(DRUID_GAME_UNIT, 5),
        ]
    }
    getMilitaryUnits(): EraUnit[] {
        return [
            new EraUnit(ScountUnit, 0),
            new EraUnit(SoldierUnit, 0),
            new EraUnit(ArcherUnit, 0),

            new EraUnit(QuickAttackerUnit, 1),
            new EraUnit(KamakazeUnit, 1),
            new EraUnit(GoblinUnit, 1),
            new EraUnit(RandomMoverUnit, 1),
            new EraUnit(SettlerUnit, 1),
            new EraUnit(new TurretUnit(), 1),
            new EraUnit(NinjaUnit, 1),
            new EraUnit(CatapultUnit, 1),

            new EraUnit(TankUnit, 2),
            new EraUnit(new SummonerUnit(), 2),
            new EraUnit(HealerUnit, 2),
            new EraUnit(MissionaryUnit, 2),
            new EraUnit(FireballThrowerUnit, 2),
            new EraUnit(SpyUnit, 2),
            new EraUnit(SabotagerUnit, 2),

            new EraUnit(BarracksUnit, 3),
            new EraUnit(CityBuilderUnit, 3),
            new EraUnit(SniperUnit, 3),
            new EraUnit(VampireUnit, 3),
            new EraUnit(TeleporterUnit, 3),
            new EraUnit(AssassainUnit, 3),
            new EraUnit(GorillaWarfareUnit, 3),

            new EraUnit(FlareUnit, 4),
            new EraUnit(CounterMissileUnit, 4),
            new EraUnit(UnitMissileUnit, 4),
            new EraUnit(BallisticMissileUnit, 4),
            new EraUnit(CounterCounterMissileUnit, 4),

            new EraUnit(MissileUnit, 5),
        ]
    }
}
