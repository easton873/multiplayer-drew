import { GameData, UnitData, PosData, BoardData, ResourceData, EraData } from '../../shared/types.js';
import { Board } from "./board.js";
import { Era } from './era.js';
import { Player } from "./player.js";
import { Pos } from './pos.js';
import { Unit } from "./unit/unit.js";

export class Game {
    constructor(private _players : Player[], private board : Board) {}

    gameLoop() {
        while (this.checkGameStillGoing()) {
            this.mainLoop();
        }
    }

    mainLoop() {
        this.move();
        this.arePlayersStillAlive();
    }

    move() {
        this.board.entities.forEach((entity : Unit) => {
            entity.move(this.board);
        })
    }

    arePlayersStillAlive() {
        for (let i = 0; i < this.players.length; ++i) {
            if (this.players[i].isDead()) {
                this.removeAllUnitsFromAPlayer(this.players[i]);
                this.players.splice(i, 1);
                i--;
            }
        }
    }

    removeAllUnitsFromAPlayer(player : Player) {
        for (let i = 0; i < this.board.entities.length; ++i) {
            if (this.board.entities[i].team == player) {
                this.board.entities[i].notifyObserversDeath()
                --i; // the board is one of the observers and is going to remove it
            }
        }
    }

    checkGameStillGoing() : boolean {
        if (this.players.length <= 1) {
            return false;
        }
        return true;
    }

    get players() {
        return this._players
    }

    gameData(playerID : string) : GameData {
        let player = this.getPlayer(playerID);
        if (!player) {
            return null;
        }
        let board : BoardData = {width: this.board.width, height: this.board.height}
        let units : UnitData[] = [];
        let resources : ResourceData = player.resources.getResourceData();
        let era : EraData = player.era.getEraData();
        this.board.entities.forEach((unit : Unit) => {
            const unitPos : PosData = unit.pos.getPosData();
            const unitData : UnitData = {pos : unitPos, team: unit.team.getTeam()};
            units.push(unitData);
        })
        const gameData : GameData = {units: units, board: board, resources: resources, era: era};
        return gameData;
    }

    getPlayer(id : string) : Player {
        for (let i = 0; i < this._players.length; ++i) {
            if (this._players[i].getID() == id) {
                return this._players[i]
            }
        }
        return null;
    }
}