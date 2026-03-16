import { BoardData, PosData, ResourceData, ReconnectData } from "../../shared/types.js";
import { RouteReceiver } from "../../shared/routes.js";
import { GameRoom } from "./game_room.js";
import { emitJoinSuccess, emitLoadData, emitPlayerWaitingInfo, emitReconnectSuccess, emitWaitingRoomUpdate } from "../../shared/client.js";
import { WaitingState } from "./state/waiting.js";
import { PlacingState } from "./state/placing.js";
import { PlayingState } from "./state/playing.js";
import { DefaultEventsMap, Server, Socket } from "socket.io";
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
        if (!(this.room.state instanceof WaitingState)) return;
        this.room.state.updatePlayer(this.room, this.getPlayerId(), player);
        emitWaitingRoomUpdate(this.io, this.room.joinRoomData());
    }

    handleAddComputerPlayer(data : ComputerWaitingData) {
        if (!(this.room.state instanceof WaitingState)) return;
        if (!this.isLeader()) return;
        this.room.state.addComputerPlayer(this.room, this, data.name, data.color, data.team, data.difficulty);
        emitWaitingRoomUpdate(this.io, this.room.joinRoomData());
    }

    handleBoardUpdate(board: BoardData) {
        if (!(this.room.state instanceof WaitingState)) return;
        if (!this.isLeader()) return;
        this.room.state.updateBoard(this.room, board.width, board.height);
        emitWaitingRoomUpdate(this.io, this.room.joinRoomData());
    }

    handleResourceUpdate(resources: ResourceData) {
        if (!(this.room.state instanceof WaitingState)) return;
        if (!this.isLeader()) return;
        this.room.state.updateResources(this.room, resources);
        emitWaitingRoomUpdate(this.io, this.room.joinRoomData());
    }

    handleStartGame() {
        if (!this.room || !this.isLeader()) {
            return;
        }
        if (!(this.room.state instanceof WaitingState)) return;
        const placingState = new PlacingState(this.room, this.io, this.playerClients, this.getPlayerId());
        this.room.setState(placingState);
        placingState.init();
    }

    handleSubmitStartPos(pos: PosData) {
        if (!(this.room.state instanceof PlacingState)) return;
        this.submitStartPosWithID(pos, this.getPlayerId());
    }

    submitStartPosWithID(pos : PosData, id : string) {
        if (!(this.room.state instanceof PlacingState)) return;
        this.room.state.submitPos(pos, id, this.client);
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
        return this.room.state.reconnectData(this.room, playerId);
    }

    handleSpawnUnit(pos : PosData, unitType : string) {
        if (!(this.room.state instanceof PlayingState)) return;
        this.room.state.spawnUnit(this.getPlayerId(), pos, unitType);
    }

    handleDeleteUnits(pos: PosData) {
        if (!(this.room.state instanceof PlayingState)) return;
        this.room.state.deleteUnits(this.getPlayerId(), pos);
    }

    handleEraUpgrade() {
        if (!(this.room.state instanceof PlayingState)) return;
        this.room.state.upgradeEra(this.getPlayerId(), this.client);
    }

    handleEditComputerPlayer(data : EditComputerData) {
        if (!(this.room.state instanceof WaitingState)) return;
        if (!this.isLeader()) return;
        this.room.state.editComputerPlayer(this.room, data.id, data);
        emitWaitingRoomUpdate(this.io, this.room.joinRoomData());
    }

    handleRemoveComputerPlayer(id : string) {
        if (!(this.room.state instanceof WaitingState)) return;
        if (!this.isLeader()) return;
        this.room.state.removeComputerPlayer(this.room, id);
        emitWaitingRoomUpdate(this.io, this.room.joinRoomData());
    }

    handleBackgroundUpdate(filename: string) {
        if (!(this.room.state instanceof WaitingState)) return;
        if (!this.isLeader()) return;
        this.room.state.updateBackground(this.room, filename);
        emitWaitingRoomUpdate(this.io, this.room.joinRoomData());
    }

    isLeader() : boolean {
        return this.room.isLeader(this.getPlayerId());
    }
}