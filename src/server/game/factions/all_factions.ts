import { Castle, CASTLE_FACTION_NAME } from "./castle.js";
import { Faction } from "./faction.js";
import { HUMAN_FACTION_NAME, Humans } from "./humans.js";
import { Random, RANDOM_FACTION_NAME } from "./random.js";

export const FACTION_FACTORIES : Record<string, () => Faction> = {
    [HUMAN_FACTION_NAME]: () => new Humans(),
    [CASTLE_FACTION_NAME]: () => new Castle(),
    [RANDOM_FACTION_NAME]: () => new Random(),
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
