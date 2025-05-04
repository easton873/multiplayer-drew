import { UnitCreationData } from "../../../shared/types.js";
import { Resources } from "../resources.js";

export class UnitCreationInfo {
    constructor(private name : string, private cost : Resources, public blurb) {}

    getCost() : Resources {
        return this.cost;
    }

    getName() : string {
        return this.name;
    }

    getUnitCreationData() : UnitCreationData {
        return {
            name: this.name,
            cost: this.cost.getResourceData(),
            blurb: this.blurb
        };
    }
}