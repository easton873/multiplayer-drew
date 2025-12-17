import { GameWaitingData, PlayerWaitingData, PlayerSetupData, GameSetupData } from "../../shared/bulider.js";
import { Game } from "./game.js";
import { Pos } from "./pos.js";
import { Board } from "./board.js";
import { Player, PlayerProxy } from "./player.js";
import { DefaultEventsMap, Socket } from "socket.io";
import { ComputerPlayer, WinnerComputerPlayer } from "./computer/basics.js";
import { ClientHandler, GameClient } from "./client_handler.js";
import { emitYourTurn } from "../../shared/client.js";
import { ComputerDifficulties, CreateComputer } from "./computer/factory.js";
// import { ComputerNames } from "./computer/factory.js";

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
    
    addComputerPlayer(handler : ClientHandler, name : string, color : string, team : number, difficulty : string) {
        let client = new ComputerClient()
        let id = client.id;
        let computer = new SetupComputerPlayer(handler, id, name, client, color, false, difficulty);
        computer.updateTeam(team);
        this.players.set(id, computer);
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
        return {players: this.getPlayerJoinData(), board: {boardX: this.boardX, boardY: this.boardY}, computerDifficulties: ComputerDifficulties};
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
    protected team : number = null;
    protected pos : Pos = null;
    ready : boolean = true;
    constructor(protected id : string, protected name: string, private client : GameClient, protected color : string, private isLeader : boolean) {}

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

    updateTeam(team : number) {
        this.team = team;
    }

    getClient() : GameClient {
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

    public findStartingPos(data : GameSetupData) {
        emitYourTurn(this.client, data);
    }

    createPlayer(board : Board) : Player {
        if (this.team == null) {
            this.team = SetupPlayer.DefaultTeam--;
        }
        return new PlayerProxy(this.team, this.pos, board, this.id, this.name, this.color);
    }
}

class ComputerClient implements GameClient {
    public id : string;
    private static next_id : number = 0;
    constructor() {
        this.id = ComputerClient.next_id.toString();
        ComputerClient.next_id++;
    }
    emit(ev: string, ...args: any[]): boolean {
        return true;
    }
}

class SetupComputerPlayer extends SetupPlayer {
    constructor(protected handler : ClientHandler, id : string, name: string, client : GameClient, color : string, isLeader : boolean, private difficulty : string) {
        super(id, name, client, color, isLeader);
    }
    createPlayer(board : Board) : Player {
        if (this.team == null) {
            this.team = SetupPlayer.DefaultTeam--;
        }
        return CreateComputer(this.difficulty, this.team, this.pos, board, this.id, this.name, this.color)
    }

    public findStartingPos(data: GameSetupData): void {
        let pos = new Pos(0, 0);
        let poses : Pos[] = [];
        data.players.forEach((player : PlayerSetupData) => {
            if (player.pos != null) {
                poses.push(new Pos(player.pos.x, player.pos.y));
            }
        });
        if (poses.length > 0) {
            pos = findFurthest(data.boardX, data.boardY, poses)
        }
        this.handler.submitStartPosWithID(pos, this.id);
    }
}

export function findFurthest(boardX : number, boardY : number, players : Pos[]) : Pos {
    let maxDist = NaN;
    let bestSpot : Pos = null;
    for (let y = 1; y < boardY; y++) {
        for (let x = 1; x < boardX; x++) {
            let pos = new Pos(x, y);
            let minDistToplayer : number = NaN;
            for (let i = 0; i < players.length; i++) {
                let dist = players[i].distanceTo(pos);
                if (Number.isNaN(minDistToplayer)) {
                    minDistToplayer = dist
                } else if (dist < minDistToplayer) {
                    minDistToplayer = dist;
                }
            }
            if (Number.isNaN(maxDist)) {
                maxDist = minDistToplayer;
                bestSpot = pos;
            } else if (minDistToplayer > maxDist) {
                maxDist = minDistToplayer;
                bestSpot = pos;
            }
        }
    }
    return bestSpot;
}

function getRandomInt(min: number, max: number): number {
  // Ensure min and max are treated as integers for the calculation
  min = Math.ceil(min);
  max = Math.floor(max);
  // The formula ensures both min and max are included in the possible results
  return Math.floor(Math.random() * (max - min + 1)) + min;
}