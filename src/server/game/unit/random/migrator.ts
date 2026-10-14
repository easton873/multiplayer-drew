import { Random } from "../../math.js";
import { Board } from "../../board.js";
import { Pos } from "../../pos.js";
import { randomPos } from "../combat/helper.js";
import { Unit } from "../unit.js";
import { GameUnit } from "../game_unit.js";
import { Player } from "../../player.js";
import { Resources } from "../../resources.js";
import { Spawner } from "../barracks.js";
import { RandomMeleeUnit, RandomRangedUnit } from "./melee_ranged.js";
import { Counter } from "../../move/counter.js";
import { YeeterGameUnit } from "./yeeter.js";
import { RandomMoverUnit } from "./random_mover.js";

class Migrator extends Spawner {
    private destination: Pos = new Pos(0, 0);
    private destinationSet: boolean = false;
    private spawnCounter = new Counter(90);
    private range = 25;
    private damage = 5;
    constructor(player : Player, name : string, pos : Pos) {
        super(player, name, pos, 100, 7, "#18b47d", null);
    }
    doMove(board: Board) {
        if (!this.destinationSet) {
            this.destination = randomPos(board);
            this.destinationSet = true;
        }
        for (let i = 0; i < board.entities.length; ++i) {
            let unit: Unit = board.entities[i];
            if (unit.team != this.team && this.inRangeForDistance(unit, this.range)) {
                this.doDamage(unit, this.damage);
            }
        }
        if (this.hasArrived()) {
            super.doMove(board);
            return;
        }
        this.pos.moveTowards(this.destination);
    }

    tick(): boolean {
        return this.hasArrived() ? this.spawnCounter.tick() : super.tick();
    }

    getPhysicalDamageMultiplier(): number {
        return this.hasArrived() ? .1 : 1;
    }

    getBuildingDamageMultiplier(): number {
        return this.hasArrived() ? 1 : .1;
    }

    hasArrived(): boolean {
        return this.destinationSet && this.pos.equals(this.destination);
    }

    getUnitToSpawn(): GameUnit {
        return Random.fromList([
            YeeterGameUnit,
            RandomMoverUnit,
            RandomMeleeUnit,
            RandomRangedUnit,
        ])
    }
}

class migratorUnit extends GameUnit {
    construct(player: Player, pos: Pos): Unit {
        return new Migrator(player, this.getName(), pos);
    }
}

export const MigratorUnit: GameUnit = new migratorUnit("Migrator", new Resources({ randomonium: 1000 }), "This guy will migrate and if he should succeed, he'll start spawning stuff randomly (typical)");