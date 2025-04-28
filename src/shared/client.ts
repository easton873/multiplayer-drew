import { DefaultEventsMap } from "socket.io";
import { Socket } from "socket.io-client";
import { GameSetupData, GameWaitingData } from "./bulider";
import { Game } from "../server/game/game";
import { EraData, GameData } from "./types";

const JOIN_SUCCESS_KEY = "join success";
export const START_SUCCESS_KEY = "start success";
const YOUR_TURN_KEY = "start pos";
const SET_POS_SUCCESS = "set pos success";
const GAME_BUILD_SUCCESS = "game built";
const GAME_INSTANCE_KEY = "gameInstance";
const UPDGRADE_SUCCESS_KEY = "upgrade success";

export abstract class ClientReceiver {
    constructor(protected socket : Socket<DefaultEventsMap, DefaultEventsMap>) {
        socket.on(JOIN_SUCCESS_KEY, (data : GameWaitingData) => this.handleJoinSuccess(data));
        socket.on(START_SUCCESS_KEY, (data : GameSetupData) => this.handleStartSuccess(data));
        socket.on(YOUR_TURN_KEY, (data : GameSetupData) => this.handleYourTurn(data));
        socket.on(SET_POS_SUCCESS, () => this.handleSetPosSuccess());
        socket.on(GAME_BUILD_SUCCESS, (era : EraData) => this.handleBuildSucces(era));
        socket.on(GAME_INSTANCE_KEY, (data : GameData, team : number) => this.handleEmitGamestate(data, team));
        socket.on(UPDGRADE_SUCCESS_KEY, (era : EraData) => this.handleEraUpgradeSuccess(era));

    }

    abstract handleJoinSuccess(data : GameWaitingData);
    abstract handleStartSuccess(data : GameSetupData);
    abstract handleYourTurn(data : GameSetupData);
    abstract handleSetPosSuccess();
    abstract handleBuildSucces(era : EraData);
    abstract handleEmitGamestate(gameInstance : GameData, team : number);
    abstract handleEraUpgradeSuccess(era : EraData);
}

export function emitJoinSuccess(io : any, roomCode : string, currGame : GameWaitingData) {
    io.sockets.in(roomCode).emit(JOIN_SUCCESS_KEY, currGame);
}

export function emitStartSuccess(io : any, roomCode : string, data : GameSetupData) {
    io.sockets.in(roomCode).emit(START_SUCCESS_KEY, data);
}

export function emitYourTurn(client : any, data : GameSetupData) {
    client.emit(YOUR_TURN_KEY, data);
}

export function emitSetPosSuccess(client : any) {
    client.emit(SET_POS_SUCCESS);
}

export function emitGameBuilt(client : any, era : EraData) {
    client.emit(GAME_BUILD_SUCCESS, era);
}

export function emitGameState(client : any, gameInstance : GameData, team : number) {
    client.emit(GAME_INSTANCE_KEY, gameInstance, team);
}

export function emitUpgradeEraSuccess(client : any, era : EraData) {
    client.emit(UPDGRADE_SUCCESS_KEY, era);
}