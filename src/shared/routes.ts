import { Game } from '../server/game/game.js';
import { GameRoom } from '../server/game/game_room.js';
import { DefaultEventsMap, Server, Socket } from 'socket.io';
import { BoardData, GameData, PosData, ResourceData } from './types.js';
import { ComputerWaitingData, EditComputerData, GameWaitingData, PlayerSetupData, PlayerWaitingData } from './bulider.js';

// socket events
export const JOIN_ROOM_KEY = "join";
export const CREATE_ROOM_KEY = "create";
export const UPDATE_PLAYER_KEY = "update";
export const ADD_COMPUTER_KEY = "add computer";
export const EDIT_COMPUTER_KEY = "edit computer";
export const REMOVE_COMPUTER_KEY = "remove computer";
export const UPDATE_BOARD_KEY = "board update";
export const UPDATE_RESOURCES_KEY = "resources update";
export const START_GAME_KEY = "start";
const SUBMIT_START_POS_KEY = "submit start pos";

export const UPDATE_BACKGROUND_KEY = "background update";
export const UNIT_SPAWN_KEY = "spawn";
export const DELETE_UNITS_KEY = "delete";
export const UPGRADE_ERA_KEY = "era";
export const RECONNECT_KEY = "reconnect";
export const DISCONNECT_KEY = "disconnect";

export abstract class RouteReceiver {
    constructor(protected client: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>, 
        protected io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>) {        
        client.on(JOIN_ROOM_KEY, (playerName : string, color : string) => this.handleJoinRoom(playerName, color));
        client.on(UPDATE_PLAYER_KEY, (player : PlayerWaitingData) => this.handleUpdateSetupPlayer(player));
        client.on(ADD_COMPUTER_KEY, (data : ComputerWaitingData) => this.handleAddComputerPlayer(data));
        client.on(EDIT_COMPUTER_KEY, (data : EditComputerData) => this.handleEditComputerPlayer(data));
        client.on(REMOVE_COMPUTER_KEY, (id : string) => this.handleRemoveComputerPlayer(id));
        client.on(UPDATE_BOARD_KEY, (board : BoardData) => this.handleBoardUpdate(board));
        client.on(UPDATE_RESOURCES_KEY, (r : ResourceData) => this.handleResourceUpdate(r));
        client.on(START_GAME_KEY, () => this.handleStartGame());
        client.on(SUBMIT_START_POS_KEY, (pos : PosData) => this.handleSubmitStartPos(pos));
        client.on(UNIT_SPAWN_KEY, (pos : PosData, unitType : string) => this.handleSpawnUnit(pos, unitType));
        client.on(DELETE_UNITS_KEY, (pos : PosData) => this.handleDeleteUnits(pos));
        client.on(UPGRADE_ERA_KEY, () => this.handleEraUpgrade());
        client.on(UPDATE_BACKGROUND_KEY, (filename: string) => this.handleBackgroundUpdate(filename));
        client.on(RECONNECT_KEY, (token : string) => this.handleReconnect(token));
        client.on(DISCONNECT_KEY, () => this.handleDisconnect());
    }
    abstract handleJoinRoom(playerName : string, color : string): void;
    abstract handleUpdateSetupPlayer(player : PlayerWaitingData): void;
    abstract handleAddComputerPlayer(data : ComputerWaitingData): void;
    abstract handleEditComputerPlayer(data : EditComputerData): void;
    abstract handleRemoveComputerPlayer(id : string): void;
    abstract handleBoardUpdate(board : BoardData): void;
    abstract handleResourceUpdate(resources : ResourceData): void;
    abstract handleStartGame(): void;
    abstract handleSubmitStartPos(pos : PosData): void;
    abstract handleSpawnUnit(pos : PosData, unitType : string): void;
    abstract handleDeleteUnits(pos : PosData): void;
    abstract handleEraUpgrade(): void;
    abstract handleBackgroundUpdate(filename: string): void;
    abstract handleReconnect(token: string): void;
    abstract handleDisconnect(): void;
}

export function emitJoinRoom(socket : any, playerName : string, color : string): void {
  socket.emit(JOIN_ROOM_KEY, playerName, color);
}

export function emitUpdateSetupPlayer(socket : any, player : PlayerWaitingData): void {
    socket.emit(UPDATE_PLAYER_KEY, player);
}

export function emitAddComputer(socket : any, data : ComputerWaitingData): void {
    socket.emit(ADD_COMPUTER_KEY, data);
}

export function emitEditComputer(socket : any, data : EditComputerData): void {
    socket.emit(EDIT_COMPUTER_KEY, data);
}

export function emitRemoveComputer(socket : any, id : string): void {
    socket.emit(REMOVE_COMPUTER_KEY, id);
}

export function emitBoardUpdate(socket : any, game : BoardData): void {
    socket.emit(UPDATE_BOARD_KEY, game);
}

export function emitResourceUpdate(socket : any, resources : ResourceData): void {
    socket.emit(UPDATE_RESOURCES_KEY, resources);
}

export function emitStartGme(socket : any): void{
    socket.emit(START_GAME_KEY);
}

export function emitSubmitStartPos(socket : any, pos : PosData): void{
    socket.emit(SUBMIT_START_POS_KEY, pos);
}

export function emitSpawnUnit(socket : any, pos : PosData, unitType : string): void {
    socket.emit(UNIT_SPAWN_KEY, pos, unitType);
}

export function emitDeleteUnits(socket : any, pos : PosData): void {
    socket.emit(DELETE_UNITS_KEY, pos);
}

export function emitEraUpgrade(socket : any): void {
    socket.emit(UPGRADE_ERA_KEY);
}

export function emitBackgroundUpdate(socket : any, filename: string): void {
    socket.emit(UPDATE_BACKGROUND_KEY, filename);
}

export function emitReconnect(socket : any, token : string): void {
    socket.emit(RECONNECT_KEY, token);
}