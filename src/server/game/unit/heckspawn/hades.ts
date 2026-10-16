import { Resources } from "../../resources.js";
import { Board } from "../../board.js";
import { GameUnit } from "../game_unit.js";
import { Ranged } from "../ranged_unit.js";
import { Unit } from "../unit.js";
import { Counter } from "../../move/counter.js";
import { Player } from "../../player.js";
import { Pos } from "../../pos.js";

class Hades extends Ranged {
    private radius: number = 25;
    private healCounter: Counter = new Counter(2);
    private fireAuraCounter: Counter = new Counter(6);
    doAcutalMove(board: Board): void {
        if (this.healCounter.tick()) {
            this.heal(2);
        }
        if (this.fireAuraCounter.tick) {
            this.applyFireAura(board);
        }
        super.doAcutalMove(board);
    }
    applyFireAura(board: Board) {
        this.applyToEntities(board, 
            (unit: Unit): boolean => unit.team != this.team && this.inRangeForDistance(unit, this.radius), 
            (unit: Unit) => {
                unit.takeFireDamage(1);
            }
        );
    }
    doDamage(unit: Unit, damage: number): void {
        unit.takeForcefulDamage(15);
        unit.takeMagicDamage(15);
    }

    getFireDamageMultiplier(): number {
        return 0;
    }

    getMagicDamageMultiplier(): number {
        return 0.5;
    }

    getPhysicalDamageMultiplier(): number {
        return 0.5;
    }
}

class hadesUnit extends GameUnit {
    construct(player: Player, pos: Pos): Unit {
        return new Hades(player, this.getName(), pos, 150, 6, 6, "#f40b0b", 0, 81);
    }
}

export const HadesUnit: GameUnit = new hadesUnit("Hades", new Resources(), "The lord of the underworld doesn't go down easily");