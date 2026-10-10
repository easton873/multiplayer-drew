import { LoadData } from "../../../shared/bulider.js";
import { createFaction, FACTION_NAMES } from "../factions/all_factions.js";

export function loadData() : LoadData {
    return {
        factions: FACTION_NAMES.map((name : string) => createFaction(name).getLoadData()),
    };
}
