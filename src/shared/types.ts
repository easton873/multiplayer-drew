export interface GameData {
  units : UnitData[]
  board : BoardData
  resources : ResourceData
}

export interface ResourceData {
  gold : number
  wood : number
  stone : number
}

export interface UnitData {
  pos : PosData
}

export interface BoardData {
  width : number
  height : number
}

export interface PosData {
  x : number
  y : number
}

export const GAME_INSTANCE_KEY = "gameInstance";
export const UNIT_SPAWN_KEY = "spawn";

// units
export const SOLDIER_NAME = "Soldier";
// resource units
export const MERCHANT_NAME = "Merchant";
export const LUMBER_JACK_NAME = "Lumber Jack";
export const MINER_NAME = "Miner";