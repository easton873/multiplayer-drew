import { Player } from "../../player.js";
import { Pos } from "../../pos.js";
import { Resources } from "../../resources.js";
import { GameUnit } from "../game_unit.js";
import { RangedAreaDamage } from "../ranged_unit.js";
import { Unit } from "../unit.js";

class Monk extends RangedAreaDamage {
    doDamage(unit: Unit, damage: number): void {
        unit.takeMagicDamage(15);
        unit.takePhysicalDamage(5);
    }
}

class monkUnit extends GameUnit {
    construct(player: Player, pos: Pos): Unit {
        return new Monk(player, this.getName(), pos, 75, 20, 30, "#492f02", 0, 25, 4);
    }
}

export const MonkUnit: GameUnit = new monkUnit("Monk", new Resources( { wood: 5, stone: 5, artifact: 3 } ), "Does a 15 magic damage and 5 physical damage to anyone foolish enough to be in its attack area of its target and those adjacent");