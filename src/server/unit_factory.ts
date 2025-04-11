import { Player } from "./player";
import { Pos } from "./pos";
import { ResourceUnit, ResourceUnitFactory } from "./unit/resource_unit";
import { Soldier } from "./unit/soldier";
import { Unit } from "./unit/unit";

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