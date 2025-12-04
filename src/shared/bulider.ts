import { PosData } from "./types.js"

export interface GameWaitingData {
    players : PlayerWaitingData[]
    board : BoardData
}

export interface BoardData {
    boardX : number
    boardY : number
}

export interface PlayerWaitingData {
    name : string
    ready : boolean
    leader : boolean
    team : number
    color : string
}

export interface GameSetupData {
    boardX : number
    boardY : number
    players : PlayerSetupData[]
    currPlayer : PlayerSetupData
}

export interface PlayerSetupData {
    name : string
    pos : PosData
    color : string
}