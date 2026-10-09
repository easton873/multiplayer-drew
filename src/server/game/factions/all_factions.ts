import { Faction } from "./faction.js";
import { HUMAN_FACTION_NAME, Humans } from "./humans.js";

export const FACTION_FACTORIES : Record<string, () => Faction> = {
    [HUMAN_FACTION_NAME]: () => new Humans(),
};

export const DEFAULT_FACTION_NAME : string = HUMAN_FACTION_NAME;

// What the frontend needs for the dropdown
export const FACTION_NAMES : string[] = Object.keys(FACTION_FACTORIES);

export function createFaction(name : string) : Faction {
    const factory = FACTION_FACTORIES[name];
    if (!factory) {
        console.log("unknown faction " + name);
        return new Humans();
    }
    return factory();
}
