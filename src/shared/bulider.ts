import { PosData } from "./types.js"

export interface GameBuilderData {
  boardX : number
  boardY : number
}

export interface GameSetupData {
    roomCode : string
    players : PlayerJoinData[]
}

export interface PlayerJoinData {
    name : string
    ready : boolean
}

export interface PlayerSetupData {
    name : string
    pos : PosData
}