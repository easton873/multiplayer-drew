import { CHOOSE_FOR_ME_FACTION } from "../../../shared/bulider.js";
import { Castle, CASTLE_FACTION_NAME } from "./castle.js";
import { Faction } from "./faction.js";
import { Heckspawn, HECKSPAWN_FACTION_NAME } from "./heckspawn.js";
import { HUMAN_FACTION_NAME, Humans } from "./humans.js";
import { Random, RANDOM_FACTION_NAME } from "./random.js";
import { Random as Rand } from "../math.js";

export const CHOOSE_FOR_ME_NAME : string = CHOOSE_FOR_ME_FACTION;
export const DEFAULT_FACTION_NAME : string = CHOOSE_FOR_ME_NAME;

// Every real faction, i.e. everything except the lobby-only "Choose For Me" entry
function realFactories() : (() => Faction)[] {
    return Object.entries(FACTION_FACTORIES)
        .filter(([name]) => name !== CHOOSE_FOR_ME_NAME)
        .map(([, factory]) => factory);
}

function randomFaction(): Faction {
    return Rand.fromList(realFactories())();
}

export const FACTION_FACTORIES : Record<string, () => Faction> = {
    [CHOOSE_FOR_ME_NAME]: () => randomFaction(),
    [HUMAN_FACTION_NAME]: () => new Humans(),
    [CASTLE_FACTION_NAME]: () => new Castle(),
    [HECKSPAWN_FACTION_NAME]: () => new Heckspawn,
    [RANDOM_FACTION_NAME]: () => new Random(),
};

// Everything a player can select in the lobby
export const CLIENT_FACTION_CHOICES : string[] = Object.keys(FACTION_FACTORIES);

// The real factions, which is what load data and unit images are built from
export const FACTION_NAMES : string[] = CLIENT_FACTION_CHOICES.filter(name => name !== CHOOSE_FOR_ME_NAME);

export function createFaction(name : string) : Faction {
    const factory = FACTION_FACTORIES[name];
    if (!factory) {
        console.log("unknown faction " + name);
        return randomFaction();
    }
    return factory();
}
