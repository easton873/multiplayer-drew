import { BoardData, PosData } from "../../shared/types.js";
import { CREATE_ROOM_KEY, DISCONNECT_KEY, emitUpdateSetupPlayer, JOIN_ROOM_KEY, RouteReceiver, START_GAME_KEY, UNIT_SPAWN_KEY, UPGRADE_ERA_KEY } from "../../shared/routes.js";
import { Era } from "./era.js";
import { Game } from "./game.js";
import { GameRoom, randomRoomID } from "./game_room.js";
import { emitGameBuilt, emitGameState, emitJoinSuccess, emitPlayerWaitingInfo, emitSetPosSuccess, emitStartSuccess, emitUpgradeEraSuccess, emitWaitingRoomUpdate, emitYourTurn, START_SUCCESS_KEY } from "../../shared/client.js";
import { Pos } from "./pos.js";
import { DefaultEventsMap, Server, Socket } from "socket.io";
import { Player } from "./player.js";
import { GameWaitingData, PlayerWaitingData } from "../../shared/bulider.js";

const FRAME_RATE = 20;
const ROOM_CODE = "roomcode";

export class ClientHandler extends RouteReceiver {
    constructor(client: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>, 
        io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
        private room : GameRoom,
        private playerClients : Map<string, Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>>){
        console.log("guy connected");
        super(client, io);
        this.playerClients.set(this.client.id, this.client);
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
        emitStartSuccess(this.io, this.room.setupData(this.client.id));
        let player = this.room.getPoslessPlayer().getClient()
        emitYourTurn(player, this.room.setupData(player.id));
    }

    handleSubmitStartPos(pos: PosData) {
        let gameRoom = this.room;
        if (!gameRoom) {
            return;
        }
        gameRoom.addPlayerPos(this.client.id, Pos.FromPosData(pos));
        emitSetPosSuccess(this.client);
        emitStartSuccess(this.io, gameRoom.setupData(this.client.id));
        if (gameRoom.allPlayersHavePos()) {
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

    isLeader() : boolean {
        return this.room.isLeader(this.client.id);
    }
}