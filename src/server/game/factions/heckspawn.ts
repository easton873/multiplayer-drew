import { ARTIFACT_RESOURCE, ASH_RESOURCE, GOLD_RESOURCE, HECKSTONE_RESOURCE, MAGMA_RESOURCE } from "../../../shared/resource_types.js";
import { EraInfo } from "../era.js";
import { Resources } from "../resources.js";
import { HadesUnit } from "../unit/heckspawn/hades.js";
import { GameResourceUnit } from "../unit/resource_unit.js";
import { MissionaryUnit } from "../unit/shared/missionary.js";
import { VoldemortUnit } from "../unit/wizard/voldemort.js";
import { EraUnit, Faction } from "./faction.js";

export const HECKSPAWN_FACTION_NAME: string = "Heckspawn"

export class Heckspawn extends Faction {
    getEraInfo(): EraInfo[] {
        return [
            new EraInfo("The Spark", new Resources(), new Resources({ gold: 1 }), 30, 10, 25, 25, [ GOLD_RESOURCE ]),
            new EraInfo("The Fire", new Resources(), new Resources({ gold: 1 }), 30, 10, 50, 25, [ GOLD_RESOURCE, ASH_RESOURCE, HECKSTONE_RESOURCE ]),
            new EraInfo("The Inferno", new Resources(), new Resources({ gold: 1 }), 30, 10, 100, 25, [ GOLD_RESOURCE, ASH_RESOURCE, HECKSTONE_RESOURCE, MAGMA_RESOURCE, ARTIFACT_RESOURCE ]),
        ];
    }
    getMilitaryUnits(): EraUnit[] {
        return [
            new EraUnit(new MissionaryUnit(new Resources({ gold: 100, ash: 10, artifact: 2})), 0),
            new EraUnit(HadesUnit, 0),
            new EraUnit(VoldemortUnit, 0),
        ];
    }
    getResourceUnits(): EraUnit[] {
        return [
            new EraUnit(new GameResourceUnit("Merchant💰", new Resources({gold: 25}), 10, 10, new Resources({gold: 1}), "#d13535", "makes 3 gold a second"), 0),
            new EraUnit(new GameResourceUnit("Burner💨", new Resources({gold: 100}), 30, 150, new Resources({ash: 1}), "#3d3e3d", "makes 1 ash every 5 seconds"), 1),
            new EraUnit(new GameResourceUnit("Fire Mason🔥", new Resources({gold: 100}), 30, 150, new Resources({heckstone: 1}), "#e56419", "makes 1 heckstone every 5 seconds"), 1),
            new EraUnit(new GameResourceUnit("Artifact Merchant🏺", new Resources({gold: 5000, ash: 10, heckstone: 10}), 100, 1800, new Resources({artifact: 1}), "#a4a4a4", "gathers an artifact every minute"), 2),
        ];
    }
    getName(): string {
        return HECKSPAWN_FACTION_NAME
    }
    generalBlurb(): string {
        return "From the depths of the underworld crawl the heckspawn. They are known for being very firey, most of them dealing with only fire damage, though magic is not unknown to them. Burn your enemies with a plethora of evil units who will stop at nothing to burn the castle faction to the ground. Great for beginner and veteran players";
    }
}