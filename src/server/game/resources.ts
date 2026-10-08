import { ResourceData } from "../../shared/types.js";
import { RESOURCE_TYPES, ResourceType, ResourceInit } from "../../shared/resource_types.js";

export class Resources {
    private amounts = new Map<ResourceType, number>();
    constructor(init : ResourceInit = {}) {
        for (const t of RESOURCE_TYPES) {
            this.amounts.set(t, init[t] ?? 0);
        }
    }

    private get(type: ResourceType): number {
      return this.amounts.get(type) ?? 0;
    }

    add(other : Resources) {
        for(const t of RESOURCE_TYPES) {
            this.amounts.set(t, this.get(t) + other.get(t));
        }
    }

    multiply(scalar : number) {
        for(const t of RESOURCE_TYPES) {
            this.amounts.set(t, this.get(t) * scalar);
        }
    }

    spend(other : Resources) {
        for(const t of RESOURCE_TYPES) {
            this.amounts.set(t, this.get(t) - other.get(t));
        }
    }

    canAfford(other : Resources) : boolean {
        return RESOURCE_TYPES.every(t => this.get(t) >= other.get(t));
    }

    copy() : Resources {
        return new Resources(this.getResourceData());
    }

    equals(other : Resources) : boolean {
        return RESOURCE_TYPES.every(t => this.get(t) === other.get(t));
    }

    getResourceData(): ResourceData {
        const data = {} as ResourceData;
        for (const t of RESOURCE_TYPES) {
            data[t] = this.get(t);
        }
        return data;
    }
}