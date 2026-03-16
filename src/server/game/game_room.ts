import { EditComputerData, GameWaitingData, PlayerWaitingData, PlayerSetupData, GameSetupData } from "../../shared/bulider.js";
import type { RoomPhase } from "../../shared/types.js";
import type { RoomState } from "./room_state.js";
import { WaitingState } from "./state/waiting.js";
import { randomUUID } from "crypto";
import { Pos } from "./pos.js";
import { Board } from "./board.js";
import { Player, PlayerProxy } from "./player.js";
import { DefaultEventsMap, Socket } from "socket.io";
import { ClientHandler, GameClient } from "./client_handler.js";
import { emitYourTurn } from "../../shared/client.js";
import { ComputerDifficulties, CreateComputer } from "./computer/factory.js";
import { DEFAULT_BG_IMAGE_FILE, ResourceData } from "../../shared/types.js";
import { backgrounds } from "./data/backgrounds.js";

export class GameRoom {
    public players : Map<string, SetupPlayer> = new Map<string, SetupPlayer>; // player id to player
    public boardX : number = 100;
    public boardY : number = 100;
    public startingResources : ResourceData = { gold: 50, wood: 0, stone: 0 };
    public background : string = DEFAULT_BG_IMAGE_FILE;
    public state : RoomState = new WaitingState();
    public tokenToPlayerId : Map<string, string> = new Map();
    constructor(){}

    get phase() : RoomPhase {
        return this.state.phase;
    }

    setState(state : RoomState) {
        this.state = state;
    }

    reset() {
        this.state = new WaitingState(this, true);
    }

    addPlayer(id : string, name : string, client : Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>, color : string) : string {
        let isLeader : boolean = this.players.size == 0; // first to join is leader
        this.players.set(id, new SetupPlayer(id, name, client, color, isLeader));
        const token = randomUUID();
        this.tokenToPlayerId.set(token, id);
        return token;
    }
    
    addComputerPlayer(handler : ClientHandler, name : string, color : string, team : number, difficulty : string) {
        let client = new ComputerClient()
        let id = client.id;
        let computer = new SetupComputerPlayer(handler, id, name, client, color, false, difficulty);
        computer.updateTeam(team);
        this.players.set(id, computer);
    }

    editComputerPlayer(id : string, data : EditComputerData) {
        let player = this.players.get(id);
        if (!player || !player.getJoinData().isComputer) {
            return;
        }
        (player as SetupComputerPlayer).updateComputerData(data.name, data.color, data.team, data.difficulty);
    }

    getPlayerJoinDataById(id : string) : PlayerWaitingData {
        return this.players.get(id).getJoinData();
    }

    joinRoomData() : GameWaitingData {
        return {players: this.getPlayerJoinData(), board: {boardX: this.boardX, boardY: this.boardY}, computerDifficulties: ComputerDifficulties, startingResources: this.startingResources, backgrounds: backgrounds, background: this.background};
    }

    setupData(id : string) : GameSetupData {
        let player = this.players.get(id);
        if (!player) {
            return {boardX: this.boardX, boardY: this.boardY, players: this.getPlayerSetupData(), currPlayer: null, placingPlayerName: "", placingPlayerColor: "", background: this.background};
        }
        return {boardX: this.boardX, boardY: this.boardY, players: this.getPlayerSetupData(), currPlayer: player.getSetupData(), placingPlayerName: "", placingPlayerColor: "", background: this.background};
    }

    getPlayerIdByToken(token : string) : string | undefined {
        return this.tokenToPlayerId.get(token);
    }

    isLeader(id : string) : boolean {
        let player = this.players.get(id);
        if (!player) {
            return false;
        }
        return player.getIsLeader();
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

}

export class SetupPlayer {
    static DefaultTeam = -1;
    protected team : number = null;
    protected pos : Pos = null;
    ready : boolean = true;
    constructor(protected id : string, protected name: string, private client : GameClient, protected color : string, private isLeader : boolean) {}

    reset() {
        SetupPlayer.DefaultTeam = -1;
        if (this.team !== null && this.team < 0) {
            this.team = null;
        }
        this.pos = null;
    }

    update(other : PlayerWaitingData) {
        this.name = other.name;
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

    setClient(client : GameClient) {
        this.client = client;
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
        return {ready: this.ready, name: this.name, leader: this.isLeader, color: this.color, team: this.team, id: this.id, isComputer: false};
    }

    getSetupData() : PlayerSetupData {
        return {name : this.name, pos : this.pos ? this.pos.getPosData() : null, color: this.color, team: this.team};
    }

    public findStartingPos(data : GameSetupData) {
        emitYourTurn(this.client, data);
    }

    createPlayer(board : Board, startingResources?: ResourceData) : Player {
        if (this.team == null) {
            this.team = SetupPlayer.DefaultTeam--;
        }
        return new PlayerProxy(this.team, this.pos, board, this.id, this.name, this.color, startingResources);
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

    updateComputerData(name : string, color : string, team : number | null, difficulty : string) {
        this.name = name;
        this.color = color;
        this.team = team;
        this.difficulty = difficulty;
    }

    getJoinData() : PlayerWaitingData {
        return {ready: this.ready, name: this.name, leader: this.getIsLeader(), color: this.color, team: this.team, id: this.id, isComputer: true, difficulty: this.difficulty};
    }

    createPlayer(board : Board, startingResources?: ResourceData) : Player {
        if (this.team == null) {
            this.team = SetupPlayer.DefaultTeam--;
        }
        return CreateComputer(this.difficulty, this.team, this.pos, board, this.id, this.name, this.color, startingResources)
    }

    public findStartingPos(data: GameSetupData): void {
        let pos = new Pos(1, 1);

        if (this.team != null && this.team > 0) {
            const teammatePos = data.players.find(p => p.team === this.team && p.pos != null);
            if (teammatePos) {
                this.handler.submitStartPosWithID(new Pos(teammatePos.pos.x, teammatePos.pos.y), this.id);
                return;
            }
        }

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
