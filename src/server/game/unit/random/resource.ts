import { Random } from "../../math.js";
import { RESOURCE_TYPES, ResourceType, GOLD_RESOURCE, WOOD_RESOURCE, STONE_RESOURCE, RANDOMONIUM_RESROUCE, DIAMOND_RESOURCE } from "../../../../shared/resource_types.js";
import { Board } from "../../board.js";
import { UnitWithCounter, Unit } from "../unit.js";
import { Resources } from "../../resources.js";
import { Player } from "../../player.js";
import { Pos } from "../../pos.js";
import { GameUnit } from "../game_unit.js";

export class RandomResourceUnit extends UnitWithCounter {
    constructor(player: Player, name: string, pos: Pos, hp: number, speed: number, private rollableResources: ResourceType[], private amount: number, color: string) {
        super(player, name, pos, hp, speed, color);
    }
    doMove(_: Board): void {
        const type = Random.fromList(this.rollableResources);
        this.owner.resources.add(new Resources({ [type]: this.amount }));
    }

    getBuildingDamageMultiplier(): number {
        return 1;
    }

    getPhysicalDamageMultiplier(): number {
        return .1;
    }
}

export class GameRandomResourceUnit extends GameUnit {
    constructor(
        name: string,
        cost: Resources,
        private hp: number,
        private speed: number,
        private rollableResources: ResourceType[],
        private amount: number,
        private color: string,
        blurb: string
    ) {
        super(name, cost, blurb);
    }
    construct(player: Player, pos: Pos): Unit {
        return new RandomResourceUnit(player, this.creationInfo.getName(), pos, this.hp, this.speed, this.rollableResources, this.amount, this.color);
    }
}
