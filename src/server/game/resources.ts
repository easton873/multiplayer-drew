import { ResourceData } from "../../shared/types.js";

export class Resources {
    constructor(private gold : number, private wood : number, private stone : number) {}

    add(other : Resources) {
        this.gold += other.gold;
        this.wood += other.wood;
        this.stone += other.stone;
    }

    spend(other : Resources) {
        this.gold -= other.gold;
        this.wood -= other.wood;
        this.stone -= other.stone;
    }

    canAfford(other : Resources) : boolean {
        return this.gold >= other.gold &&
        this.wood >= other.wood &&
        this.stone >= other.stone;
    }

    copy() : Resources {
        return new Resources(this.gold, this.wood, this.stone);
    }

    equals(other : Resources) : boolean {
        return this.gold == other.gold &&
        this.wood == other.wood &&
        this.stone == other.stone;
    }

    getResourceData() : ResourceData {
        return {
            gold: this.gold,
            wood: this.wood,
            stone: this.stone,
        }
    }
}