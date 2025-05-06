import { ArcherUnit } from "./archer.js";
import { FireballThrower, FireballThrowerUnit } from "./fireball_thrower.js";
import { GameUnit } from "./game_unit.js";
import { GoblinUnit } from "./goblin.js";
import { HealerUnit } from "./healer.js";
import { KamakazeUnit } from "./kamakaze.js";
import { QuickAttacker, QuickAttackerUnit } from "./quick_attacker.js";
import { RandomMover, RandomMoverUnit } from "./random_mover.js";
import { LUMBER_JACK_GAME_UNIT, MERCHANT_GAME_UNIT, MINER_GAME_UNIT } from "./resource_unit.js";
import { Sabotager, SabotagerUnit } from "./sabotager.js";
import { ScarecrowUnit } from "./scarecrow.js";
import { SoldierUnit } from "./soldier.js";
import { SummonerUnit } from "./summoner.js";
import { TankUnit } from "./tank.js";
import { TurretUnit } from "./turret.js";

export const ALL_UNITS : GameUnit[] = [
    MERCHANT_GAME_UNIT,
    new SoldierUnit(),
    new ScarecrowUnit(),
    LUMBER_JACK_GAME_UNIT,
    new QuickAttackerUnit(),
    new ArcherUnit(),
    new KamakazeUnit(),
    new GoblinUnit(),
    new SabotagerUnit(),
    new RandomMoverUnit(),
    new TurretUnit(),
    MINER_GAME_UNIT,
    new TankUnit(),
    new SummonerUnit(),
    new HealerUnit(),
    new FireballThrowerUnit(),
    // lure
    // assassain
    // wizard (chain lightning)
    // heavey hitter: hit everything on target spot
    // area turret
    // longbowman
    // quick soldier
    // regen soldier
    // teleporter
];

function buildUnitMap() : Map<string, GameUnit> {
    let result = new Map<string, GameUnit>();
    ALL_UNITS.forEach((unit : GameUnit) => {
        result.set(unit.getName(), unit);
    });
    return result
}

export const UNIT_MAP : Map<string, GameUnit> = buildUnitMap();