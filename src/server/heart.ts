import { Player } from "./player";
import { Pos } from "./pos";
import { Resources } from "./resources";
import { ResourceUnit } from "./unit/resource_unit";

export const HEART_NAME = "Heart";

export class Heart extends ResourceUnit {
    constructor(player : Player, pos : Pos, info : EraHeartInfo) {
        super(player, pos, HEART_NAME, info.hp, info.speed, info.resources, null);
    }
}

export class EraHeartInfo {
    constructor(public hp : number, public speed : number, public resources : Resources ){}
}