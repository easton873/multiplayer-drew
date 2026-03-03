import { Board } from "../board.js";
import { FIFTH_ERA_NAME, FOURTH_ERA_NAME, SECOND_ERA_NAME, SIXTH_ERA_NAME, STARTING_ERA_NAME, THIRD_ERA_NAME } from "../era.js";
import { PlayerProxy } from "../player.js";
import { Pos } from "../pos.js";
import { Resources } from "../resources.js";
import { ResourceData } from "../../../shared/types.js";
import { GameUnit } from "../unit/game_unit.js";
import { Unit } from "../unit/unit.js";
import { getRandomIndex } from "../utils.js";

export abstract class BaseComputerPlayer extends PlayerProxy {
    protected territory : Pos[] = [];
    constructor(team: number, pos: Pos, board: Board, id: string, name: string, color: string, startingResources?: ResourceData) {
        super(team, pos, board, id, name, color, startingResources);
        this.rebuildTerritory();
    }
    doTurn(): void {
        switch(this.era.getEraData().eraName) {
            case STARTING_ERA_NAME:
                this.firstEra();
                return;
            case SECOND_ERA_NAME:
                this.secontEra();
                return;
            case THIRD_ERA_NAME:
                this.thirdEra();
                return;
            case FOURTH_ERA_NAME:
                this.fourthEra();
                return;
            case FIFTH_ERA_NAME:
                this.fifthEra();
                return;
            case SIXTH_ERA_NAME:
                this.sixthEra();
                return;
            default:
                return;
        }
    }

    abstract firstEra();
    abstract secontEra();
    abstract thirdEra();
    abstract fourthEra();
    abstract fifthEra();
    abstract sixthEra();

    placeUnit(unit : GameUnit, pos : Pos, num : number = 1) : boolean {
        for (let i = 0; i < num; i++) {
            if (!this.NewUnit(unit.getName(), pos.clone())) {
                return false;
            }
        }
        return true;
    }
    
    countUnit(gameUnit : GameUnit) : number {
        let count = 0;
        this.board.entities.forEach((unit : Unit) => {
            if (unit.owner == this && unit.name == gameUnit.getName()) {
                count++
            }
        });
        return count;
    }

    maintainCountOfUnits(unit : GameUnit, targetCount : number, savings : Resources = new Resources(0, 0, 0)) {
        if (this.countUnit(unit) < targetCount) {
            savings.add(unit.getUnitCreationInfo().getCost())
            if (this.resources.canAfford(savings)) {
                this.placeUnit(unit, this.randomPosInTerritory());
            }
        }
    }

    maintainCountOfUnitsV2(unit : GameUnit, targetCount : number) : boolean {
        if (this.countUnit(unit) < targetCount) {
            for (let i = 0; i < targetCount; i++) {
                if (!this.placeUnit(unit, this.randomPosInTerritory())) {
                    return false;
                }
            }
        }
        return true;
    }

    protectBase(defenseUnit : GameUnit) {
        this.board.entities.forEach((unit : Unit) => {
            if (unit.team != this.getTeam() && this.heart.isInRange(unit.pos)) {
                this.placeUnit(defenseUnit, unit.pos, 3);
            }
        })
    }

    advanceEra() {
        if (this.era.canAffordNextEra(this.resources)) {
            this.era.advanceToNextEra(this.resources);
            this.rebuildTerritory();
        }
    }

    spamUnits(unit : GameUnit, num : number) {
        let cost : Resources = new Resources(0, 0, 0);
        for (let i = 0; i < num; i++) {
            cost.add(unit.getUnitCreationInfo().getCost());
        }
        if (this.resources.canAfford(cost)) {
            this.placeUnit(unit, this.heart.pos.clone(), num);
        }
    }

    rebuildTerritory() {
        let spots : Pos[] = [];
        for (let y = 0; y < this.board.height; y++) {
            for (let x = 0; x < this.board.width; x++) {
                let pos : Pos = new Pos(x, y);
                if (this.hearts.isInRange(pos)) {
                    spots.push(pos);
                }
            }
        }
        this.territory = spots;
    }

    randomPosInTerritory() : Pos {        
        return getRandomIndex(this.territory);
    }
}