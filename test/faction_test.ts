import * as assert from "assert";
import { Board } from "../src/server/game/board.js";
import { Player } from "../src/server/game/player.js";
import { Pos } from "../src/server/game/pos.js";
import { Resources } from "../src/server/game/resources.js";
import { Era, EraInfo } from "../src/server/game/era.js";
import { EraUnit, Faction } from "../src/server/game/factions/faction.js";
import { createFaction, DEFAULT_FACTION_NAME, FACTION_FACTORIES, FACTION_NAMES } from "../src/server/game/factions/all_factions.js";
import { HUMAN_FACTION_NAME, Humans } from "../src/server/game/factions/humans.js";
import { SetupPlayer } from "../src/server/game/game_room.js";
import { loadData } from "../src/server/game/unit/all_units.js";
import { GOLD_RESOURCE } from "../src/shared/resource_types.js";

class OtherFaction extends Faction {
    getName(): string { return "Other"; }
    getEraInfo(): EraInfo[] {
        return [new EraInfo("only", new Resources(), new Resources(), 10, 7, 1, 0, [GOLD_RESOURCE])];
    }
    getMilitaryUnits(): EraUnit[] { return []; }
    getResourceUnits(): EraUnit[] { return []; }
}

const fakeClient = { id: "x", emit: () => true };

describe('Faction Test', () => {
    it('every factory builds a faction whose name is its key', () => {
        FACTION_NAMES.forEach((name : string) => {
            assert.strictEqual(createFaction(name).getName(), name);
        });
    });

    it('lists every factory name', () => {
        assert.deepStrictEqual(FACTION_NAMES, Object.keys(FACTION_FACTORIES));
        assert.ok(FACTION_NAMES.includes(DEFAULT_FACTION_NAME));
    });

    it('creates a fresh faction each time', () => {
        const a = createFaction(HUMAN_FACTION_NAME);
        const b = createFaction(HUMAN_FACTION_NAME);
        assert.notStrictEqual(a, b);
        a.attemptUpgradeEra(new Resources({ gold: 100000, wood: 100000, stone: 100000 }));
        assert.strictEqual(b.era.level, 0);
    });

    it('falls back to humans on an unknown faction', () => {
        assert.ok(createFaction("nope") instanceof Humans);
    });

    it('is sent to the frontend as load data with each faction\'s units', () => {
        const factions = loadData().factions;
        assert.deepStrictEqual(factions.map(f => f.name), FACTION_NAMES);
        factions.forEach((faction) => {
            assert.deepStrictEqual(faction, createFaction(faction.name).getLoadData());
        });
    });

    it('load data lists units regardless of era, plus extras', () => {
        const human = createFaction(HUMAN_FACTION_NAME);
        const names = human.getLoadData().units.map(u => u.name);
        human.getResourceUnits().concat(human.getMilitaryUnits()).forEach((eraUnit) => {
            assert.ok(names.includes(eraUnit.gameUnit.getName()), eraUnit.gameUnit.getName());
        });
        human.getExtraUnitNames().forEach((name) => assert.ok(names.includes(name), name));
    });

    it('unit data carries its owner\'s faction', () => {
        const player = new Player(0, new Pos(0, 0), new Board(10, 10), "0", "", "", undefined, new OtherFaction());
        assert.strictEqual(player.heart.getUnitData().faction, "Other");
    });

    it('players default to humans', () => {
        const player = new Player(0, new Pos(0, 0), new Board(10, 10), "0", "", "");
        assert.ok(player.faction instanceof Humans);
    });

    it('players use the faction they are given', () => {
        const player = new Player(0, new Pos(0, 0), new Board(10, 10), "0", "", "", undefined, new OtherFaction());
        assert.strictEqual(player.faction.getName(), "Other");
        assert.strictEqual(player.era.getUnitLimit(), 1);
    });

    it('faction data names the faction', () => {
        const data = createFaction(HUMAN_FACTION_NAME).getFactionData();
        assert.strictEqual(data.factionName, HUMAN_FACTION_NAME);
        assert.ok(data.militaryUnits.length > 0);
    });

    it('setup player builds a player with the chosen faction', () => {
        const setup = new SetupPlayer("1", "p", fakeClient, "#fff", true, HUMAN_FACTION_NAME);
        setup.setPos(new Pos(1, 1));
        const player = setup.createPlayer(new Board(10, 10));
        assert.strictEqual(player.faction.getName(), HUMAN_FACTION_NAME);
    });

    it('setup player falls back to the default for an unknown faction', () => {
        const setup = new SetupPlayer("1", "p", fakeClient, "#fff", true, "garbage");
        setup.setPos(new Pos(1, 1));
        const player = setup.createPlayer(new Board(10, 10));
        assert.strictEqual(player.faction.getName(), DEFAULT_FACTION_NAME);
    });

    it('join data includes the faction and defaults to humans', () => {
        const setup = new SetupPlayer("1", "p", fakeClient, "#fff", true);
        assert.strictEqual(setup.getJoinData().faction, DEFAULT_FACTION_NAME);
    });

    it('a player can change their faction from the waiting room', () => {
        const setup = new SetupPlayer("1", "p", fakeClient, "#fff", true);
        const data = setup.getJoinData();
        data.faction = HUMAN_FACTION_NAME;
        setup.update(data);
        assert.strictEqual(setup.getJoinData().faction, HUMAN_FACTION_NAME);
        data.faction = "garbage";
        setup.update(data);
        assert.strictEqual(setup.getJoinData().faction, HUMAN_FACTION_NAME);
    });
});
