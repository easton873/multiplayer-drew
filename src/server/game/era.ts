import { EraHeartInfo } from "./heart.js";
import { Resources } from "./resources.js";
import { EraData, UnitCreationData } from "../../shared/types.js";
import { GameUnit } from "./unit/game_unit.js";
import { ALL_UNITS } from "./unit/all_units.js";
import { LUMBER_JACK_GAME_UNIT, MINER_GAME_UNIT } from "./unit/resource_unit.js";

const STARTING_COST : Resources = new Resources(100, 0 ,0);
const STARTING_RESOURCES : Resources = new Resources(1, 0, 0);
const STARTING_SPEED : number = 10;
const STARTING_HP : number = 10;
const STARTING_NUM_UNITS : number = 10;
const STARTING_RADIUS : number = 16;

const SECOND_COST : Resources = new Resources(200, 40, 0);
const SECOND_RESOURCES : Resources = new Resources(2, 0, 0);
const SECOND_SPEED : number = 10;
const SECOND_HP : number = 20;
const SECOND_NUM_UNITS : number = 25;
const SECOND_RADIUS : number = 25;

const THIRD_COST : Resources = new Resources(600, 200, 0);
const THIRD_RESOURCES : Resources = new Resources(3, 1, 0);
const THIRD_SPEED : number = 10;
const THIRD_HP : number = 30;
const THIRD_NUM_UNITS : number = 50;
const THIRD_RADIUS : number = 36;

const FOURTH_COST : Resources = new Resources(2000, 1000, 700);
const FOURTH_RESOURCES : Resources = new Resources(3, 1, 1);
const FOURTH_SPEED : number = 10;
const FOURTH_HP : number = 45;
const FOURTH_NUM_UNITS : number = 100;
const FOURTH_RADIUS : number = 100;

const FIFTH_COST : Resources = new Resources(5000, 3000, 2000);
const FIFTH_RESOURCES : Resources = new Resources(5, 3, 2);
const FIFTH_SPEED : number = 10;
const FIFTH_HP : number = 70;
const FIFTH_NUM_UNITS : number = 200;
const FIFTH_RADIUS : number = 256;

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

export interface EraState {
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
        return ALL_UNITS.slice(0, ALL_UNITS.findIndex((unit : GameUnit) => {
            return unit === LUMBER_JACK_GAME_UNIT;
        }));
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
        return ALL_UNITS.slice(0, ALL_UNITS.findIndex((unit : GameUnit) => {
            return unit === MINER_GAME_UNIT;
        }));
    }
}

class ThirdEra extends BaseEra implements EraState {
    constructor() {
        super(THIRD_HP, THIRD_SPEED, THIRD_RESOURCES, THIRD_COST, THIRD_RADIUS, THIRD_NUM_UNITS);
    }
    nextState(): EraState {
        return new FourthEra();
    }
    getName(): string {
        return "Third Era";
    }
    getAvailableUnits(): GameUnit[] {
        return ALL_UNITS;
    }
}

class FourthEra extends BaseEra implements EraState {
    constructor() {
        super(FOURTH_HP, FOURTH_SPEED, FOURTH_RESOURCES, FOURTH_COST, FOURTH_RADIUS, FOURTH_NUM_UNITS);
    }
    nextState(): EraState {
        return new FifthEra();
    }
    getName(): string {
        return "Fourth Era";
    }
    getAvailableUnits(): GameUnit[] {
        return ALL_UNITS;
    }
}

class FifthEra extends BaseEra implements EraState {
    constructor() {
        super(FIFTH_HP, FIFTH_SPEED, FIFTH_RESOURCES, FIFTH_COST, FIFTH_RADIUS, FIFTH_NUM_UNITS);
    }
    nextState(): EraState {
        return null;
    }
    getName(): string {
        return "Fifth Era";
    }
    getAvailableUnits(): GameUnit[] {
        return ALL_UNITS;
    }
}