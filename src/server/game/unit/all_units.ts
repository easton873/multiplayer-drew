import { ArcherUnit } from "./archer.js";
import { GameUnit } from "./game_unit.js";
import { GoblinUnit } from "./goblin.js";
import { HealerUnit } from "./healer.js";
import { KamakazeUnit } from "./kamakaze.js";
import { LUMBER_JACK_GAME_UNIT, MERCHANT_GAME_UNIT, MINER_GAME_UNIT } from "./resource_unit.js";
import { SoldierUnit } from "./soldier.js";
import { SummonerUnit } from "./summoner.js";
import { TankUnit } from "./tank.js";

export const ALL_UNITS : GameUnit[] = [
    new SoldierUnit(),
    MERCHANT_GAME_UNIT,
    LUMBER_JACK_GAME_UNIT,
    new ArcherUnit(),
    new KamakazeUnit(),
    new GoblinUnit(),
    MINER_GAME_UNIT,
    new TankUnit(),
    new SummonerUnit(),
    new HealerUnit(),
    // lure
    // stationary turret
];

function buildUnitMap() : Map<string, GameUnit> {
    let result = new Map<string, GameUnit>();
    ALL_UNITS.forEach((unit : GameUnit) => {
        result.set(unit.getName(), unit);
    });
    return result
}

export const UNIT_MAP : Map<string, GameUnit> = buildUnitMap();