import { GameUnit } from "./game_unit.js";
import { GorillaWarfareUnit } from "./gorilla_warfare.js";
import { HealerUnit } from "./healer.js";
import { KamakazeUnit, MissileUnit } from "./kamakaze.js";
import { GoblinUnit, QuickAttackerUnit, RandomMoverUnit, SabotagerUnit, SoldierUnit, TankUnit } from "./melee_unit.js";
import { ArcherUnit, FireballThrowerUnit } from "./ranged_unit.js";
import { LUMBER_JACK_GAME_UNIT, MERCHANT_GAME_UNIT, MINER_GAME_UNIT } from "./resource_unit.js";
import { ScarecrowUnit } from "./scarecrow.js";
import { SummonerUnit } from "./summoner.js";
import { TurretUnit } from "./turret.js";

export const ALL_RESOURCE_UNITS : GameUnit[] = [
    MERCHANT_GAME_UNIT,

    LUMBER_JACK_GAME_UNIT,
    
    MINER_GAME_UNIT,
];

export const ALL_MILITARY_UNITS : GameUnit[] = [
    
    SoldierUnit,
    new ScarecrowUnit(),
    
    QuickAttackerUnit,
    ArcherUnit,
    KamakazeUnit,
    GoblinUnit,
    RandomMoverUnit,
    new TurretUnit(),
    
    TankUnit,
    new SummonerUnit(),
    new HealerUnit(),
    FireballThrowerUnit,
    SabotagerUnit,
    GorillaWarfareUnit,
    MissileUnit,
    // lure
    // assassain
    // wizard (chain lightning)
    // heavey hitter: hit everything on target spot
    // area turret
    // longbowman
    // regen soldier
    // teleporter
];

export const ALL_UNITS : GameUnit[] = ALL_RESOURCE_UNITS.concat(ALL_MILITARY_UNITS);

function buildUnitMap() : Map<string, GameUnit> {
    let result = new Map<string, GameUnit>();
    ALL_UNITS.forEach((unit : GameUnit) => {
        result.set(unit.getName(), unit);
    });
    return result
}

export const UNIT_MAP : Map<string, GameUnit> = buildUnitMap();