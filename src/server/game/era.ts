import { EraHeartInfo } from "./heart.js";
import { Resources } from "./resources.js";
import { EraData, UnitCreationData } from "../../shared/types.js";
import { GameUnit } from "./unit/game_unit.js";
import { ALL_MILITARY_UNITS, ALL_RESOURCE_UNITS, ALL_UNITS } from "./unit/all_units.js";
import { INDUSTRIAL_WORKER_GAME_UNIT, LUMBER_JACK_GAME_UNIT, MINER_GAME_UNIT, PROSPECTOR_GAME_UNIT, RICH_GUY_GAME_UNIT } from "./unit/resource_unit.js";
import { QuickAttackerUnit, TankUnit } from "./unit/melee_unit.js";
import { MissileUnit } from "./unit/missile.js";

export const STARTING_ERA_NAME = "The Starting Era";
export const SECOND_ERA_NAME = "The Second Era";
export const THIRD_ERA_NAME = "Third Era";
export const FOURTH_ERA_NAME = "Fourth Era";
export const FIFTH_ERA_NAME = "Fifth Era";
export const SIXTH_ERA_NAME = "Sixth Era";

const STARTING_COST : Resources = new Resources(400, 0 ,0);
const STARTING_RESOURCES : Resources = new Resources(1, 0, 0);
const STARTING_SPEED : number = 10;
const STARTING_HP : number = 10;
const STARTING_NUM_UNITS : number = 25;
const STARTING_RADIUS : number = 25;

const SECOND_COST : Resources = new Resources(1000, 300, 0);
const SECOND_RESOURCES : Resources = new Resources(2, 0, 0);
const SECOND_SPEED : number = 10;
const SECOND_HP : number = 20;
const SECOND_NUM_UNITS : number = 50;
const SECOND_RADIUS : number = 49;

const THIRD_COST : Resources = new Resources(3000, 1000, 300);
const THIRD_RESOURCES : Resources = new Resources(3, 1, 0);
const THIRD_SPEED : number = 10;
const THIRD_HP : number = 30;
const THIRD_NUM_UNITS : number = 100;
const THIRD_RADIUS : number = 100;

const FOURTH_COST : Resources = new Resources(5000, 3000, 1500);
const FOURTH_RESOURCES : Resources = new Resources(3, 1, 1);
const FOURTH_SPEED : number = 10;
const FOURTH_HP : number = 45;
const FOURTH_NUM_UNITS : number = 200;
const FOURTH_RADIUS : number = 225;

const FIFTH_COST : Resources = new Resources(8000, 5000, 4000);
const FIFTH_RESOURCES : Resources = new Resources(5, 3, 2);
const FIFTH_SPEED : number = 10;
const FIFTH_HP : number = 70;
const FIFTH_NUM_UNITS : number = 400;
const FIFTH_RADIUS : number = 400;

const SIXTH_COST : Resources = new Resources(20000, 20000, 20000);
const SIXTH_RESOURCES : Resources = new Resources(10, 10, 10);
const SIXTH_SPEED : number = 10;
const SIXTH_HP : number = 100;
const SIXTH_NUM_UNITS : number = 800;
const SIXTH_RADIUS : number = 900;

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

    getUnits(resourceUnit: GameUnit = null, militaryUnit : GameUnit = null): GameUnit[] {
        let resourceUnits : GameUnit[] = resourceUnit == null ? ALL_RESOURCE_UNITS : ALL_RESOURCE_UNITS.slice(0, ALL_RESOURCE_UNITS.findIndex((unit : GameUnit) => {
            return unit == resourceUnit;
        }));
        let militaryUnits : GameUnit[] = militaryUnit == null ? ALL_MILITARY_UNITS : ALL_MILITARY_UNITS.slice(0, ALL_MILITARY_UNITS.findIndex((unit : GameUnit) => {
            return unit == militaryUnit;
        }));
        return resourceUnits.concat(militaryUnits)
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
        return STARTING_ERA_NAME;
    }
    getAvailableUnits(): GameUnit[] {
        return this.getUnits(LUMBER_JACK_GAME_UNIT, QuickAttackerUnit);
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
        return SECOND_ERA_NAME;
    }
    getAvailableUnits(): GameUnit[] {
        return this.getUnits(MINER_GAME_UNIT, TankUnit);
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
        return THIRD_ERA_NAME;
    }
    getAvailableUnits(): GameUnit[] {
        return this.getUnits(PROSPECTOR_GAME_UNIT, MissileUnit);
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
        return FOURTH_ERA_NAME;
    }
    getAvailableUnits(): GameUnit[] {
        return this.getUnits(INDUSTRIAL_WORKER_GAME_UNIT, MissileUnit);
    }
}

class FifthEra extends BaseEra implements EraState {
    constructor() {
        super(FIFTH_HP, FIFTH_SPEED, FIFTH_RESOURCES, FIFTH_COST, FIFTH_RADIUS, FIFTH_NUM_UNITS);
    }
    nextState(): EraState {
        return new SixthEra();
    }
    getName(): string {
        return FIFTH_ERA_NAME;
    }
    getAvailableUnits(): GameUnit[] {
        return this.getUnits(RICH_GUY_GAME_UNIT, MissileUnit);
    }
}

class SixthEra extends BaseEra implements EraState {
    constructor() {
        super(SIXTH_HP, SIXTH_SPEED, SIXTH_RESOURCES, SIXTH_COST, SIXTH_RADIUS, SIXTH_NUM_UNITS);
    }
    nextState(): EraState {
        return null;
    }
    getName(): string {
        return SIXTH_ERA_NAME;
    }
    getAvailableUnits(): GameUnit[] {
        return this.getUnits();
    }
}