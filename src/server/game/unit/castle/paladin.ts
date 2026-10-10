import { Player } from "../../../game/player.js";
import { Pos } from "../../../game/pos.js";
import { Board } from "../../../game/board.js";
import { Resources } from "../../resources.js";
import { Melee } from "../melee_unit.js";
import { Unit } from "../unit.js";
import { Counter } from "../../../game/move/counter.js";
import { healUnit } from "../combat/helper.js";
import { GameUnit } from "../game_unit.js";

class Paladin extends Melee {
    private healCounter : Counter = new Counter(150);
    constructor(player : Player, pos : Pos, name: string) {
        super(player, name, pos, 125, 20, 20, "#d0a325", 10);
    }

    doAcutalMove(board: Board): void {
        if (this.healCounter.tick()) {
            this.applyToEntitesInArea(board, this.pos.clone(), 25, 
            (unit : Unit) => {
                if (unit.team == this.team) {
                    healUnit(unit, 10);
                }
            })
        }
        super.doAcutalMove(board);
    }

    doDamage(unit: Unit, damage: number): void {
        unit.takeMagicDamage(10);
        unit.takePhysicalDamage(10);
    }
}

class paladinUnit extends GameUnit {
    construct(player: Player, pos: Pos): Unit {
        return new Paladin(player, pos, this.getName());
    }
}

export const PaladinUnit = new paladinUnit("Paladin", new Resources({gold: 750, iron: 25}), "Does physical and magic damage and heals all allies in his radius");