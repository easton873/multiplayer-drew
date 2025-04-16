import { PosData } from "./types.js"

export interface GameBuilderData {
  boardX : number
  boardY : number
}

export interface GameSetupData {
    roomCode : string
    players : PlayerSetupData[]
}

export interface PlayerSetupData {
    name : string
    ready : boolean
}