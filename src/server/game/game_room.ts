import { GameWaitingData, PlayerWaitingData, PlayerSetupData, GameSetupData } from "../../shared/bulider.js";
import { Game } from "./game.js";
import { Pos } from "./pos.js";
import { Board } from "./board.js";
import { Player } from "./player.js";
import { DefaultEventsMap, Socket } from "socket.io";

export class GameRoom {
    public players : Map<string, SetupPlayer> = new Map<string, SetupPlayer>; // player id to player
    public boardX : number = 100;
    public boardY : number = 100;
    private game : Game;
    constructor(public roomCode : string){}

    addPlayer(id : string, name : string, client : Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>) {
        this.players.set(id, new SetupPlayer(id, name, client));
    }

    addPlayerPos(id : string, pos : Pos) {
        this.players.get(id).setPos(pos);
        
    }

    joinRoomData() : GameWaitingData {
        return {roomCode: this.roomCode, players: this.getPlayerJoinData()};
    }

    setupData() : GameSetupData {
        return {boardX: this.boardX, boardY: this.boardY, players: this.getPlayerSetupData()};
    }

    setBoardXY(width : number, height : number) {
        this.boardX = width;
        this.boardY = height;
    }

    allPlayersHavePos() : boolean {
        return this.getPoslessPlayers().length == 0;
    }

    getPoslessPlayer() : SetupPlayer {
        let players = this.getPoslessPlayers();
        if (players.length == 0) {
            throw new Error("no posless players");
        }
        return this.getRandomPlayer(players);
    }

    private getPoslessPlayers() : SetupPlayer[] {
        let players : SetupPlayer[] = [];
        this.players.forEach((player : SetupPlayer) => {
            if (player.getPos() == null) {
                players.push(player);
            }
        });
        return players;
    }

    private getRandomPlayer(players : SetupPlayer[]) : SetupPlayer {
        return players[Math.floor(Math.random() * players.length)];
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
        this.game = new Game(players, board);
        return this.game;
    }

    getGame() : Game {
        return this.game;
    }
}

class SetupPlayer {
    private pos : Pos = null;
    constructor(private id : string, private name: string, private client : Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>) {}

    getClient() : Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any> {
        return this.client;
    }

    getId() : string {
        return this.id;
    }

    getPos() : Pos {
        return this.pos;
    }

    setPos(pos : Pos) {
        this.pos = pos;
    }

    getJoinData() : PlayerWaitingData {
        return {ready: true, name: this.name};
    }

    getSetupData() : PlayerSetupData {
        return {name : this.name, pos : this.pos ? this.pos.getPosData() : null};
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