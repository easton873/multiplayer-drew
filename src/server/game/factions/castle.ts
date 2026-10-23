import { ARTIFACT_RESOURCE, DIAMOND_RESOURCE, GOLD_RESOURCE, IRON_RESOURCE, STONE_RESOURCE, WOOD_RESOURCE } from "../../../shared/resource_types.js";
import { EraInfo } from "../era.js";
import { Resources } from "../resources.js";
import { AngelUnit } from "../unit/castle/angel.js";
import { PaladinUnit } from "../unit/castle/paladin.js";
import { MissionaryUnit } from "../unit/shared/missionary.js";
import { GameResourceUnit } from "../unit/resource_unit.js";
import { EraUnit, Faction } from "./faction.js";
import { MonkUnit } from "../unit/castle/monk.js";

export const CASTLE_FACTION_NAME = "Castle";

export class Castle extends Faction {
    getEraInfo(): EraInfo[] {
        return [
            new EraInfo("The Beginning", new Resources(), new Resources({gold: 1}), 30, 10, 25, 25, [GOLD_RESOURCE]),
            new EraInfo("The Small Village", new Resources({gold: 400}), new Resources({gold: 20, wood: 1, stone: 1}), 300, 25, 50, 49, [GOLD_RESOURCE, WOOD_RESOURCE, STONE_RESOURCE]),
            new EraInfo("Faith and Steel", new Resources({gold: 1000, wood: 25, stone: 25}), new Resources({gold: 1}), 30, 100, 100, 100, [GOLD_RESOURCE, WOOD_RESOURCE, STONE_RESOURCE, IRON_RESOURCE, ARTIFACT_RESOURCE]),
            new EraInfo("The New Empire", new Resources({gold: 7500, wood: 100, stone: 100, iron: 20}), new Resources({gold: 1}), 30, 100, 200, 100, [GOLD_RESOURCE, WOOD_RESOURCE, STONE_RESOURCE, DIAMOND_RESOURCE])
        ];
    }
    getMilitaryUnits(): EraUnit[] {
        return [
            new EraUnit(new MissionaryUnit(new Resources({ wood: 10, stone: 15, artifact: 2})), 2),
            new EraUnit(MonkUnit, 2),
            new EraUnit(PaladinUnit, 0),
            new EraUnit(AngelUnit, 0),
        ];
    }
    getResourceUnits(): EraUnit[] {
        return [
            new EraUnit(new GameResourceUnit("Merchant💰", new Resources({gold: 25}), 10, 10, new Resources({gold: 1}), "#d13535", "makes 3 gold a second"), 0),
            new EraUnit(new GameResourceUnit("Lumberjack🪵", new Resources({gold: 100}), 30, 150, new Resources({wood: 1}), "#125c21", "makes 1 wood every 5 seconds"), 1),
            new EraUnit(new GameResourceUnit("Miner🪨", new Resources({gold: 100}), 30, 150, new Resources({stone: 1}), "#383838", "makes 1 stone every 5 seconds"), 1),
            new EraUnit(new GameResourceUnit("Banker💰", new Resources({gold: 1000, wood: 100, stone: 100}), 100, 1, new Resources({gold: 1}), "#a4a4a4", "makes 30 gold a second"), 2),
            new EraUnit(new GameResourceUnit("IronMiner🔩", new Resources({gold: 2500, wood: 300, stone: 300}), 50, 600, new Resources({iron: 1}), "#b9c122", "mines iron once every 20 seconds"), 2),
            new EraUnit(new GameResourceUnit("Artifact Merchant🏺", new Resources({gold: 5000, wood: 10, stone: 10}), 100, 1800, new Resources({artifact: 1}), "#a4a4a4", "gathers an artifact every minute"), 2),
            new EraUnit(new GameResourceUnit("DiamondMiner💎", new Resources({gold: 10000, wood: 500, stone: 500}), 100, 1800, new Resources({diamond: 1}), "#f3eded", "mines diamonds once a minute"), 3),
        ]
    }
    getName(): string {
        return "Castle";
    }
    generalBlurb(): string {
        return "The caslte stands tall, with units of a variety of strengths and weaknesses. The caslte faction derives it's strength from honorable combat. Casle units are cheap when weak and expensive when strong. This faction stands at odds with the Heckspawn faction. This is an S tier faction for both beginner and veteran players";
    }
}