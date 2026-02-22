import { BoardData, GeneralGameData, PosData } from "../../shared/types.js";
import { RouteReceiver } from "../../shared/routes.js";
import { Game } from "./game.js";
import { GameRoom } from "./game_room.js";
import { emitGameBuilt, emitGameOver, emitGameState, emitJoinSuccess, emitLoadData, emitPlayerWaitingInfo, emitSetPosSuccess, emitSpectatorGameState, emitStartSuccess, emitUpgradeEraSuccess, emitWaitingRoomUpdate } from "../../shared/client.js";
import { Pos } from "./pos.js";
import { DefaultEventsMap, Server, Socket } from "socket.io";
import { Player } from "./player.js";
import { ComputerWaitingData, EditComputerData, PlayerWaitingData } from "../../shared/bulider.js";
import { loadData } from "./unit/all_units.js";

const FRAME_RATE = 30;
const ROOM_CODE = "roomcode";

export interface GameClient {
  id: string;

  emit(ev: string, ...args: any[]): boolean
}

export class ClientHandler extends RouteReceiver {
    constructor(client: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>, 
        io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
        private room : GameRoom,
        private playerClients : Map<string, Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>>){
        console.log("guy connected");
        super(client, io);
        this.playerClients.set(this.client.id, this.client);
        emitLoadData(this.client, loadData());``
    }

    handleJoinRoom(name : string, color : string){
        let currGame : GameRoom = this.room;
        this.client.join(ROOM_CODE);
        currGame.addPlayer(this.client.id, name, this.client, color);
        emitJoinSuccess(this.client); // switch screen
        emitPlayerWaitingInfo(this.client, currGame.getPlayerJoinDataById(this.client.id)); // draw info specific to you
        emitWaitingRoomUpdate(this.io, currGame.joinRoomData()); // draw everybody else
        console.log("Client " + this.client.id + " joined");
    }

    handleUpdateSetupPlayer(player: PlayerWaitingData) {
        this.room.updatePlayer(this.client.id, player);
        emitWaitingRoomUpdate(this.io, this.room.joinRoomData());
        // emitPlayerWaitingInfo(this.client, gameRoom.getPlayerJoinDataById(this.client.id));
    }

    handleAddComputerPlayer(data : ComputerWaitingData) {
        let player = this.room.players.get(this.client.id); // only the leader can add computers
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

    handleStartGame() {
        if (!this.room || !this.isLeader()) {
            return;
        }
        let player = this.room.getPoslessPlayer();
        let data = this.room.setupData(this.client.id);
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
        this.submitStartPosWithID(pos, this.client.id);
    }

    submitStartPosWithID(pos : PosData, id : string) {
        let gameRoom = this.room;
        if (!gameRoom) {
            return;
        }
        gameRoom.addPlayerPos(id, Pos.FromPosData(pos));
        emitSetPosSuccess(this.client);
        if (gameRoom.allPlayersHavePos()) {
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
        let data = gameRoom.setupData(id);
        data.placingPlayerName = nextPlayer.getSetupData().name;
        data.placingPlayerColor = nextPlayer.getSetupData().color;
        emitStartSuccess(this.io, data);
        nextPlayer.findStartingPos(gameRoom.setupData(nextPlayer.getClient().id));
    }

    handleDisconnect(){
        console.log('client disconnected');
    }

    handleSpawnUnit(pos : PosData, unitType : string) {
        let room = this.room;
        if (!room || !room.getGame()) {
            console.log('game is null');
            return;
        }
        let game = room.getGame();
        let player = game.getPlayer(this.client.id);
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
        let player = game.getPlayer(this.client.id);
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
        let player = game.getPlayer(this.client.id);
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

    isLeader() : boolean {
        return this.room.isLeader(this.client.id);
    }
}