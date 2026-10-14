import { GOLD_RESOURCE, RANDOMONIUM_RESROUCE, STONE_RESOURCE, WOOD_RESOURCE } from "../../../shared/resource_types.js";
import { EraInfo } from "../era.js";
import { Resources } from "../resources.js";
import { GameRandomResourceUnit } from "../unit/random/resource.js";
import { DefenderUnit, SuperDefenderUnit, WeakDefenderUnit } from "../unit/random/defender.js";
import { YeeterGameUnit } from "../unit/random/yeeter.js";
import { GameResourceUnit } from "../unit/resource_unit.js";
import { EraUnit, Faction } from "./faction.js";
import { HugeRandomRanged, BiggerRandomMeleeUnit, BiggestRandomMeleeUnit, RandomMeleeUnit, RandomRangedUnit } from "../unit/random/melee_ranged.js";
import { MigratorUnit } from "../unit/random/migrator.js";
import { RandomMoverUnit, JackedRandomMoverUnit } from "../unit/random/random_mover.js";

export const RANDOM_FACTION_NAME = "Random";

export class Random extends Faction {
    getEraInfo(): EraInfo[] {
        return [
            new EraInfo("Lit No Cap", new Resources(), new Resources({randomonium: 1}), 30, 10, 30, 100, [RANDOMONIUM_RESROUCE]),
            new EraInfo("Four Score Era", new Resources({randomonium: 100}), new Resources({randomonium: 4}), 30, 22, 77, 144, [RANDOMONIUM_RESROUCE, GOLD_RESOURCE, WOOD_RESOURCE, STONE_RESOURCE]),
            new EraInfo("Top of the Morning Era", new Resources({randomonium: 1234, gold: 181, wood: 1, stone: 276}), new Resources({randomonium: 21}), 30, 30, 222, 400, [RANDOMONIUM_RESROUCE, GOLD_RESOURCE, WOOD_RESOURCE, STONE_RESOURCE]),
        ]
    }
    getMilitaryUnits(): EraUnit[] {
        return [
            new EraUnit(YeeterGameUnit, 0),
            new EraUnit(WeakDefenderUnit, 0),
            new EraUnit(RandomMeleeUnit, 0),
            new EraUnit(BiggerRandomMeleeUnit, 0),
            new EraUnit(BiggestRandomMeleeUnit, 0),
            new EraUnit(DefenderUnit, 1),
            new EraUnit(RandomMoverUnit, 1),
            new EraUnit(RandomRangedUnit, 1),
            new EraUnit(HugeRandomRanged, 1),
            new EraUnit(SuperDefenderUnit, 2),
            new EraUnit(JackedRandomMoverUnit, 2),
            new EraUnit(MigratorUnit, 2),
        ];
    }
    getResourceUnits(): EraUnit[] {
        return [
            new EraUnit(new GameResourceUnit("Randomunium Factory", new Resources({randomonium: 10}), 10, 30, new Resources({randomonium: 1}), "#12c3eb", "Produces 1 randomonium a second"), 0),
            new EraUnit(new GameRandomResourceUnit("Rando Worker", new Resources({randomonium: 10}), 10, 30, [GOLD_RESOURCE, WOOD_RESOURCE, STONE_RESOURCE], 1, "#a1419b", "randomly produces 1 gold, wood, or stone a second"), 0),
        ]
    }
    getName(): string {
        return RANDOM_FACTION_NAME;
    }
}