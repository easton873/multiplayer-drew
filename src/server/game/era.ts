import { EraHeartInfo } from "./heart.js";
import { Resources } from "./resources.js";
import { EraData } from "../../shared/types.js";

export class EraInfo {
    constructor(
        public name : string,
        public cost : Resources,
        public resources : Resources,
        public speed : number,
        public hp : number,
        public unitLimit : number,
        public radius : number,
    ){}
}

export const NO_MORE_ERAS = new EraInfo("", new Resources(), new Resources(), 0, 0, 0, 0);

export class Era {
    level : number = 0;

    constructor(public eras : EraInfo[]) {
        if (eras.length == 0) {
            // yikes
        }
    }

    private getEra(level : number) : EraInfo {
        if (level >= this.eras.length) {
            return NO_MORE_ERAS
        }
        return this.eras[level];
    }

    getCurrEra() {
        return this.getEra(this.level);
    }

    getNextEra() : EraInfo {
        return this.getEra(this.level + 1);
    }

    advanceToNextEra(resources : Resources) : boolean{
        let nextEra = this.getNextEra();
        if (nextEra == NO_MORE_ERAS) {
            return false;
        }
        if (this.canAffordNextEra(resources)) {
            resources.spend(nextEra.cost);
            this.level++;
            return true;
        }
        return false;
    }

    canAffordNextEra(resources : Resources) : boolean {
        return resources.canAfford(this.getNextEra().cost);
    }

    getEraData() : EraData {
        let currEra = this.getCurrEra();
        let nextEra = this.getNextEra();
        return {
            eraName: currEra.name,
            hasNextEra: nextEra != NO_MORE_ERAS,
            nextEraCost: nextEra.cost.getResourceData(),
            resourceUnits: [],
            militaryUnits: [],
        }
    }

    getUnitLimit() : number {
        return this.getCurrEra().unitLimit;
    }

    getHeart() : EraHeartInfo {
        let currEra : EraInfo = this.getCurrEra();
        return new EraHeartInfo(currEra.hp, currEra.speed, currEra.resources, currEra.radius);
    }
}
