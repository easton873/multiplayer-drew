import { Counter } from "./move/counter.js";
import { Player } from "./player.js";
import { Pos } from "./pos.js";
import { Resources } from "./resources.js";
import { ResourceUnit } from "./unit/resource_unit.js";

export const HEART_NAME = "Heart";

export class Heart extends ResourceUnit {
    constructor(player : Player, pos : Pos, info : EraHeartInfo) {
        super(player, pos, HEART_NAME, info.hp, info.speed, info.resources, player.getColor());
    }

    updateHeart(info : EraHeartInfo) {
        this.hp = info.hp;
        this.totalHP = this.hp;
        this.moveCounter = new Counter(info.speed);
        this.resources = info.resources;
    }
}

export class EraHeartInfo {
    constructor(public hp : number, public speed : number, public resources : Resources ){}
}