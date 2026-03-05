import { PlayerHeartData } from "../../shared/types.js";
import { Counter } from "./move/counter.js";
import { Player } from "./player.js";
import { Pos } from "./pos.js";
import { Resources } from "./resources.js";
import { ResourceUnit } from "./unit/resource_unit.js";
import { ObservableUnit, UnitObserver } from "./unit/unit.js";

export const HEART_NAME = "Heart";

export class Hearts implements UnitObserver {
    private hearts : Heart[] = [];
    constructor() {}

    notifyDeath(unit: ObservableUnit) {
        unit.unregisterObserver(this);
        for (let i = 0; i < this.hearts.length; i++) {
            if (this.hearts[i] == unit) {
                this.hearts.splice(i, 1);
                --i;
            }
        }
    }

    isDead() : boolean {
        return this.hearts.length == 0;
    }

    addHeart(heart : Heart) {
        this.hearts.push(heart);
        heart.registerObserver(this);
    }

    isInRange(pos : Pos) : boolean {
        let result : boolean = false;
        this.hearts.forEach((heart : Heart) => {
            if (heart.isInRange(pos)) {
                result = true;
            }
        });
        return result;
    }

    getPlayerHeartData() : PlayerHeartData[] {
        return this.hearts.map((heart : Heart) => heart.getPlayerHeartData());
    }

    getStrongestHeartInRange(pos: Pos): Heart | null {
        let result : Heart = null;
        this.hearts.forEach((heart : Heart) => {
            if (heart.isInRange(pos) && (!result || heart.getRadius() > result.getRadius())) {
                result = heart;
            }
        });
        return result;
    }
}

export class Heart extends ResourceUnit {
    private radius : number;
    constructor(player : Player, pos : Pos, info : EraHeartInfo) {
        super(player, pos, HEART_NAME, info.hp, info.speed, info.resources, player.getColor());
        this.radius = info.radius;
    }

    updateHeart(info : EraHeartInfo) {
        this.hp = info.hp;
        this.totalHP = this.hp;
        this.moveCounter = new Counter(info.speed);
        this.resources = info.resources;
        this.radius = info.radius;
    }

    isInRange(pos : Pos) : boolean {
        return this.pos.distanceTo(pos) <= this.radius
    }

    getPlayerHeartData() : PlayerHeartData {
        return {
            pos: this.pos.getPosData(), 
            radius: this.radius, 
            health: this.hp, 
            totalHealth: this.totalHP,
        };
    }

    getRadius() : number {
        return this.radius;
    }
}

export class EraHeartInfo {
    constructor(public hp : number, public speed : number, public resources : Resources, public radius : number){}
}