import { GameWaitingData, PlayerWaitingData, PlayerSetupData, GameSetupData } from "../../shared/bulider.js";
import { Game } from "./game.js";
import { Pos } from "./pos.js";
import { Board } from "./board.js";
import { Player, PlayerProxy } from "./player.js";
import { DefaultEventsMap, Socket } from "socket.io";

export class GameRoom {
    public players : Map<string, SetupPlayer> = new Map<string, SetupPlayer>; // player id to player
    public boardX : number = 100;
    public boardY : number = 100;
    private game : Game;
    constructor(){}

    reset() {
        this.players.forEach((player : SetupPlayer) => {
            player.reset();
        });
    }

    addPlayer(id : string, name : string, client : Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>, color : string) {
        let isLeader : boolean = this.players.size == 0; // first to join is leader
        this.players.set(id, new SetupPlayer(id, name, client, color, isLeader));
    }

    updatePlayer(id : string, data : PlayerWaitingData) {
        let player = this.players.get(id);
        if (!player) {
            return;
        }
        player.update(data);
    }

    addPlayerPos(id : string, pos : Pos) {
        this.players.get(id).setPos(pos);
        
    }

    getPlayerJoinDataById(id : string) : PlayerWaitingData {
        return this.players.get(id).getJoinData();
    }

    joinRoomData() : GameWaitingData {
        return {players: this.getPlayerJoinData(), board: {boardX: this.boardX, boardY: this.boardY}};
    }

    setupData(id : string) : GameSetupData {
        let player = this.players.get(id);
        if (!player) {
            return {boardX: this.boardX, boardY: this.boardY, players: this.getPlayerSetupData(), currPlayer: null};
        }
        return {boardX: this.boardX, boardY: this.boardY, players: this.getPlayerSetupData(), currPlayer: player.getSetupData()};
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

    isLeader(id : string) : boolean {
        let player = this.players.get(id);
        if (!player) {
            return false;
        }
        return player.getIsLeader();
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
        let board : Board = new Board(this.boardX, this.boardY);
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

export class SetupPlayer {
    static DefaultTeam = -1;
    private team : number = null;
    private pos : Pos = null;
    ready : boolean = true;
    constructor(private id : string, private name: string, private client : Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>, private color : string, private isLeader : boolean) {}

    reset() {
        SetupPlayer.DefaultTeam = -1;
        this.team = null;
        this.pos = null
    }

    update(other : PlayerWaitingData) {
        this.team = Math.abs(other.team);
        this.color = other.color;
        this.ready = other.ready;
    }

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

    getIsLeader() : boolean {
        return this.isLeader;
    }

    getJoinData() : PlayerWaitingData {
        return {ready: this.ready, name: this.name, leader: this.isLeader, color: this.color, team: this.team};
    }

    getSetupData() : PlayerSetupData {
        return {name : this.name, pos : this.pos ? this.pos.getPosData() : null, color: this.color};
    }

    createPlayer(board : Board) : Player {
        if (this.team == null) {
            this.team = SetupPlayer.DefaultTeam--;
        }
        return new PlayerProxy(this.team, this.pos, board, this.id, this.name, this.color);
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