import { BoardData, GeneralGameData, PosData, ResourceData } from "../../shared/types.js";
import { RouteReceiver } from "../../shared/routes.js";
import { Game } from "./game.js";
import { GameRoom } from "./game_room.js";
import { emitGameBuilt, emitGameOver, emitGameState, emitJoinSuccess, emitLoadData, emitPlayerWaitingInfo, emitReconnectSuccess, emitSetPosSuccess, emitSpectatorGameState, emitStartSuccess, emitUpgradeEraSuccess, emitWaitingRoomUpdate } from "../../shared/client.js";
import { ReconnectData } from "../../shared/types.js";
import { Pos } from "./pos.js";
import { DefaultEventsMap, Server, Socket } from "socket.io";
import { Player } from "./player.js";
import { ComputerWaitingData, EditComputerData, PlayerWaitingData } from "../../shared/bulider.js";
import { loadData } from "./unit/all_units.js";

export const FRAME_RATE = 30;
const ROOM_CODE = "roomcode";

export interface GameClient {
  id: string;

  emit(ev: string, ...args: any[]): boolean
}

export class ClientHandler extends RouteReceiver {
    private playerId : string | null = null;

    constructor(client: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
        io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
        private room : GameRoom,
        private playerClients : Map<string, Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>>){
        console.log("guy connected");
        super(client, io);
        this.playerClients.set(this.client.id, this.client);
        emitLoadData(this.client, loadData());``
    }

    private getPlayerId() : string {
        return this.playerId ?? this.client.id;
    }

    handleJoinRoom(name : string, color : string){
        let currGame : GameRoom = this.room;
        this.client.join(ROOM_CODE);
        this.playerId = this.client.id;
        const token = currGame.addPlayer(this.client.id, name, this.client, color);
        emitJoinSuccess(this.client, token); // switch screen
        emitPlayerWaitingInfo(this.client, currGame.getPlayerJoinDataById(this.getPlayerId())); // draw info specific to you
        emitWaitingRoomUpdate(this.io, currGame.joinRoomData()); // draw everybody else
        console.log("Client " + this.client.id + " joined");
    }

    handleUpdateSetupPlayer(player: PlayerWaitingData) {
        this.room.updatePlayer(this.getPlayerId(), player);
        emitWaitingRoomUpdate(this.io, this.room.joinRoomData());
        // emitPlayerWaitingInfo(this.client, gameRoom.getPlayerJoinDataById(this.client.id));
    }

    handleAddComputerPlayer(data : ComputerWaitingData) {
        let player = this.room.players.get(this.getPlayerId()); // only the leader can add computers
        if (!player.getIsLeader()) {
            return;
        }
        this.room.addComputerPlayer(this, data.name, data.color, data.team, data.difficulty);
        emitWaitingRoomUpdate(this.io, this.room.joinRoomData());
    }

    handleBoardUpdate(board: BoardData) {
        if (!this.isLeader()) {
            return;
        }
         if (board.width < 10 || board.height < 10) {
            return;
        }
        this.room.boardX = board.width;
        this.room.boardY = board.height;
        emitWaitingRoomUpdate(this.io, this.room.joinRoomData());
    }

    handleResourceUpdate(resources: ResourceData) {
        if (!this.isLeader()) {
            return;
        }
        const gold = Math.max(0, Math.floor(resources.gold));
        const wood = Math.max(0, Math.floor(resources.wood));
        const stone = Math.max(0, Math.floor(resources.stone));
        this.room.startingResources = { gold, wood, stone };
        emitWaitingRoomUpdate(this.io, this.room.joinRoomData());
    }

    handleStartGame() {
        if (!this.room || !this.isLeader()) {
            return;
        }
        this.room.phase = "setup";
        let player = this.room.getPoslessPlayer();
        this.room.currentlyPlacingId = player.getId();
        let data = this.room.setupData(this.getPlayerId());
        data.placingPlayerName = player.getSetupData().name;
        data.placingPlayerColor = player.getSetupData().color;
        emitStartSuccess(this.io, data);
        player.findStartingPos(this.room.setupData(player.getClient().id));
    }

    handleSubmitStartPos(pos: PosData) {
        let gameRoom = this.room;
        if (!gameRoom) {
            return;
        }
        this.submitStartPosWithID(pos, this.getPlayerId());
    }

    submitStartPosWithID(pos : PosData, id : string) {
        let gameRoom = this.room;
        if (!gameRoom) {
            return;
        }
        gameRoom.addPlayerPos(id, Pos.FromPosData(pos));
        emitSetPosSuccess(this.client);
        if (gameRoom.allPlayersHavePos()) {
            this.room.currentlyPlacingId = null;
            emitStartSuccess(this.io, gameRoom.setupData(id));
            let game : Game = gameRoom.buildGame();
            game.players.forEach((player : Player) => {
                let tempClient = this.playerClients.get(player.getID());
                if (!tempClient) {
                    return;
                }
                console.log('emit build success to', player.getID());
                emitGameBuilt(tempClient, player.era.getEraData());
            });
            this.room.phase = "playing";
            console.log('starting game loop');
            const intervalId = setInterval(() => {
                game.mainLoop();
                game.players.forEach((player : Player) => {
                    let tempClient = this.playerClients.get(player.getID());
                    if (!tempClient) {
                        return;
                    }
                    let data = game.gameData(player.getID());
                    if (!data) {
                        return;
                    }
                    emitGameState(tempClient, data);
                });
                game.spectators.forEach((id : string) => {
                    let tempClient = this.playerClients.get(id);
                    if (!tempClient) {
                        return;
                    }
                    let data : GeneralGameData = game.generalGameData();
                    if (!data) {
                        return;
                    }
                    emitSpectatorGameState(tempClient, data);
                })
                if (!game.checkGameStillGoing()) {
                    console.log('game over');
                    clearInterval(intervalId);
                    let winner = "No Winner";
                    if (game.players.length == 1) {
                        let id = game.players[0].getID();
                        if (id) {
                            let p = this.room.players.get(id);
                            winner = p.getJoinData().name;
                        }
                    } else if (game.players.length > 1) {
                        let player = game.players[0];
                        if (id) {
                            winner = "Team " + player.getTeam();
                        }
                    }
                    this.room.reset();
                    emitWaitingRoomUpdate(this.io, this.room.joinRoomData());
                    emitGameOver(this.io, winner);
                } 
            }, 1000 / FRAME_RATE);
            return;
        }
        let nextPlayer = gameRoom.getPoslessPlayer();
        this.room.currentlyPlacingId = nextPlayer.getId();
        let data = gameRoom.setupData(id);
        data.placingPlayerName = nextPlayer.getSetupData().name;
        data.placingPlayerColor = nextPlayer.getSetupData().color;
        emitStartSuccess(this.io, data);
        nextPlayer.findStartingPos(gameRoom.setupData(nextPlayer.getClient().id));
    }

    handleDisconnect(){
        const player = this.room.players.get(this.getPlayerId());
        if (player) {
            console.log('player disconnected:', player.getId());
        } else {
            console.log('unjoined client disconnected');
        }
    }

    handleReconnect(token : string) {
        const playerId = this.room.getPlayerIdByToken(token);
        if (!playerId) {
            console.log('reconnect failed: invalid token');
            return;
        }

        const setupPlayer = this.room.players.get(playerId);
        if (!setupPlayer) {
            console.log('reconnect failed: player not found');
            return;
        }

        // Rebind socket: update playerClients under the original player ID key
        this.playerId = playerId;
        this.playerClients.set(playerId, this.client);
        setupPlayer.setClient(this.client);
        this.client.join(ROOM_CODE);

        console.log('client reconnected as', playerId);

        const data = this.buildReconnectData(playerId);
        if (data) {
            emitReconnectSuccess(this.client, data);
        }
    }

    private buildReconnectData(playerId : string) : ReconnectData | null {
        const phase = this.room.phase;
        switch (phase) {
            case "waiting":
                return {
                    phase: "waiting",
                    waitingData: this.room.joinRoomData(),
                    playerData: this.room.getPlayerJoinDataById(playerId),
                };
            case "setup": {
                const setupData = this.room.setupData(playerId);
                const placingId = this.room.currentlyPlacingId;
                if (placingId) {
                    const placingPlayer = this.room.players.get(placingId);
                    if (placingPlayer) {
                        setupData.placingPlayerName = placingPlayer.getSetupData().name;
                        setupData.placingPlayerColor = placingPlayer.getSetupData().color;
                    }
                }
                return {
                    phase: "setup",
                    setupData,
                    isYourTurn: placingId === playerId,
                };
            }
            case "playing": {
                const game = this.room.getGame();
                if (!game) return null;
                // Check if this player is a spectator (dead)
                if (game.spectators.includes(playerId)) {
                    return {
                        phase: "spectating",
                        spectatorData: game.generalGameData(),
                    };
                }
                const player = game.getPlayer(playerId);
                if (!player) return null;
                return {
                    phase: "playing",
                    eraData: player.era.getEraData(),
                    gameData: game.gameData(playerId),
                };
            }
            case "gameover":
                return {
                    phase: "gameover",
                    winner: "",
                };
            default:
                return null;
        }
    }

    handleSpawnUnit(pos : PosData, unitType : string) {
        let room = this.room;
        if (!room || !room.getGame()) {
            console.log('game is null');
            return;
        }
        let game = room.getGame();
        let player = game.getPlayer(this.getPlayerId());
        if (!player) {
            return;
        }
        player.NewUnit(unitType, new Pos(pos.x, pos.y));
    }

    handleDeleteUnits(pos: PosData) {
        let room = this.room;
        if (!room || !room.getGame()) {
            console.log('game is null');
            return;
        }
        let game = room.getGame();
        let player = game.getPlayer(this.getPlayerId());
        if (!player) {
            return;
        }
        player.DeleteUnits(new Pos(pos.x, pos.y));
    }

    handleEraUpgrade() {
        let room = this.room;
        if (!room || !room.getGame()) {
            console.log('game is null');
            return;
        }
        let game = room.getGame();
        let player = game.getPlayer(this.getPlayerId());
        if (!player) {
            return;
        }
        if (player.attemptUpgradeEra()) {
            emitUpgradeEraSuccess(this.client, player.era.getEraData());
        }
    }

    handleEditComputerPlayer(data : EditComputerData) {
        if (!this.isLeader()) return;
        this.room.editComputerPlayer(data.id, data);
        emitWaitingRoomUpdate(this.io, this.room.joinRoomData());
    }

    handleRemoveComputerPlayer(id : string) {
        if (!this.isLeader()) return;
        this.room.removeComputerPlayer(id);
        emitWaitingRoomUpdate(this.io, this.room.joinRoomData());
    }

    handleBackgroundUpdate(filename: string) {
        if (!this.isLeader()) return;
        this.room.updateBackground(filename);
        emitWaitingRoomUpdate(this.io, this.room.joinRoomData());
    }

    isLeader() : boolean {
        return this.room.isLeader(this.getPlayerId());
    }
}