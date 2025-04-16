export interface GameBuilderData {
  boardX : number
  boardY : number
}

export interface GameSetupData {
    players : PlayerSetupData
}

export interface PlayerSetupData {
    name : string
    ready : boolean
}