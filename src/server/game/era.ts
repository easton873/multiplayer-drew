import { EraHeartInfo } from "./heart.js";
import { Resources } from "./resources.js";
import { ARCHER_NAME, EraData, KAMAKAZE_NAME, LUMBER_JACK_NAME, MERCHANT_NAME, SOLDIER_NAME, UnitCreationData } from "../../shared/types.js";
import { GameUnit } from "./unit/game_unit.js";
import { ALL_UNITS } from "./unit/all_units.js";

const STARTING_COST : Resources = new Resources(100, 0 ,0);
const STARTING_RESOURCES : Resources = new Resources(1, 0, 0);
const STARTING_SPEED : number = 10;
const STARTING_HP : number = 10;
const STARTING_NUM_UNITS : number = 10;
const STARTING_RADIUS : number = 16;

const SECOND_COST : Resources = new Resources(200, 40, 0);
const SECOND_RESOURCES : Resources = new Resources(2, 1, 0);
const SECOND_SPEED : number = 10;
const SECOND_HP : number = 20;
const SECOND_NUM_UNITS : number = 25;
const SECOND_RADIUS : number = 25;

const THIRD_COST : Resources = new Resources(600, 200, 0);
const THIRD_RESOURCES : Resources = new Resources(3, 2, 0);
const THIRD_SPEED : number = 10;
const THIRD_HP : number = 30;
const THIRD_NUM_UNITS : number = 45;
const THIRD_RADIUS : number = 36;

export class Era {
    nextEraCost : Resources;
    currEra : EraState = new StartingEra();
    availableUnits : GameUnit[];

    constructor() {
        this.prepareNewEra(this.currEra)
    }

    isValidUnitForEra(name : string) : boolean {
        let found = false;
        this.availableUnits.forEach((unit : GameUnit) => {
            if (unit.getName() == name) {
                found = true;
            }
        });
        return found;
    }

    advanceToNextEra(resources : Resources) : boolean{
        if (this.currEra.nextState() == null) {
            return false;
        }
        if (this.canAffordNextEra(resources)) {
            resources.spend(this.nextEraCost);
            this.currEra = this.currEra.nextState();
            this.prepareNewEra(this.currEra);
            return true;
        }
        return false;
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

    getEraData() : EraData {
        let unitCreationData : UnitCreationData[] = [];
        this.currEra.getAvailableUnits().forEach((info : GameUnit) => {
            unitCreationData.push(info.getUnitCreationInfo().getUnitCreationData());
        });
        return {
            eraName: this.currEra.getName(),
            nextEraCost: this.currEra.nextEraCost().getResourceData(),
            availableUnits: unitCreationData,
        }
    }

    getRadius() : number {
        return this.currEra.getRadius();
    }

    getUnitLimit() : number {
        return this.currEra.getUnitLimmit();
    }
}

interface EraState {
    nextState() : EraState;
    nextEraCost() : Resources;
    getName() : string;
    getRadius() : number;
    getHeart() : EraHeartInfo;
    getAvailableUnits() : GameUnit[];
    getUnitLimmit() : number;
}

abstract class BaseEra {
    constructor(public hp : number, public speed : number, public resources : Resources, public cost : Resources, public radius : number, public numUnits : number){}

    nextEraCost(): Resources {
        return this.cost;
    }

    getHeart(): EraHeartInfo {
        return new EraHeartInfo(this.hp, this.speed, this.resources);
    }

    getRadius(): number {
        return this.radius;
    }

    getUnitLimmit(): number {
        return this.numUnits;
    }
}

export class StartingEra extends BaseEra implements EraState {
    constructor() {
        super(STARTING_HP, STARTING_SPEED, STARTING_RESOURCES, STARTING_COST, STARTING_RADIUS, STARTING_NUM_UNITS);
    }
    nextState(): EraState {
        return new SecondEra();
    }
    getName(): string {
        return "The Starting Era";
    }
    getAvailableUnits(): GameUnit[] {
        return ALL_UNITS.slice(0, 2);
    }
}

class SecondEra extends BaseEra implements EraState {
    constructor() {
        super(SECOND_HP, SECOND_SPEED, SECOND_RESOURCES, SECOND_COST, SECOND_RADIUS, SECOND_NUM_UNITS);
    }
    nextState(): EraState {
        return new ThirdEra();
    }
    getName(): string {
        return "The Second Era";
    }
    getAvailableUnits(): GameUnit[] {
        return ALL_UNITS;
    }
}

class ThirdEra extends BaseEra implements EraState {
    constructor() {
        super(THIRD_HP, THIRD_SPEED, THIRD_RESOURCES, THIRD_COST, THIRD_RADIUS, THIRD_NUM_UNITS);
    }
    nextState(): EraState {
        return null;
    }
    getName(): string {
        return "Third Era";
    }
    getAvailableUnits(): GameUnit[] {
        return ALL_UNITS;
    }
}