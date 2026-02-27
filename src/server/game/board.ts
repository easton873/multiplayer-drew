import { Unit, UnitObserver, QueueDeathObserver } from "./unit/unit.js";

export class Board implements UnitObserver, QueueDeathObserver {
    entities : Unit[] = [];
    private pendingDeaths : Unit[] = [];
    constructor(private _width : number,  private _height : number) {
        this.entities
    }

    get width() : number {
        return this._width;
    }

    get height() : number {
        return this._height;
    }

    notifyDeath(unit: Unit) {
        let index = this.entities.findIndex((u : Unit, index : number) => u === unit);
        this.entities.splice(index, 1);
        unit.unregisterObserver(this);
    }

    queueDeath(unit: Unit) {
        this.pendingDeaths.push(unit);
    }

    processDeaths() {
        let deaths = this.pendingDeaths;
        this.pendingDeaths = [];
        for (let i = 0; i < deaths.length; ++i) {
            deaths[i].notifyObserversDeath();
        }
    }

    moveUnit(unit: Unit) {
        unit.move(this);
        this.processDeaths();
    }

    addEntity(entity : Unit) {
        this.entities.push(entity);
        entity.registerObserver(this);
        entity.registerQueueDeathObserver(this);
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
