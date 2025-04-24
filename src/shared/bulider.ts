import { PosData } from "./types.js"

export interface GameWaitingData {
    roomCode : string
    players : PlayerWaitingData[]
}

export interface PlayerWaitingData {
    name : string
    ready : boolean
}

export interface GameSetupData {
    boardX : number
    boardY : number
    players : PlayerSetupData[]
}

export interface PlayerSetupData {
    name : string
    pos : PosData
}