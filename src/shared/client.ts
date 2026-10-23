import { DefaultEventsMap } from "socket.io";
import { Socket } from "socket.io-client";
import { GameSetupData, GameWaitingData, LoadData, PlayerWaitingData } from "./bulider";
import type { FactionData, GameData, GeneralGameData, ReconnectData } from "./types";

const LOAD_DATA_KEY = "load";
const WAITING_PLAYER_KEY = "waiting player";
const JOIN_SUCCESS_KEY = "join success";
const WAITING_ROOM_UPDATE = "update waiting room";
export const START_SUCCESS_KEY = "start success";
const YOUR_TURN_KEY = "start pos";
const SET_POS_SUCCESS = "set pos success";
const GAME_BUILD_SUCCESS = "game built";
const GAME_INSTANCE_KEY = "gameInstance";
const SPECTATOR_GAME_KEY = "spectatorGame";
const UPDGRADE_SUCCESS_KEY = "upgrade success";
const GAME_OVER_KEY = "gameover";
const RECONNECT_SUCCESS_KEY = "reconnect success";

const ROOM_CODE = "roomcode";

export abstract class ClientReceiver {
    constructor(protected socket : Socket<DefaultEventsMap, DefaultEventsMap>) {
        socket.on(LOAD_DATA_KEY, (data : LoadData) => this.handleLoadData(data));
        socket.on(WAITING_PLAYER_KEY, (data : PlayerWaitingData) => this.handlePlayerWaitingInfo(data));
        socket.on(JOIN_SUCCESS_KEY, (token : string) => this.handleJoinSuccess(token));
        socket.on(WAITING_ROOM_UPDATE, (data : GameWaitingData) => this.handleWaitingRoomUpdate(data));
        socket.on(START_SUCCESS_KEY, (data : GameSetupData) => this.handleStartSuccess(data));
        socket.on(YOUR_TURN_KEY, (data : GameSetupData) => this.handleYourTurn(data));
        socket.on(SET_POS_SUCCESS, () => this.handleSetPosSuccess());
        socket.on(GAME_BUILD_SUCCESS, (faction : FactionData) => this.handleBuildSucces(faction));
        socket.on(GAME_INSTANCE_KEY, (data : GameData, team : number) => this.handleEmitGamestate(data));
        socket.on(SPECTATOR_GAME_KEY, (data : GeneralGameData) => this.handleEmitSpectatorGameState(data));
        socket.on(UPDGRADE_SUCCESS_KEY, (faction : FactionData) => this.handleEraUpgradeSuccess(faction));
        socket.on(GAME_OVER_KEY, (winner : string) => this.handleGameOver(winner));
        socket.on(RECONNECT_SUCCESS_KEY, (data : ReconnectData) => this.handleReconnectSuccess(data));
    }

    abstract handleLoadData(data : LoadData): void;
    abstract handlePlayerWaitingInfo(data : PlayerWaitingData): void;
    abstract handleJoinSuccess(token : string): void;
    abstract handleWaitingRoomUpdate(data : GameWaitingData): void;
    abstract handleStartSuccess(data : GameSetupData): void;
    abstract handleYourTurn(data : GameSetupData): void;
    abstract handleSetPosSuccess(): void;
    abstract handleBuildSucces(faction : FactionData): void;
    abstract handleEmitGamestate(gameInstance : GameData): void;
    abstract handleEmitSpectatorGameState(data : GeneralGameData): void;
    abstract handleEraUpgradeSuccess(faction : FactionData): void;
    abstract handleGameOver(winner : string): void;
    abstract handleReconnectSuccess(data : ReconnectData): void;
}

export function emitLoadData(client : any, data : LoadData): void {
    client.emit(LOAD_DATA_KEY, data);
}

export function emitPlayerWaitingInfo(client : any, data : PlayerWaitingData): void {
    client.emit(WAITING_PLAYER_KEY, data);
}

export function emitWaitingRoomUpdate(io : any, data : GameWaitingData): void {
    io.sockets.in(ROOM_CODE).emit(WAITING_ROOM_UPDATE, data);
}

export function emitJoinSuccess(client : any, token : string): void {
    client.emit(JOIN_SUCCESS_KEY, token);
}

export function emitStartSuccess(io : any, data : GameSetupData): void {
    io.sockets.in(ROOM_CODE).emit(START_SUCCESS_KEY, data);
}

export function emitYourTurn(client : any, data : GameSetupData): void {
    client.emit(YOUR_TURN_KEY, data);
}

export function emitSetPosSuccess(client : any): void {
    client.emit(SET_POS_SUCCESS);
}

export function emitGameBuilt(client : any, faction : FactionData): void {
    client.emit(GAME_BUILD_SUCCESS, faction);
}

export function emitGameState(client : any, gameInstance : GameData): void {
    client.emit(GAME_INSTANCE_KEY, gameInstance);
}

export function emitSpectatorGameState(client : any, data : GeneralGameData): void {
    client.emit(SPECTATOR_GAME_KEY, data);
}

export function emitUpgradeEraSuccess(client : any, faction : FactionData): void {
    client.emit(UPDGRADE_SUCCESS_KEY, faction);
}

export function emitGameOver(io : any, winner : string): void {
    io.sockets.in(ROOM_CODE).emit(GAME_OVER_KEY, winner);
}

export function emitReconnectSuccess(client : any, data : ReconnectData): void {
    client.emit(RECONNECT_SUCCESS_KEY, data);
}