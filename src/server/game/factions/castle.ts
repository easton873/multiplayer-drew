import { DIAMOND_RESOURCE, GOLD_RESOURCE, STONE_RESOURCE, WOOD_RESOURCE } from "../../../shared/resource_types.js";
import { EraInfo } from "../era.js";
import { Resources } from "../resources.js";
import { AngelUnit } from "../unit/castle/angel.js";
import { PaladinUnit } from "../unit/castle/paladin.js";
import { GameResourceUnit } from "../unit/resource_unit.js";
import { EraUnit, Faction } from "./faction.js";

export const CASTLE_FACTION_NAME = "Castle";

export class Castle extends Faction {
    getEraInfo(): EraInfo[] {
        return [
            new EraInfo("The Beginning", new Resources(), new Resources({gold: 1}), 30, 10, 25, 25, [GOLD_RESOURCE]),
            new EraInfo("The Small Village", new Resources({gold: 400}), new Resources({gold: 20, wood: 1, stone: 1}), 300, 25, 50, 49, [GOLD_RESOURCE, WOOD_RESOURCE, STONE_RESOURCE]),
            new EraInfo("The Steady Fortress", new Resources({gold: 1000, wood: 25, stone: 25}), new Resources({gold: 1}), 30, 100, 100, 100, [GOLD_RESOURCE, WOOD_RESOURCE, STONE_RESOURCE]),
            new EraInfo("The New Empire", new Resources({gold: 1000, wood: 25, stone: 25}), new Resources({gold: 1}), 30, 100, 100, 100, [GOLD_RESOURCE, WOOD_RESOURCE, STONE_RESOURCE, DIAMOND_RESOURCE])
        ];
    }
    getMilitaryUnits(): EraUnit[] {
        return [
            new EraUnit(PaladinUnit, 0),
            new EraUnit(AngelUnit, 0),
        ];
    }
    getResourceUnits(): EraUnit[] {
        return [
            new EraUnit(new GameResourceUnit("Merchant💰", new Resources({gold: 25}), 10, 10, new Resources({gold: 1}), "#d13535", "makes 3 gold a second"), 0),
            new EraUnit(new GameResourceUnit("Lumberjack🪵", new Resources({gold: 100}), 30, 30, new Resources({wood: 1}), "#125c21", "makes 1 wood a second"), 1),
            new EraUnit(new GameResourceUnit("Miner🪨", new Resources({gold: 100}), 30, 30, new Resources({stone: 1}), "#383838", "makes 1 stone a second"), 1),
            new EraUnit(new GameResourceUnit("Banker💰", new Resources({gold: 1000, wood: 100, stone: 100}), 100, 1, new Resources({gold: 1}), "#a4a4a4", "makes 30 gold a second"), 2),
            new EraUnit(new GameResourceUnit("IronMiner🔩", new Resources({gold: 2500, wood: 300, stone: 300}), 50, 100, new Resources({iron: 1}), "#b9c122", "mines iron once every 3.33 seconds"), 2),
            new EraUnit(new GameResourceUnit("DiamondMiner💎", new Resources({gold: 10000, wood: 500, stone: 500}), 100, 300, new Resources({diamond: 1}), "#f3eded", "mines diamonds once every 10 seconds"), 3),
        ]
    }
    getName(): string {
        return "Castle";
    }
}