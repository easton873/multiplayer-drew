import { Board } from "../board.js";
import { Heart } from "../heart.js";
import { Random } from "../math.js";
import { Player } from "../player.js";
import { Pos } from "../pos.js";
import { Resources } from "../resources.js";
import { GameUnit } from "./game_unit.js";
import { ResourceUnit } from "./resource_unit.js";
import { Unit, TargetChasingUnit } from "./unit.js";

export class Melee extends TargetChasingUnit {
    constructor(player : Player, name : string, pos : Pos, hp : number, speed : number, color : string, protected damage : number) {
        super(player, name, pos, hp, speed, color);
    }
    inRangeMove(board : Board) {
        this.target.doDamage(this.damage);
    }

    inRange(other: Unit): boolean {
        return this.isAdjacent(other);
    }
}

export class MeleeUnit extends GameUnit {
    constructor(public name : string, cost : Resources, public speed : number, public damage : number,
        public hp : number, public color : string, blurb : string) {
            super(name, cost, blurb);
    }
    construct(player: Player, pos: Pos): Unit {
        return new Melee(player, this.name, pos, this.hp, this.speed, this.color, this.damage);
    }
}

class soldierUnit extends MeleeUnit {
    constructor() {
        super("Soldier", new Resources(10, 0, 0), 10, 1, 3, "#000000", "Moves once a second and does one damage to its target when adjacent to it");
    }
}

class tankUnit extends MeleeUnit {
    constructor() {
        super("Tank", new Resources(50, 50, 50), 30, 1, 50, "#AAAAAA", "50 HP, moves once every 3 seconds and does 1 damage to its target when adjacent to it");
    }
}

class quickAttackerUnit extends MeleeUnit {
    constructor() {
        super("Quick Attacker", new Resources(30, 20, 0), 5, 1, 3, "#99ccff", "A soldier that got a speed boost");
    }
}

class goblinUnit extends MeleeUnit {
    constructor() {
        super("Goblin", new Resources(20, 10, 0), 7, 1, 1, "#008800", "Goes straight for the closest enemy heart, ignoring all other units");
    }
    construct(player: Player, pos: Pos): Unit {
        return new class extends Melee {
            findNewTarget(units: Unit[]): void {
                if (this.hasTarget()) {
                    return;
                }
                super.findNewTarget(this.getHearts(units));
            }
            getHearts(units : Unit[]) : Unit[] {
                return units.filter((unit : Unit) => unit instanceof Heart);
            }
        }(player, this.name, pos, this.hp, this.speed, this.color, this.damage);
    }
}

class sabotagerUnit extends MeleeUnit {
    constructor() {
        super("Sabotager", new Resources(20, 10, 0), 5, 2, 5, "#00AA00", "Goes straight for the closest enemy resources, ignoring all other units");
    }
    construct(player: Player, pos: Pos): Unit {
        return new class extends Melee {
            findNewTarget(units: Unit[]): void {
                if (this.hasTarget()) {
                    return;
                }
                super.findNewTarget(this.getResources(units));
            }
            getResources(units : Unit[]) : Unit[] {
                return units.filter((unit : Unit) => unit instanceof ResourceUnit && !(unit instanceof Heart));
            }
        }(player, this.name, pos, this.hp, this.speed, this.color, this.damage);
    }
}

class randomMoverUnit extends MeleeUnit {
    constructor() {
        super("Random Mover", new Resources(5, 5, 0), 10, 1, 3, "#ccccff", "Is just like a soldier but randomly teleports to different parts of the map");
    }
    construct(player: Player, pos: Pos): Unit {
        return new class extends Melee {
            doMove(board: Board): void {
                if (Random.fromRange(1, 10) == 1) {
                    this.pos = new Pos(
                        Random.fromRange(0, board.width),
                        Random.fromRange(0, board.height)
                    );
                }
                super.doMove(board);
            }
        }(player, this.name, pos, this.hp, this.speed, this.color, this.damage);
    }
}

export const SoldierUnit : soldierUnit = new soldierUnit();
export const TankUnit : tankUnit = new tankUnit();
export const QuickAttackerUnit : quickAttackerUnit = new quickAttackerUnit();
export const GoblinUnit : goblinUnit = new goblinUnit();
export const SabotagerUnit : sabotagerUnit = new sabotagerUnit();
export const RandomMoverUnit : randomMoverUnit = new randomMoverUnit();