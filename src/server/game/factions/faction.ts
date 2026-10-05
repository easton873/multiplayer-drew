import { UnitCreationData } from '../../../shared/types.js';
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
