import { Board } from "../board.js";
import { Heart } from "../heart.js";
import { Player } from "../player.js";
import { Pos } from "../pos.js";
import { Resources } from "../resources.js";
import { GameUnit } from "./game_unit.js";
import { MeleeUnit } from "./melee_unit.js";
import { ResourceUnit } from "./resource_unit.js";
import { ObservableUnit, Unit, TargetChasingUnit } from "./unit.js";

export class Summoner extends TargetChasingUnit  {
    numSummons = 3;
    summonTimerTime = 4;
    summonTimer = this.summonTimerTime;
    range = 16;
    constructor(player: Player, pos: Pos) {
        super(player, SummonerUnit.NAME, pos, SummonerUnit.HP, SummonerUnit.SPEED, SummonerUnit.COLOR);
    }
    doMove(board: Board) {
        super.doMove(board);
        this.summon(board);
    }
    summon(board : Board) {
        if (this.summonTimer <= 0 && this.numSummons > 0) {
            this.summonTimer = this.summonTimerTime;
            let unit : Summonee = new Summonee(this.team, this.pos.clone(), this);
            board.addEntity(unit);
            unit.registerObserver(this);
            this.numSummons--;
            return
        }
        this.summonTimer--;
    }
    notifyDeath(unit: ObservableUnit): void {
        super.notifyDeath(unit);
        if (unit instanceof Summonee && unit.master == this) {
            unit.unregisterObserver(this);
            this.numSummons++;
        }
    }
    inRange(other: Unit): boolean {
        return this.inRangeForDistance(other, this.range);
    }
    inRangeMove(board: Board) {
        return;
    }
    findNewTarget(units: Unit[]): void {
        if (this.hasTarget()) {
            return;
        }
        this.findTargetWithPredicate(units, (unit : Unit) => {
            return unit.team == this.team && unit != this &&
              !(unit instanceof Heart) &&
              !(unit instanceof ResourceUnit) &&
              !(unit instanceof Summoner);
        });
    }
}

export class Summonee extends MeleeUnit {
    static NAME = "Summonee";
    static HP = 2;
    static SPEED = 5;
    static COLOR = "#550055";
    static DAMAGE = 1;
    constructor(player : Player, pos : Pos, public master : Unit) {
        super(player, Summonee.NAME, pos, Summonee.HP, Summonee.SPEED, Summonee.COLOR, Summonee.DAMAGE);
    }
    inRange(other: Unit): boolean {
        return this.pos.isAdjacent(other.pos);
    }

}

export class SummonerUnit extends GameUnit {
    static NAME = "Summoner";
    static COST = new Resources(125, 75, 30);
    static HP = 3;
    static SPEED = 10;
    static COLOR = "#880088";
    static BLURB = "Summons 3 minions to fight for him, follows his allies into battle";
    constructor() {
        super(SummonerUnit.NAME, SummonerUnit.COST, SummonerUnit.BLURB);
    }
    construct(player: Player, pos: Pos): Unit {
        return new Summoner(player, pos)
    }
}