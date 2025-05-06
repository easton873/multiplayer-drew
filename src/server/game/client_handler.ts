import { PosData } from "../../shared/types.js";
import { CREATE_ROOM_KEY, DISCONNECT_KEY, emitUpdateSetupPlayer, JOIN_ROOM_KEY, RouteReceiver, START_GAME_KEY, UNIT_SPAWN_KEY, UPGRADE_ERA_KEY } from "../../shared/routes.js";
import { Era } from "./era.js";
import { Game } from "./game.js";
import { GameRoom, randomRoomID } from "./game_room.js";
import { emitGameBuilt, emitGameState, emitJoinSuccess, emitPlayerWaitingInfo, emitSetPosSuccess, emitStartSuccess, emitUpgradeEraSuccess, emitWaitingRoomUpdate, emitYourTurn, START_SUCCESS_KEY } from "../../shared/client.js";
import { Pos } from "./pos.js";
import { DefaultEventsMap, Server, Socket } from "socket.io";
import { Player } from "./player.js";
import { PlayerWaitingData } from "../../shared/bulider.js";

const FRAME_RATE = 10;

export class ClientHandler extends RouteReceiver {
    constructor(client: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>, 
        io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>, 
        rooms : Map<string, GameRoom>, 
        playerRoomLookup : Map<string, GameRoom>, 
        private playerClients : Map<string, Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>>){
        console.log("guy connected");
        super(client, io, rooms, playerRoomLookup);
        this.playerClients.set(this.client.id, this.client);
    }   

    handleCreateRoom(name : string, color : string) {
        console.log("creating game");
        let roomCode = randomRoomID(4);
        this.rooms.set(roomCode, new GameRoom(roomCode));
        this.handleJoinRoom(roomCode, name, color); // TODO make a create room success
    }

    handleJoinRoom(roomCode : string, name : string, color : string){
        roomCode = roomCode.toUpperCase(); // make case insensitive
        let currGame : GameRoom = this.rooms.get(roomCode);
        if (!currGame) {
            return;
        }
        this.playerRoomLookup.set(this.client.id, currGame);
        this.client.join(roomCode);
        currGame.addPlayer(this.client.id, name, this.client, color);
        emitJoinSuccess(this.io, roomCode, currGame.joinRoomData());
        emitPlayerWaitingInfo(this.client, currGame.getPlayerJoinDataById(this.client.id));
        console.log("Client " + this.client.id + " joined room " + roomCode);
    }

    handleUpdateSetupPlayer(player: PlayerWaitingData) {
        let gameRoom = this.playerRoomLookup.get(this.client.id);
        if (!gameRoom) {
            return;
        }
        gameRoom.updatePlayer(this.client.id, player);
        emitWaitingRoomUpdate(this.io, gameRoom.roomCode, gameRoom.joinRoomData());
        // emitPlayerWaitingInfo(this.client, gameRoom.getPlayerJoinDataById(this.client.id));
    }

    handleStartGame() {
        let gameRoom = this.playerRoomLookup.get(this.client.id);
        if (!gameRoom || !gameRoom.isLeader(this.client.id)) {
            return;
        }
        emitStartSuccess(this.io, gameRoom.roomCode, gameRoom.setupData(this.client.id));
        let player = gameRoom.getPoslessPlayer().getClient()
        emitYourTurn(player, gameRoom.setupData(player.id));
    }

    handleSubmitStartPos(pos: PosData) {
        let gameRoom = this.playerRoomLookup.get(this.client.id);
        if (!gameRoom) {
            return;
        }
        gameRoom.addPlayerPos(this.client.id, Pos.FromPosData(pos));
        emitSetPosSuccess(this.client);
        emitStartSuccess(this.io, gameRoom.roomCode, gameRoom.setupData(this.client.id));
        if (gameRoom.allPlayersHavePos()) {
            let game : Game = gameRoom.buildGame();
            game.players.forEach((player : Player) => {
                let tempClient = this.playerClients.get(player.getID());
                if (!tempClient) {
                    return;
                }
                console.log('emit build success to ', player.getID());
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
                    emitGameState(tempClient, data, player.getTeam());
                });
                if (!game.checkGameStillGoing()) {
                    console.log('game over');
                    clearInterval(intervalId);
                } 
            }, 1000 / FRAME_RATE);
            return;
        }
        let nextPlayer = gameRoom.getPoslessPlayer().getClient()
        emitYourTurn(nextPlayer, gameRoom.setupData(nextPlayer.id));
    }

    handleDisconnect(){
        console.log('client disconnected');
    }

    handleSpawnUnit(pos : PosData, unitType : string) {
        let room = this.playerRoomLookup.get(this.client.id);
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

    handleEraUpgrade() {
        let room = this.playerRoomLookup.get(this.client.id);
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
}