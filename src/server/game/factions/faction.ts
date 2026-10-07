import { UnitCreationData } from '../../../shared/types.js';
import { Era, EraInfo } from '../era.js';
import { GameUnit } from "../unit/game_unit.js";

export class EraUnit {
    constructor(private _gameUnit : GameUnit, private era : number){}
    public eraGoodEnough(currEra : number) : boolean {
        return currEra >= this.era;
    }
    get gameUnit() : GameUnit {
        return this._gameUnit;
    }
}

export abstract class Faction {
    private _era : Era
    constructor(){
        this._era = new Era(this.getEraInfo());
    }

    get era() : Era {
        return this._era;
    }

    abstract getEraInfo() : EraInfo[];
    abstract getMilitaryUnits() : EraUnit[];
    abstract getResourceUnits() : EraUnit[];
    getMilitaryUnitCreationData() : UnitCreationData[] {
        return this.getUnitsHelper(this.getMilitaryUnits());
    }
    getResourceUnitCreationData() : UnitCreationData[] {
        return this.getUnitsHelper(this.getResourceUnits());
    }
    getUnitsForEra(units : EraUnit[]) : GameUnit[] {
        return units.filter((unit : EraUnit) => unit.eraGoodEnough(this.era.level)).map((eraUnit : EraUnit) => eraUnit.gameUnit);
    }
    getUnitsHelper(units : EraUnit[]) : UnitCreationData[] {
        return this.getUnitsForEra(units).map((gu : GameUnit) => gu.getUnitCreationInfo().getUnitCreationData());
    }
    getAllGameUnits(): GameUnit[] {
        let resource : GameUnit[] = this.getUnitsForEra(this.getResourceUnits());
        return resource.concat(this.getUnitsForEra(this.getMilitaryUnits()));
    }
}
