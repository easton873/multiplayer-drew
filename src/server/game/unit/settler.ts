import { Board } from "../board.js";
import { EraHeartInfo, Heart } from "../heart.js";
import { Player } from "../player.js";
import { Pos, PositionDifference } from "../pos.js";
import { Resources } from "../resources.js";
import { GameUnit } from "./game_unit.js";
import { Unit, UnitWithCounter, } from "./unit.js";

class AbstractSettler extends UnitWithCounter {
    moveCount : number = 0;
    moveDir: PositionDifference;
    constructor(player : Player, name : string, pos : Pos, hp : number, speed : number, color : string, private goal : number, private heartInfo : EraHeartInfo) {
        super(player, name, pos, hp, speed, color);

        this.moveDir = this.getDirectionFromHeart();
        if (this.moveDir.dx == 0 && this.moveDir.dy == 0) {
            this.moveDir = Pos.GetDefaultPositionDifferrence();
        }
        
        this.goal *= this.moveDir.magnitude;
    }

    doMove(board: Board) {
        if (this.moveCount >= this.goal) {
            this.spawnHeart();
            return;
        }
        const { dx, dy } = this.moveDir;
        const absDx = Math.abs(dx);
        const absDy = Math.abs(dy);
        const total = absDx + absDy;

        if (total === 0) {
            this.pos.moveRight();
        } else if (absDy === 0 || (absDx > 0 && Math.random() < absDx / total)) {
            dx > 0 ? this.pos.moveRight() : this.pos.moveLeft();
        } else {
            dy > 0 ? this.pos.moveUp() : this.pos.moveDown();
        }
        this.moveCount++;
    }

    spawnHeart() {
        this.owner.addHeart(new Heart(this.owner, this.pos.clone(), this.heartInfo));
        this.doDamage(this.hp);
    }
}

class settlerUnit extends GameUnit {
    constructor(public name : string, public cost : Resources, public hp : number, public speed : number, public color : string, public blurb : string, 
        public maxDist : number, public heartHP : number, public heartSpeed : number, public heartResources : Resources, public heartRadius) {
        super(name, cost, blurb);
    }
    construct(player: Player, pos: Pos): Unit {
        return new AbstractSettler(player, this.name, pos, this.hp, this.speed, this.color, this.maxDist, new EraHeartInfo(this.heartHP, this.heartSpeed, this.heartResources.copy(), this.heartRadius));
    }
}

export const SettlerUnit : settlerUnit = new settlerUnit(
    "Settler", new Resources(500, 125, 0), 10, 10,  "#7d560d", 
    "Moves up to 50 blocks away from your heart and spawns a new heart", 
    50, 10, 30, new Resources(1, 0, 0), 25
);

export const CityBuilderUnit : settlerUnit = new settlerUnit(
    "City Builder", new Resources(1500, 900, 500), 40, 5,  "#171511", 
    "Moves up to 100 blocks away from your heart and spawns a new heart", 
    100, 100, 30, new Resources(10, 10, 10), 100
);