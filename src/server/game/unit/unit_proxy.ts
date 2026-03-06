import { UnitData, UnitRangedAttackData } from "../../../shared/types.js";
import { Board } from "../board.js";
import { Player } from "../player.js";
import { Pos, PositionDifference } from "../pos.js";
import { ObservableUnit, QueueDeathObserver, Unit, UnitObserver } from "./unit.js";

export class UnitProxy extends Unit implements UnitObserver, QueueDeathObserver {
    private child: Unit;
    parentProxy: UnitProxy | null = null;

    constructor(child: Unit) {
        super(child.owner, child.name, child.pos, child.hp, child.color);
        this.child = child;

        // target: ESNext uses [[Define]] semantics for class fields, so the
        // parent constructor creates own-properties that shadow any prototype
        // getters. We must redefine them as getter/setter pairs that delegate
        // to this.child.
        const delegatedProps: (keyof Unit)[] = [
            'name', 'pos', 'totalHP', 'hp', 'team', 'owner', 'color', 'freeze', 'attacking'
        ];
        for (const prop of delegatedProps) {
            Object.defineProperty(this, prop, {
                get: () => (this.child as any)[prop],
                set: (v: any) => { (this.child as any)[prop] = v; },
                enumerable: true,
                configurable: true,
            });
        }
    }

    // --- Method delegation ---

    move(board: Board) { this.child.move(board); }
    doAcutalMove(board: Board) { (this.child as any).doAcutalMove(board); }
    clamp(pos: Pos, board: Board) { this.child.clamp(pos, board); }

    takeDamage(damage: number) { this.child.takeDamage(damage); }
    takeNormalWeaponDamage(damage: number) { this.child.takeNormalWeaponDamage(damage); }
    takeExplosionDamage(damage: number) { this.child.takeExplosionDamage(damage); }
    takeSiegeDamage(damage: number) { this.child.takeSiegeDamage(damage); }

    kill() { this.child.kill(); }
    isDead(): boolean { return this.child.isDead(); }
    lessenDamage(damage: number, percentage: number): number { return this.child.lessenDamage(damage, percentage); }

    doDamage(unit: Unit, damage: number) { this.child.doDamage(unit, damage); }

    inRangeForDistance(other: Unit, range: number): boolean { return this.child.inRangeForDistance(other, range); }
    inRangeFromPoint(other: Unit, range: number, pos: Pos): boolean { return this.child.inRangeFromPoint(other, range, pos); }
    isAdjacent(other: Unit): boolean { return this.child.isAdjacent(other); }

    getDirectionFromHeart(): PositionDifference { return this.child.getDirectionFromHeart(); }

    isInvisible(): boolean { return this.child.isInvisible(); }
    goInvisible() { this.child.goInvisible(); }
    goVisibile() { this.child.goVisibile(); }

    is<T extends Unit>(type: abstract new (...args: any[]) => T): this is T {
        return this.child.is(type);
    }

    getUnitData(): UnitData { return this.child.getUnitData(); }
    getRangedData(): UnitRangedAttackData { return this.child.getRangedData(); }

    TESTkill() { this.child.TESTkill(); }

    // --- wrap / unwrap ---

    wrap(board: Board) {
        const idx = board.entities.indexOf(this.child);
        if (idx !== -1) {
            board.entities[idx] = this;
        }

        // Move board observers from child to this proxy
        this.child.unregisterObserver(board);
        this.child.unregisterQueueDeathObserver(board);
        this.registerObserver(board);
        this.registerQueueDeathObserver(board);

        // Proxy observes the child
        this.child.registerObserver(this);
        this.child.registerQueueDeathObserver(this);

        if (this.child instanceof UnitProxy) {
            this.child.parentProxy = this;
        }
    }

    unwrap(board: Board) {
        if (!this.parentProxy) {
            // Outermost proxy
            const idx = board.entities.indexOf(this);
            if (idx !== -1) {
                board.entities[idx] = this.child;
            }

            this.unregisterObserver(board);
            this.unregisterQueueDeathObserver(board);
            this.child.unregisterObserver(this);
            this.child.unregisterQueueDeathObserver(this);
            this.child.registerObserver(board);
            this.child.registerQueueDeathObserver(board);

            if (this.child instanceof UnitProxy) {
                this.child.parentProxy = null;
            }
        } else {
            // Middle of chain
            this.child.unregisterObserver(this);
            this.child.unregisterQueueDeathObserver(this);
            this.parentProxy.child = this.child;
            this.child.registerObserver(this.parentProxy);
            this.child.registerQueueDeathObserver(this.parentProxy);

            if (this.child instanceof UnitProxy) {
                this.child.parentProxy = this.parentProxy;
            }
        }
    }

    // --- Death propagation ---

    queueDeath(unit: Unit) {
        // Child died -> propagate as if proxy died
        this.notifyQueueDeathObservers();
    }

    notifyDeath(unit: ObservableUnit) {
        // Cleanup: unregister from child when it notifies death
        unit.unregisterObserver(this);
    }

    notifyObserversDeath() {
        // Board removes proxy from entities
        super.notifyObserversDeath();
        // Cleanup queue death observer link
        this.child.unregisterQueueDeathObserver(this);
        // Cascade to child so Player gets notified (decrements unitCount)
        this.child.notifyObserversDeath();
    }

    // --- Helpers ---

    getChild(): Unit {
        return this.child;
    }
}

export function unwrapUnit(unit: Unit): Unit {
    while (unit instanceof UnitProxy) {
        unit = unit.getChild();
    }
    return unit;
}
