import { ResourceType } from "./resource_types.js";
import { PosData, ResourceData } from "./types.js"

// Lobby-only faction choice: the server picks a real faction when the game starts
export const CHOOSE_FOR_ME_FACTION = "Choose For Me";

export interface LoadData {
    factions : FactionLoadData[]
}

export interface FactionLoadData {
    name : string
    blurb : string
    units : UnitLoadData[]
    eras : EraLoadData[]
}

export interface EraLoadData {
    name : string
    // what it costs to advance into this era
    cost : ResourceData
    // what the heart produces while in this era
    heartResources : ResourceData
    availableResources : ResourceType[]
}

export interface UnitLoadData {
    name : string
    // absent for units that can't be bought directly, like summoned ones
    cost? : ResourceData
    blurb? : string
    era? : number
}

export interface GameWaitingData {
    players : PlayerWaitingData[]
    board : BoardData
    computerDifficulties : string[]
    startingResources : ResourceData
    backgrounds: string[]
    background: string
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
    id : string
    isComputer : boolean
    faction : string
    difficulty? : string
}

export interface EditComputerData {
    id : string
    name : string
    team : number | null
    color : string
    difficulty : string
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
    background: string
}

export interface PlayerSetupData {
    name : string
    pos : PosData
    color : string
    team?: number
}