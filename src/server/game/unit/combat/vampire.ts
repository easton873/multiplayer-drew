import { Resources } from "../../../game/resources.js";
import { Player } from "../../player.js";
import { Pos } from "../../pos.js";
import { Melee, MeleeUnit } from "../melee_unit.js";
import { clampHealth, Unit } from "../unit.js";

class Vampire extends Melee {
    constructor(player : Player, name : string, pos : Pos, hp : number, color : string, moveSpeed : number, attackSpeed : number, damage : number) {
        super(player, name, pos, hp, moveSpeed, attackSpeed, color, damage);
    }

    doDamage(unit: Unit, damage: number): void {
        let ogHp = unit.hp;
        super.doDamage(unit, damage);
        let afterHp = unit.hp;
        this.hp += ogHp - afterHp;
        clampHealth(this);
    }
}

class vampireUnit extends MeleeUnit {
    construct(player: Player, pos: Pos): Unit {
        return new Vampire(player, this.name, pos, this.hp, this.color, this.moveSpeed, this.attackSpeed, this.damage);
    }
}

export const VampireUnit : vampireUnit = new vampireUnit("Vampire", new Resources(400, 0, 25), 3, 6, 3, 20, "#111111", "Sucks life from its victims to heal itself as it fights");