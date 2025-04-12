import { Board } from "./board";
import { GameData, UnitData } from "./game_data";
import { Player } from "./player";
import { Unit } from "./unit/unit";

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
        let units : UnitData[] = [];
        this.board.entities.forEach((unit : Unit) => {
            units.push(new UnitData(unit.pos));
        })
        return new GameData(units);
    }
}