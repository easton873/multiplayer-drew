import { GOLD_RESOURCE } from "../../../shared/resource_types.js";
import { EraInfo } from "../era.js";
import { Resources } from "../resources.js";
import { HadesUnit } from "../unit/heckspawn/hades.js";
import { EraUnit, Faction } from "./faction.js";

export const HECKSPAWN_FACTION_NAME: string = "Heckspawn"

export class Heckspawn extends Faction {
    getEraInfo(): EraInfo[] {
        return [
            new EraInfo("The Spark", new Resources(), new Resources({ gold: 1 }), 30, 10, 25, 25, [ GOLD_RESOURCE ]),
        ];
    }
    getMilitaryUnits(): EraUnit[] {
        return [
            new EraUnit(HadesUnit, 0),
        ];
    }
    getResourceUnits(): EraUnit[] {
        return [];
    }
    getName(): string {
        return HECKSPAWN_FACTION_NAME
    }

}