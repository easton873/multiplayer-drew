import { Board } from "./board.js";
import { Heart, Hearts } from "./heart.js";
import { Resources } from "./resources.js";
import { ObservableUnit, Unit, UnitObserver } from "./unit/unit.js";
import { Pos } from "./pos.js";
import { Era } from "./era.js";
import { PlayerSpecificData, ResourceData } from "../../shared/types.js";
import { GameUnit } from "./unit/game_unit.js";
import { UNIT_MAP } from "./unit/all_units.js";

export class Player implements UnitObserver {
    resources: Resources;
    board: Board;
    era: Era = new Era();
    unitCount = 0;

    heart: Heart;
    hearts : Hearts = new Hearts();

    constructor(private team: number, pos: Pos, board: Board, private id: string, private name: string, private color: string, startingResources: ResourceData = { gold: 50, wood: 0, stone: 0 }) {
        this.resources = new Resources(startingResources.gold, startingResources.wood, startingResources.stone);
        this.board = board;
        this.heart = new Heart(this, pos, this.era.currEra.getHeart());
        this.addHeart(this.heart);
    }

    doTurn() {}

    notifyDeath(unit: ObservableUnit) {
        unit.unregisterObserver(this);
        if (this.heart != null && unit == this.heart) {
            this.heart = null;
            return;
        }
        this.unitCount--;
    }

    getColor() : string {
        return this.color;
    }

    getTeam(): number {
        return this.team;
    }

    DeleteUnits(pos : Pos) {
        for (let i = 0; i < this.board.entities.length; ++i) {
            let entity = this.board.entities[i];
            if (!(entity instanceof Heart) && entity.owner == this && entity.pos.equals(pos)) {
                entity.notifyObserversDeath();
                --i;
            }
        }
    }

    NewUnit(unitType: string, pos: Pos) : boolean {
        let gameUnit: GameUnit = this.whichUnit(unitType);
        if (!gameUnit) {
            return false;
        }
        let unitCost = gameUnit.getUnitCreationInfo().getCost()
        if (this.resources.canAfford(unitCost)) {
            this.resources.spend(unitCost);
            this.addUnitToBoard(gameUnit, pos);
            return true;
        }
        return false;
    }

    addUnitToBoard(gameUnit : GameUnit, pos : Pos) {
        let unit = gameUnit.construct(this, pos);
        this.addUnit(unit);
        this.board.addEntity(unit);
    }

    addUnit(unit : Unit) {
         unit.registerObserver(this);
         this.unitCount++;
    }

    addHeart(heart : Heart) {
        this.board.addEntity(heart);
        this.hearts.addHeart(heart);
    }

    whichUnit(s: string): GameUnit {
        let unitInfo = UNIT_MAP.get(s);
        if (!unitInfo) {
            console.log("unrecognized unit type");
            return null;
        }
        return unitInfo;
    }

    isDead(): Boolean {
        return this.hearts.isDead();
    }

    attemptUpgradeEra(): boolean {
        if (this.era.advanceToNextEra(this.resources) && this.hearts != null) {
            this.heart.updateHeart(this.era.currEra.getHeart());
            return true;
        }
        return false
    }

    atUnitCap() : boolean {
        return this.unitCount >= this.era.getUnitLimit();
    }

    getID(): string {
        return this.id;
    }

    getPlayerSpecificData() : PlayerSpecificData {
        return {
            hearts: this.hearts.getPlayerHeartData(),
            numUnits: this.unitCount,
            maxUnits: this.era.getUnitLimit()
        }
    }
}

export class PlayerProxy extends Player {
    constructor(team: number, pos: Pos, board: Board, id: string, name: string, color: string, startingResources?: ResourceData) {
        super(team, pos, board, id, name, color, startingResources);
    }

    NewUnit(unitType: string, pos: Pos): boolean {
        if (!this.hearts.isInRange(pos) ||
            this.atUnitCap()) {
            return false;
        }
        return super.NewUnit(unitType, pos);
    }
}