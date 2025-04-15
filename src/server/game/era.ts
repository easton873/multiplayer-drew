import { EraHeartInfo } from "./heart.js";
import { Resources } from "./resources.js";
import { MERCHANT_NAME } from "./unit/resource_unit.js";
import { SOLDIER_NAME } from "./unit/soldier.js";

const STARTING_COST : Resources = new Resources(10, 0 ,0);
const STARTING_RESOURCES : Resources = new Resources(1, 0, 0);
const STARTING_SPEED : number = 5;
const STARTING_HP : number = 10;

const SECOND_COST : Resources = new Resources(25, 10, 0);
const SECOND_RESOURCES : Resources = new Resources(2, 1, 0);
const SECOND_SPEED : number = 5;
const SECOND_HP : number = 20;

export class Era {
    nextEraCost : Resources;
    currEra : EraState = new StartingEra();
    availableUnits : string[];

    constructor() {
        this.prepareNewEra(this.currEra)
    }

    isValidUnitForEra(name : string) : boolean {
        return this.availableUnits.includes(name);
    }

    advanceToNextEra(resources : Resources) {
        if (this.currEra.nextState() == null) {
            return;
        }
        if (this.canAffordNextEra(resources)) {
            resources.spend(this.nextEraCost);
            this.currEra = this.currEra.nextState();
            this.prepareNewEra(this.currEra);
        }
    }

    canAffordNextEra(resources : Resources) : boolean {
        if (this.nextEraCost == null) {
            return false;
        }
        return resources.canAfford(this.nextEraCost);
    }

    prepareNewEra(newEra : EraState) {
        this.nextEraCost = newEra.nextEraCost();
        this.availableUnits = newEra.getAvailableUnits();
    }
}

interface EraState {
    nextState() : EraState;
    nextEraCost() : Resources;
    getName() : string;
    getRadius() : number;
    getHeart() : EraHeartInfo;
    getAvailableUnits() : string[];
}

abstract class BaseEra {
    constructor(public hp : number, public speed : number, public resources : Resources, public cost : Resources ){}

    nextEraCost(): Resources {
        return this.cost;
    }

    getHeart(): EraHeartInfo {
        return new EraHeartInfo(this.hp, this.speed, this.resources);
    }
}

class StartingEra extends BaseEra implements EraState {
    constructor() {
        super(STARTING_HP, STARTING_SPEED, STARTING_RESOURCES, STARTING_COST);
    }
    nextState(): EraState {
        return new SecondEra();
    }
    getName(): string {
        return "The Starting Era";
    }
    getRadius(): number {
        return 15;
    }
    getAvailableUnits(): string[] {
        return [SOLDIER_NAME, MERCHANT_NAME];
    }
}

class SecondEra extends BaseEra implements EraState {
    constructor() {
        super(SECOND_HP, SECOND_SPEED, SECOND_RESOURCES, SECOND_COST);
    }
    nextState(): EraState {
        throw new Error("Method not implemented.");
    }
    getName(): string {
        return "The Second Era";
    }
    getRadius(): number {
        return 20;
    }
    getAvailableUnits(): string[] {
        return [SOLDIER_NAME, MERCHANT_NAME];
    }

}