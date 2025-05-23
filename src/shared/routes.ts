import { Game } from '../server/game/game.js';
import { GameRoom } from '../server/game/game_room.js';
import { DefaultEventsMap, Server, Socket } from 'socket.io';
import { PosData } from './types.js';
import { GameWaitingData, PlayerSetupData, PlayerWaitingData } from './bulider.js';

// socket events
export const JOIN_ROOM_KEY = "join";
export const CREATE_ROOM_KEY = "create";
export const UPDATE_PLAYER_KEY = "update";
export const START_GAME_KEY = "start";
const SUBMIT_START_POS_KEY = "submit start pos";

export const UNIT_SPAWN_KEY = "spawn";
export const UPGRADE_ERA_KEY = "era";
export const DISCONNECT_KEY = "disconnect";

export abstract class RouteReceiver {
    constructor(protected client: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>, 
        protected io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>, 
        protected rooms : Map<string, GameRoom>, 
        protected playerRoomLookup : Map<string, GameRoom>) {        
        client.on(JOIN_ROOM_KEY, (roomCode : string, playerName : string, color : string) => this.handleJoinRoom(roomCode, playerName, color));
        client.on(CREATE_ROOM_KEY, (playerName : string, color : string) => this.handleCreateRoom(playerName, color));
        client.on(UPDATE_PLAYER_KEY, (player : PlayerWaitingData) => this.handleUpdateSetupPlayer(player));
        client.on(START_GAME_KEY, () => this.handleStartGame());
        client.on(SUBMIT_START_POS_KEY, (pos : PosData) => this.handleSubmitStartPos(pos));
        client.on(UNIT_SPAWN_KEY, (pos : PosData, unitType : string) => this.handleSpawnUnit(pos, unitType));
        client.on(UPGRADE_ERA_KEY, () => this.handleEraUpgrade());
        client.on(DISCONNECT_KEY, () => this.handleDisconnect());
    }
    abstract handleJoinRoom(roomCode : string, playerName : string, color : string);
    abstract handleCreateRoom(playerName : string, color : string);
    abstract handleUpdateSetupPlayer(player : PlayerWaitingData)
    abstract handleStartGame();
    abstract handleSubmitStartPos(pos : PosData);
    abstract handleSpawnUnit(pos : PosData, unitType : string);
    abstract handleEraUpgrade();
    abstract handleDisconnect();
}

export function emitJoinRoom(socket : any, roomCode : string, playerName : string, color : string) {
  socket.emit(JOIN_ROOM_KEY, roomCode, playerName, color);
}

export function emitCreateRoom(socket : any, playerName : string, color : string) {
  socket.emit(CREATE_ROOM_KEY, playerName, color);
}

export function emitUpdateSetupPlayer(socket : any, player : PlayerWaitingData) {
    socket.emit(UPDATE_PLAYER_KEY, player);
  }

export function emitStartGme(socket : any){
    socket.emit(START_GAME_KEY);
}

export function emitSubmitStartPos(socket : any, pos : PosData){
    socket.emit(SUBMIT_START_POS_KEY, pos);
}

export function emitSpawnUnit(socket : any, pos : PosData, unitType : string) {
    socket.emit(UNIT_SPAWN_KEY, pos, unitType);
}

export function emitEraUpgrade(socket : any) {
    socket.emit(UPGRADE_ERA_KEY);
}