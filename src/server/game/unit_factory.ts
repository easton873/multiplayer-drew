import { Player } from "./player.js";
import { Pos } from "./pos.js";
import { ResourceUnit, ResourceUnitFactory } from "./unit/resource_unit.js";
import { Soldier } from "./unit/soldier.js";
import { Unit } from "./unit/unit.js";

export class UnitFactory {
    resouceUnitFactory : ResourceUnitFactory;
    constructor(private player : Player){
        this.resouceUnitFactory = new ResourceUnitFactory(player);
    }

    // Resource Units
    NewMerchant(pos: Pos): Unit {
        return this.resouceUnitFactory.NewMerchant(pos);
    }
    NewLumberJack(pos: Pos): Unit {
        return this.resouceUnitFactory.NewLumberJack(pos);
    }
    NewMiner(pos: Pos): Unit {
        return this.resouceUnitFactory.NewMiner(pos);
    }

    // Military Units
    NewSoldier(pos : Pos) : Unit {
        return new Soldier(this.player, pos);
    }
}