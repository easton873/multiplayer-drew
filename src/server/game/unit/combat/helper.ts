import { Unit } from "../unit.js";

export function clampHealth(unit : Unit) {
    if (unit.hp > unit.totalHP) {
        unit.hp = unit.totalHP;
    }
}

export function healUnit(unit : Unit, healAmount : number) {
    unit.hp += healAmount
    clampHealth(unit);
}