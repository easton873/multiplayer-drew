import { UnitData, UnitRangedAttackData } from "../../../shared/types.js";
import { Board } from "../board.js";
import { Heart } from "../heart.js";
import { Counter } from "../move/counter.js";
import { Player } from "../player.js";
import { Pos, PositionDifference } from "../pos.js";
import { DamageTaker } from "./damage.js";

export abstract class ObservableUnit {
    private observers : UnitObserver[] = [];
    private queueDeathObservers : QueueDeathObserver[] = [];

    get TESTObservers() {
        return this.observers;
    }

    registerObserver(o : UnitObserver) {
        this.observers.push(o);
    }

    unregisterObserver(o : UnitObserver) {
        let index = this.observers.findIndex((observer : UnitObserver) => observer === o);
        if (index == -1) {
            console.log("issue removing observer");
        }
        this.observers.splice(index, 1);
    }

    registerQueueDeathObserver(o : QueueDeathObserver) {
        this.queueDeathObservers.push(o);
    }

    unregisterQueueDeathObserver(o : QueueDeathObserver) {
        let index = this.queueDeathObservers.findIndex((observer : QueueDeathObserver) => observer === o);
        if (index == -1) {
            console.log("issue removing queue death observer");
        }
        this.queueDeathObservers.splice(index, 1);
    }

    notifyObserversDeath() {
        let currLength = this.observers.length;
        for (let i = 0; i < this.observers.length; ++i) {
            let o = this.observers[i];
            o.notifyDeath(this);
            if (currLength != this.observers.length) { // this check will ensure we don't go into an infinite loop probably
                currLength = this.observers.length;
                i--;
            }
        }
    }

    notifyQueueDeathObservers() {
        for (let i = 0; i < this.queueDeathObservers.length; ++i) {
            this.queueDeathObservers[i].queueDeath(this as unknown as Unit);
        }
    }
}

export interface UnitObserver {
    notifyDeath(unit : ObservableUnit); // when implementing this, unregister the observer
}

export interface QueueDeathObserver {
    queueDeath(unit : Unit);
}

export abstract class Unit extends ObservableUnit implements DamageTaker {
    name : string;
    pos : Pos;
    totalHP : number;
    hp : number;
    team : number;
    owner : Player;
    color : string;
    freeze : boolean = false;
    private invisible : boolean = false;
    attacking : boolean = false;

    constructor(player : Player, name : string, pos : Pos, hp : number, color : string) {
        super();
        this.team = player.getTeam();
        this.owner = player;
        this.name = name;
        this.pos = pos;
        this.totalHP = hp;
        this.hp = hp;
        this.color = color;
    }

    move(board : Board) {
        if (this.freeze) {
            return;
        }
        this.doAcutalMove(board);
        this.clamp(this.pos, board);
    }

    clamp(pos : Pos, board : Board) {
        pos.clamp(board.width - 1, board.height - 1);
    }

    abstract doAcutalMove(board : Board);

    doDamage(unit : Unit, damage : number) {
        unit.takeNormalWeaponDamage(damage);
    }

    takeDamage(damage : number) {
        if (this.isDead()) return;
        this.hp -= damage;
        if (this.isDead()) {
            this.notifyQueueDeathObservers();
        }
    }

    takeNormalWeaponDamage(damage: number) {
        this.takeDamage(damage);
    }

    takeExplosionDamage(damage: number) {
        this.takeDamage(damage);
    }

    takeSiegeDamage(damage: number) {
        this.takeDamage(this.lessenDamage(damage, .5));
    }

    kill() {
        this.takeDamage(this.hp);
    }

    public TESTkill() {
        this.notifyObserversDeath();
    }
    
    lessenDamage(damage : number, percentage : number) : number {
        return Math.max(damage * percentage, 1);
    }

    isDead() : boolean {
        return this.hp <= 0;
    }

    inRangeForDistance(other : Unit, range : number) : boolean {
        return this.inRangeFromPoint(other, range, this.pos);
    }

    inRangeFromPoint(other : Unit, range : number, pos : Pos) : boolean {
        return pos.distanceTo(other.pos) <= range;
    }

    isAdjacent(other : Unit) : boolean {
        return this.pos.isAdjacent(other.pos);
    }

    getDirectionFromHeart() : PositionDifference {
        const closest : Heart = this.owner.hearts.getStrongestHeartInRange(this.pos);
        if (!closest) { // this shouldn't ever happen
            console.log("somehow a unit didn't have an owner with a heart 😬");
            return Pos.GetDefaultPositionDifferrence();
        }

        return closest.pos.getMoveDir(this.pos.clone(), closest.getRadius());
    }

    isInvisible() : boolean {
        return this.invisible;
    }

    goInvisible() {
        this.invisible = true;
    }

    goVisibile() {
        this.invisible = false;
    }

    getUnitData() : UnitData {
        return {
            name: this.name,
            pos : this.pos.getPosData(),
            team: this.team,
            color: this.color,
            playerColor: this.owner.getColor(),
            hp : this.hp,
            totalHP: this.totalHP,
            rangedData: this.getRangedData(),
        };
        // if (this.invisible) {
        //     let invisibleColor = "#00000000";
        //     data.name = "";
        //     data.color = invisibleColor;
        //     data.playerColor = invisibleColor;
        // }
        // return data;
    }

    getRangedData() : UnitRangedAttackData {
        return {
            attacking: this.attacking,
            ranged: false,
            targetX: 0,
            targetY: 0,
            counter: 0,
            counterTotal: 0,
        };
    }
}

export abstract class UnitWithCounter extends Unit {
    moveCounter : Counter;
    constructor(player : Player, name : string, pos : Pos, hp : number, speed : number, color : string){
        super(player, name, pos, hp, color);
        this.moveCounter = new Counter(speed);
    }
    doAcutalMove(board: Board) {
        if (this.moveCounter.tick()) {
            this.doMove(board);
        }
    }
    abstract doMove(board : Board);

    set speed(newSpeed : number) {
        this.moveCounter.setSpeed(newSpeed);
    }
}

export abstract class UnitWithTarget extends Unit implements UnitObserver {
    private _target : Unit = null;
    notifyDeath(unit: ObservableUnit) {
        if (unit == this._target) {
            this._target = null;
            unit.unregisterObserver(this);
        }
    }

    hasNoTarget() : boolean {
        return this._target == null || this._target == undefined;
    }

    hasTarget() : boolean {
        return !this.hasNoTarget();
    }

    set target(target : Unit) {
        if (this._target) {
            this._target.unregisterObserver(this);
        }
        this._target = target;
        if (this._target) {
            target.registerObserver(this);
        }
    }

    get target() {
        return this._target;
    }

    findNewTarget(units : Unit[]) {
        this.findTargetWithPredicate(units, (unit : Unit) => this.isValidTarget(unit));
    }

    isValidTarget(unit : Unit) : boolean {
        return unit.team != this.team;
    }

    findTargetWithPredicate(units : Unit[], predicate : (unit : Unit) => boolean) {
        let currDist = -1;
        units.forEach((unit : Unit) => {
            let dist = this.pos.distanceTo(unit.pos);
            if (predicate(unit) && (currDist == -1 || dist < currDist) && !unit.isInvisible()) {
                this.target = unit;
                currDist = dist;
            }
        });
    }

    doDamageInArea(board : Board, pos : Pos, range : number, damage : number) {
        for (let i = 0; i < board.entities.length; ++i) {
            let unit = board.entities[i];
            if (this.inRangeFromPoint(unit, range, pos)) {
                this.doDamage(unit, damage);
            }
        }
    }
}

export function clampHealth(unit : Unit) {
    if (unit.hp > unit.totalHP) {
        unit.hp = unit.totalHP;
    }
}