import { Player } from "../../../game/player.js";
import { Pos } from "../../../game/pos.js";
import { Board } from "../../../game/board.js";
import { Resources } from "../../resources.js";
import { Melee, MeleeUnit } from "../melee_unit.js";
import { Unit } from "../unit.js";
import { GameUnit } from "../game_unit.js";

class Angel extends Melee {
    constructor(player : Player, name : string, pos : Pos) {
        super(player, name, pos, 250, 2, 15, "#fff3b0", 0);
    }
    inRangeMove(board: Board): void {
       this.doDamageToPos(
        board, this.target.pos.clone(),
        (unit : Unit) => unit.team != this.team, 
        0
        );
    }

    doDamage(unit: Unit, damage: number): void {
        unit.takePhysicalDamage(25);
        unit.takeMagicDamage(25);
    }
    
    getFireDamageMultiplier(): number {
        return .25;
    }

    getMagicDamageMultiplier(): number {
        return .25;
    }

    getPhysicalDamageMultiplier(): number {
        return .5;
    }
}

class angelUnit extends GameUnit {
    construct(player: Player, pos: Pos): Unit {
        return new Angel(player, this.getName(), pos);
    }
}

export const AngelUnit : angelUnit = new angelUnit("Angel", new Resources({ gold: 1000, wood: 50, stone: 50, artifact: 10, diamond: 10 }), "");