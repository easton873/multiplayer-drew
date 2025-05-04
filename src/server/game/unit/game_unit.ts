import { Player } from "../player.js";
import { Pos } from "../pos.js";
import { Resources } from "../resources.js";
import { Unit } from "./unit.js";
import { UnitCreationInfo } from "./unit_creation_info.js";

export abstract class GameUnit {
    protected creationInfo : UnitCreationInfo;
    abstract construct(player : Player, pos : Pos) : Unit;

    constructor(name : string, cost : Resources, blurb : string) {
            this.creationInfo = new UnitCreationInfo(name, cost, blurb);
    }

    getUnitCreationInfo() : UnitCreationInfo {
        return this.creationInfo;
    }

    getName() : string {
        return this.creationInfo.getName();
    }
}