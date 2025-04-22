import { DefaultEventsMap } from "socket.io";
import { Socket } from "socket.io-client";
import { GameSetupData, GameWaitingData } from "./bulider";

const JOIN_SUCCESS_KEY = "join success";
export const START_SUCCESS_KEY = "start success";
export const SEND_START_POS = "start pos";

export abstract class ClientReceiver {
    constructor(protected socket : Socket<DefaultEventsMap, DefaultEventsMap>) {
        socket.on(JOIN_SUCCESS_KEY, (data : GameWaitingData) => this.handleJoinSuccess(data));
        socket.on(START_SUCCESS_KEY, (data : GameSetupData) => this.handleStartSuccess(data));
    }

    abstract handleJoinSuccess(data : GameWaitingData);
    abstract handleStartSuccess(data : GameSetupData);
}

export function emitJoinSuccess(io : any, roomCode : string, currGame : GameWaitingData) {
    io.sockets.in(roomCode).emit(JOIN_SUCCESS_KEY, currGame);
}

export function emitStartSuccess(io : any, roomCode : string, data : GameSetupData) {
    io.sockets.in(roomCode).emit(START_SUCCESS_KEY, data);
}