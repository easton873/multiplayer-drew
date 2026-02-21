import { Board } from "../board.js";
import { EraHeartInfo, Heart } from "../heart.js";
import { Player } from "../player.js";
import { Pos, PositionDifference } from "../pos.js";
import { Resources } from "../resources.js";
import { Defense } from "./defense.js";
import { GameUnit } from "./game_unit.js";
import { MeleeUnit } from "./melee_unit.js";
import { ResourceUnit } from "./resource_unit.js";
import { Unit, UnitWithCounter, } from "./unit.js";

class Teleporter extends UnitWithCounter {
    private targetPos : Pos = new Pos(0, 0);
    private waitingGoal : number = 30 * 15; // in seconds
    private currWaitAmount : number = 0;
    private targets : Unit[] = [];
    private range : number = 25;
    constructor(player : Player, name : string, pos : Pos, hp : number, speed : number, color : string) {
        super(player, name, pos, hp, speed, color);

        let dir : PositionDifference = this.getDirectionFromHeart();

        const halfX = this.owner.board.width / 2;
        const halfY = this.owner.board.height / 2;
        this.targetPos = new Pos(
            Math.round(dir.dx * dir.magnitude * halfX + halfX),
            Math.round((dir.dy * dir.magnitude * halfY)  + halfY)
        );
        this.clamp(this.targetPos, this.owner.board);
    }

    doMove(board: Board) {
        if (this.currWaitAmount >= this.waitingGoal) {
            this.pos = this.targetPos.clone();
            this.targets.forEach((unit : Unit) => {
                // teleport unit
                unit.freeze = false;
                unit.pos = this.targetPos.clone();
            });
            this. targets = [];
            this.doDamage(this.hp);
            return;
        }
        board.entities.forEach((unit : Unit) => {
            if (this.canTeleport(unit)) { 
                unit.freeze = true;
                this.targets.push(unit);
            }
        });
        this.currWaitAmount++;
    }

    canTeleport(unit : Unit) : boolean {
        return this != unit && // skip current unit
            this.team == unit.team && // only teleport the same team
            this.pos.distanceTo(unit.pos) <= this.range && // in range
            this.isValidUnit(unit) && // is one of the units that can be telpoerted
            !this.targets.includes(unit) // isn't one we've already seen
    }

    isValidUnit(unit : Unit) : boolean {
        return !(unit instanceof Heart) && 
        !(unit instanceof ResourceUnit) &&
        !(unit instanceof Defense)
    }
}

class teleporterUnit extends GameUnit {
    constructor(public name : string, public cost : Resources, public hp : number, public speed : number, public color : string, public blurb : string) {
        super(name, cost, blurb);
    }
    construct(player: Player, pos: Pos): Unit {
        return new Teleporter(player, this.name, pos, this.hp, this.speed, this.color);
    }
}

export const TeleporterUnit = new teleporterUnit("Teleporter", new Resources(800, 300, 1000), 17, 0, "#ee70f5", "Teleports everybody by him to another place")
