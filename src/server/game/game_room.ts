import { GameWaitingData, PlayerWaitingData, PlayerSetupData, GameSetupData } from "../../shared/bulider.js";
import { Game } from "./game.js";
import { Pos } from "./pos.js";
import { Board } from "./board.js";
import { Player } from "./player.js";

export class GameRoom {
    public players : Map<string, SetupPlayer> = new Map<string, SetupPlayer>; // player id to player
    public boardX : number = 100;
    public boardY : number = 100;
    constructor(public roomCode : string){}

    addPlayer(id : string, name : string) {
        this.players.set(id, new SetupPlayer(id, name));
    }

    addPlayerPos(id : string, pos : Pos) {
        this.players.get(id).setPos(pos);
        
    }

    joinRoomData() : GameWaitingData {
        return {roomCode: this.roomCode, players: this.getPlayerJoinData()};
    }

    setupData(currentPlayer : boolean) : GameSetupData {
        return {boardX: this.boardX, boardY: this.boardY, players: this.getPlayerSetupData(), currentPlayer: currentPlayer};
    }

    setBoardXY(width : number, height : number) {
        this.boardX = width;
        this.boardY = height;
    }

    private getPlayerJoinData() : PlayerWaitingData[] {
        let players : PlayerWaitingData[] = [];
        this.players.forEach((player : SetupPlayer) => {
            players.push(player.getJoinData());
        });
        return players;
    }

    private getPlayerSetupData() : PlayerSetupData[] {
        let players : PlayerSetupData[] = [];
        this.players.forEach((player : SetupPlayer) => {
            players.push(player.getSetupData());
        });
        return players;
    }

    buildGame() : Game {
        let board : Board = new Board(100, 100);
        let players : Player[] = [];
        this.players.forEach((player : SetupPlayer) => {
            players.push(player.createPlayer(board));
        })
        return new Game(players, board);
    }
}

class SetupPlayer {
    private pos : Pos
    constructor(private id : string, private name: string) {}

    setPos(pos : Pos) {
        this.pos = pos;
    }

    getJoinData() : PlayerWaitingData {
        return {ready: true, name: this.name};
    }

    getSetupData() : PlayerSetupData {
        return {name : this.name, pos : this.pos};
    }

    getPlayerSetupData() : PlayerSetupData {
        return {name: this.name, pos: this.pos.getPosData()};
    }

    createPlayer(board : Board) : Player {
        return new Player(this.pos, board, this.id, this.name);
    }
}

export function randomRoomID(length: number) : string {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let code = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * alphabet.length);
      code += alphabet[randomIndex];
    }
    return code;
  }