import { UnitCreationData } from '../../shared/types.js';
import { GameUnit } from "./unit/game_unit.js";
import { HealerUnit } from "./unit/healer.js";
import { GoblinUnit, QuickAttackerUnit, RandomMoverUnit, SabotagerUnit, ScountUnit, SoldierUnit } from "./unit/melee_unit.js";
import { ArcherUnit, FireballThrowerUnit, SniperUnit } from "./unit/ranged_unit.js";
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
} from './unit/resource_unit.js';
import { TankUnit } from "./unit/tank.js";
import { KamakazeUnit } from "./unit/kamakaze.js";
import { SettlerUnit, CityBuilderUnit } from "./unit/settler.js";
import { TurretUnit } from "./unit/turret.js";
import { NinjaUnit, SpyUnit, AssassainUnit } from "./unit/combat/stealth.js";
import { CatapultUnit } from "./unit/catapult.js";
import { SummonerUnit } from "./unit/summoner.js";
import { MissionaryUnit } from "./unit/combat/missionary.js";
import { BarracksUnit } from "./unit/barracks.js";
import { VampireUnit } from "./unit/combat/vampire.js";
import { TeleporterUnit } from "./unit/teleporter.js";
import { GorillaWarfareUnit } from "./unit/gorilla_warfare.js";
import { FlareUnit } from "./unit/flare.js";
import { CounterMissileUnit, CounterCounterMissileUnit } from "./unit/counter_missile.js";
import { UnitMissileUnit, BallisticMissileUnit, MissileUnit } from "./unit/missile.js";

class EraUnit {
    constructor(private _gameUnit : GameUnit, private era : number){}
    public eraGoodEnough(currEra : number) : boolean {
        return currEra >= this.era;
    }
    get gameUnit() : GameUnit {
        return this._gameUnit;
    }
}

export abstract class Faction {
    abstract getMilitaryUnits() : EraUnit[];
    abstract getResourceUnits() : EraUnit[];
    getMilitaryUnitCreationData(eraNumber : number) : UnitCreationData[] {
        return this.getUnitsHelper(this.getMilitaryUnits(), eraNumber);
    }
    getResourceUnitCreationData(eraNumber : number) : UnitCreationData[] {
        return this.getUnitsHelper(this.getResourceUnits(), eraNumber);
    }
    getUnitsForEra(units : EraUnit[], eraNumber: number) : GameUnit[] {
        return units.filter((unit : EraUnit) => unit.eraGoodEnough(eraNumber)).map((eraUnit : EraUnit) => eraUnit.gameUnit);
    }
    getUnitsHelper(units : EraUnit[], eraNumber : number) : UnitCreationData[] {
        return this.getUnitsForEra(units, eraNumber).map((gu : GameUnit) => gu.getUnitCreationInfo().getUnitCreationData());
    }
    getAllGameUnits(eraNumber : number): GameUnit[] {
        let resource : GameUnit[] = this.getUnitsForEra(this.getResourceUnits(), eraNumber);
        return resource.concat(this.getUnitsForEra(this.getMilitaryUnits(), eraNumber));
    }
}

export class Humans extends Faction {
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
