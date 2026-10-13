import { Random } from "../../math.js";
import { Pos } from "../../pos.js";
import { Player } from "../../player.js";
import { Melee, MeleeUnit } from "../melee_unit.js";
import { Ranged } from "../ranged_unit.js";
import { GameUnit } from "../game_unit.js";
import { Unit } from "../unit.js";
import { Resources } from "../../resources.js";

class RandomMelee extends Melee {
    constructor(player : Player, name : string, pos : Pos, color : string, min: number, max: number) {
        super(player, name, pos, Random.fromRange(min, max), Random.fromRange(min, max), Random.fromRange(min, max), color, Random.fromRange(min, max));
    }
}

class randomMeleeUnit extends GameUnit {
    constructor(name : string, cost : Resources, blurb : string, private color: string, private min: number, private max: number) {
        super(name, cost, blurb);
    }
    construct(player: Player, pos: Pos): Unit {
        return new RandomMelee(player, this.getName(), pos, this.color, this.min, this.max)
    }
}

class RandomRanged extends Ranged {
    constructor(player : Player, name : string, pos : Pos, color : string, min: number, max: number) {
        super(player, name, pos, Random.fromRange(min, max), Random.fromRange(min, max), Random.fromRange(min, max), color, Random.fromRange(min, max), Random.fromRange(min, max))
    }
}

class randomRangedUnit extends GameUnit {
    constructor(name : string, cost : Resources, blurb : string, private color: string, private min: number, private max: number) {
        super(name, cost, blurb);
    }
    construct(player: Player, pos: Pos): Unit {
        return new RandomRanged(player, this.getName(), pos, this.color, this.min, this.max)
    }
}

export const RandomMeleeUnit: randomMeleeUnit = new randomMeleeUnit("Random Melee", new Resources({ randomonium: 25 }), "A random melee unit with random stats between 1 and 10", "#000000", 1, 10);
export const ImprovedRandomMeleeUnit: randomMeleeUnit = new randomMeleeUnit("Improved Random Melee", new Resources({ randomonium: 100 }), "A random melee unit with random stats between 1 and 100", "#555555", 1, 100);
export const OpRandomMeleeUnit: randomMeleeUnit = new randomMeleeUnit("OP Random Melee", new Resources({ randomonium: 5000 }), "A random melee unit with random stats between 1 and 500", "#aaaaaa", 1, 500);

export const RandomRangedUnit: randomRangedUnit = new randomRangedUnit("Random Ranged", new Resources({ randomonium: 250 }), "A random ranged unit with random stats between 1 and 25", "#19174d", 1, 25);
export const CoolRandomRanged: randomRangedUnit = new randomRangedUnit("Cool Random Ranged", new Resources({ randomonium: 7500 }), "A random ranged unit with random stats between 1 and 500", "#312d92", 1, 500);