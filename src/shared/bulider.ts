import { PosData } from "./types.js"

export interface LoadData {
    units : UnitLoadData[]
}

export interface UnitLoadData {
    name : string
}

export interface GameWaitingData {
    players : PlayerWaitingData[]
    board : BoardData
    computerDifficulties : string[]
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

export interface ComputerWaitingData {
    name : string
    team : number
    color : string
    difficulty : string
}

export interface GameSetupData {
    boardX : number
    boardY : number
    players : PlayerSetupData[]
    currPlayer : PlayerSetupData
    placingPlayerName : string
    placingPlayerColor : string
}

export interface PlayerSetupData {
    name : string
    pos : PosData
    color : string
}