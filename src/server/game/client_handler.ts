import { PosData } from "../../shared/types.js";
import { CREATE_ROOM_KEY, DISCONNECT_KEY, JOIN_ROOM_KEY, RouteReceiver, START_GAME_KEY, UNIT_SPAWN_KEY, UPDGRADE_SUCCESS_KEY, UPGRADE_ERA_KEY } from "../../shared/routes.js";
import { Era } from "./era.js";
import { Game } from "./game.js";
import { GameRoom, randomRoomID } from "./game_room.js";
import { emitJoinSuccess, emitSetPosSuccess, emitStartSuccess, emitYourTurn, START_SUCCESS_KEY } from "../../shared/client.js";
import { Pos } from "./pos.js";
import { DefaultEventsMap, Server, Socket } from "socket.io";


export class ClientHandler extends RouteReceiver {
    constructor(client: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>, 
        io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>, 
        rooms : Map<string, GameRoom>, 
        playerRoomLookup : Map<string, GameRoom>){
        console.log("guy connected");
        super(client, io, rooms, playerRoomLookup);
    }   

    handleCreateRoom(name : string) {
        console.log("creating game");
        let roomCode = randomRoomID(4);
        this.rooms.set(roomCode, new GameRoom(roomCode));
        this.handleJoinRoom(roomCode, name);
    }

    handleJoinRoom(roomCode : string, name : string){
        let currGame : GameRoom = this.rooms.get(roomCode);
        if (!currGame) {
            return;
        }
        this.playerRoomLookup.set(this.client.id, currGame);
        this.client.join(roomCode);
        currGame.addPlayer(this.client.id, name, this.client);
        emitJoinSuccess(this.io, roomCode, currGame.joinRoomData());
        console.log("Client " + this.client.id + " joined room " + roomCode);
    }

    handleStartGame() {
        let gameRoom = this.playerRoomLookup.get(this.client.id);
        if (!gameRoom) {
            return;
        }
        emitStartSuccess(this.io, gameRoom.roomCode, gameRoom.setupData());
        emitYourTurn(gameRoom.getPoslessPlayer().getClient(), gameRoom.setupData());
    }

    handleSubmitStartPos(pos: PosData) {
        let gameRoom = this.playerRoomLookup.get(this.client.id);
        if (!gameRoom) {
            return;
        }
        gameRoom.addPlayerPos(this.client.id, Pos.FromPosData(pos));
        emitSetPosSuccess(this.client);
        emitStartSuccess(this.io, gameRoom.roomCode, gameRoom.setupData());
        if (gameRoom.allPlayersHavePos()) {
            return;
        }
        emitYourTurn(gameRoom.getPoslessPlayer().getClient(), gameRoom.setupData());
    }

    handleDisconnect(){
        console.log('client disconnected');
    }

    handleSpawnUnit(pos : PosData, unitType : string) {
        // if (!this.game) {
        //     return;
        // }
        // this.game.attemptPlaceUnit(pos, unitType);
    }

    handleEraUpgrade() {
        // if (!this.game) {
        //     return;
        // }
        // let era : Era = this.game.upgradeEra();
        // this.client.emit(UPDGRADE_SUCCESS_KEY, era.getEraData())
    }
}