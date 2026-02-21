import { GameData, UnitData, PosData, BoardData, ResourceData, EraData, PlayerSpecificData, GeneralGameData, GeneralHeartData } from '../../shared/types.js';
import { Board } from "./board.js";
import { Player } from "./player.js";
import { Unit } from "./unit/unit.js";

export class Game {
    public spectators : string[] = []; // client ids
    constructor(private _players : Player[], private board : Board) {
        this._players.push()
    }

    gameLoop() {
        while (this.checkGameStillGoing()) {
            this.mainLoop();
        }
    }

    mainLoop() {
        this.move();
        this.playerTurns();
        this.arePlayersStillAlive();
    }

    move() {
        this.board.entities.forEach((entity : Unit) => {
            entity.move(this.board);
        })
    }

    playerTurns() {
        this._players.forEach((player : Player) => {
            player.doTurn();
        })
    }

    arePlayersStillAlive() {
        for (let i = 0; i < this.players.length; ++i) {
            if (this.players[i].isDead()) {
                this.removeAllUnitsFromAPlayer(this.players[i]);
                this.spectators.push(this.players[i].getID());
                this.players.splice(i, 1);
                i--;
            }
        }
    }

    removeAllUnitsFromAPlayer(player : Player) {
        for (let i = 0; i < this.board.entities.length; ++i) {
            if (this.board.entities[i].owner == player) {
                this.board.entities[i].notifyObserversDeath();
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
s
    get players() {
        return this._players
    }

    gameData(playerID : string) : GameData {
        let player = this.getPlayer(playerID);
        if (!player) {
            return null;
        }
        let heart : PlayerSpecificData = player.getPlayerSpecificData();
        let resources : ResourceData = player.resources.getResourceData();
        let era : EraData = player.era.getEraData();
        const gameData : GameData = {
            playerData: heart,
            resources: resources, 
            era: era,
            generalData: this.generalGameData(),
        };
        return gameData;
    }

    generalGameData() : GeneralGameData {
        let board : BoardData = {width: this.board.width, height: this.board.height};
        let units : UnitData[] = [];
        this.board.entities.forEach((unit : Unit) => {
            const unitPos : PosData = unit.pos.getPosData();
            const unitData : UnitData = {
                name: unit.name,
                pos : unitPos,
                team: unit.team,
                color: unit.color,
                playerColor: unit.owner.getColor(),
                hp : unit.hp,
                totalHP: unit.totalHP,
                rangedData: unit.getRangedData(),
            };
            units.push(unitData);
        })
        const hearts : GeneralHeartData[] = [];
        this.players.forEach((player) => {
            player.hearts.getPlayerHeartData().forEach((heartData) => {
                hearts.push({
                    pos: heartData.pos,
                    radius: heartData.radius,
                    playerColor: player.getColor(),
                });
            });
        });

        const gameData : GeneralGameData = {
            units: units,
            board: board,
            hearts: hearts,
        };
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