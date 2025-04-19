import { GameSetupData, PlayerJoinData, PlayerSetupData } from "../../shared/bulider.js";
import { Game } from "./game.js";
import { Pos } from "./pos.js";
import { Board } from "./board.js";
import { Player } from "./player.js";

export class GameRoom {
    public players : Map<string, SetupPlayer> = new Map<string, SetupPlayer>; // player id to player
    constructor(public roomCode : string){}

    addPlayer(id : string, name : string) {
        this.players.set(id, new SetupPlayer(id, name));
    }

    addPlayerPos(id : string, pos : Pos) {
        this.players.get(id).setPos(pos);
        
    }

    joinRoomData() : GameSetupData {
        return {roomCode: this.roomCode, players: this.getPlayerJoinData()};
    }

    private getPlayerJoinData() : PlayerJoinData[] {
        let players : PlayerJoinData[] = [];
        this.players.forEach((player : SetupPlayer) => {
            players.push(player.getJoinData());
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

    getJoinData() : PlayerJoinData {
        return {ready: true, name: this.name};
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