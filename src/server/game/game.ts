import { GameData, UnitData, PosData, BoardData } from '../../shared/types.js';
import { Board } from "./board.js";
import { Player } from "./player.js";
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

    gameData() : GameData {
        let board : BoardData = {width: this.board.width, height: this.board.height}
        let units : UnitData[] = [];
        this.board.entities.forEach((unit : Unit) => {
            const unitPos : PosData = {x: unit.pos.x, y: unit.pos.y}
            const unitData : UnitData = {pos : unitPos};
            units.push(unitData);
        })
        const gameData : GameData = {units: units, board: board}
        return gameData;
    }
}