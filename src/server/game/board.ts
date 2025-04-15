import { Unit, UnitObserver } from "./unit/unit.js";

export class Board implements UnitObserver {
    entities : Unit[] = [];
    constructor(private width : number,  private length : number) {
        this.entities
    }

    notifyDeath(unit: Unit) {
        let index = this.entities.findIndex((u : Unit, index : number) => u === unit);
        this.entities.splice(index, 1);
        unit.unregisterObserver(this);
    }

    addEntity(entity : Unit) {
        this.entities.push(entity);
        entity.registerObserver(this);
    }

    closestEntity(entity : Unit) : Unit {
        let closest : Unit = null;
        let closestDist : number = Infinity;
        this.entities.forEach((e : Unit, index : number) => {
            if (e == entity) {
                return;
            }
            let dist = entity.pos.distanceTo(e.pos);
            if (dist < closestDist) {
                closest = e;
            }
        });
        return closest
    }
}
