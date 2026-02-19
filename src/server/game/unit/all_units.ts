import { CounterCounterMissileUnit, CounterMissileUnit } from "./counter_missile.js";
import { FlareUnit } from "./flare.js";
import { GameUnit } from "./game_unit.js";
import { GorillaWarfareUnit } from "./gorilla_warfare.js";
import { HealerUnit } from "./healer.js";
import { KamakazeUnit } from "./kamakaze.js";
import { GoblinUnit, QuickAttackerUnit, RandomMoverUnit, SabotagerUnit, ScountUnit, SoldierUnit, TankUnit } from "./melee_unit.js";
import { BallisticMissileUnit, MissileUnit, UnitMissileUnit } from "./missile.js";
import { ArcherUnit, FireballThrowerUnit } from "./ranged_unit.js";
import { CARPENTER_GAME_UNIT, LUMBER_JACK_GAME_UNIT, MERCHANT_GAME_UNIT, MINER_GAME_UNIT, MASON_GAME_UNIT, SCAVENGER_GAME_UNIT, SCULPTOR_GAME_UNIT, ARCHITECT_GAME_UNIT, BANKER_GAME_UNIT, ALCHEMIST_GAME_UNIT, ENGINEER_GAME_UNIT, DRUID_GAME_UNIT } from "./resource_unit.js";
import { ScarecrowUnit } from "./scarecrow.js";
import { SummonerUnit } from "./summoner.js";
import { TurretUnit } from "./turret.js";
import { LoadData, UnitLoadData } from "../../../shared/bulider.js";
import { BarracksUnit } from "./barracks.js";
import { CityBuilderUnit, SettlerUnit } from "./settler.js";
import { TeleporterUnit } from "./teleporter.js";

export const ALL_RESOURCE_UNITS : GameUnit[] = [
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
];

export const ALL_MILITARY_UNITS : GameUnit[] = [
    
    ScountUnit,
    SoldierUnit,
    new ScarecrowUnit(),
    ArcherUnit,
    
    QuickAttackerUnit,
    KamakazeUnit,
    GoblinUnit,
    RandomMoverUnit,
    SettlerUnit,
    new TurretUnit(),
    
    TankUnit,
    new SummonerUnit(),
    // new HealerUnit(),
    FireballThrowerUnit,
    SabotagerUnit,
    BarracksUnit,
    CityBuilderUnit,
    TeleporterUnit,
    GorillaWarfareUnit,
    
    FlareUnit,
    CounterMissileUnit,
    UnitMissileUnit,
    BallisticMissileUnit,
    CounterCounterMissileUnit,
    
    MissileUnit,

    // lure
    // assassain
    // wizard (chain lightning)
    // heavey hitter: hit everything on target spot
    // area turret
    // longbowman
    // regen soldier
    // teleporter
    // missionary (converts unit)
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

export function loadData() : LoadData {
    let units : UnitLoadData[] = [];
    ALL_UNITS.forEach((unit : GameUnit) => {
        units.push(
            {name: unit.getName()}
        );
    });
    return {
        units: units
    };
}