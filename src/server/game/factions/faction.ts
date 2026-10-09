import { FactionData, UnitCreationData } from '../../../shared/types.js';
import { FactionLoadData } from '../../../shared/bulider.js';
import { Era, EraInfo } from '../era.js';
import { Resources } from '../resources.js';
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

    attemptUpgradeEra(resources : Resources) : boolean {
        return this.era.advanceToNextEra(resources);
    }

    abstract getEraInfo() : EraInfo[];
    abstract getMilitaryUnits() : EraUnit[];
    abstract getResourceUnits() : EraUnit[];
    abstract getName() : string;
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

    // units a faction owns that can't be bought directly, like ones that other units summon
    getExtraUnitNames() : string[] {
        return [];
    }

    // every unit this faction can have on the board, regardless of era
    getLoadData() : FactionLoadData {
        const bought = this.getResourceUnits().concat(this.getMilitaryUnits()).map((eraUnit : EraUnit) => eraUnit.gameUnit.getName());
        return {
            name: this.getName(),
            units: bought.concat(this.getExtraUnitNames()).map((name : string) => ({ name })),
        };
    }

    getFactionData() : FactionData {
        return {
            factionName: this.getName(),
            resourceUnits: this.getResourceUnitCreationData(),
            militaryUnits: this.getMilitaryUnitCreationData(),
            eraData: this.era.getEraData(),
        };
    }
}
