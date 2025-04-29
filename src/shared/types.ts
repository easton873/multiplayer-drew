export interface GameData {
  heart : HeartData
  units : UnitData[]
  board : BoardData
  resources : ResourceData
  era : EraData
}

export interface HeartData {
  pos : PosData
  radius : number
}

export interface EraData {
  eraName : string
  nextEraCost : ResourceData
  availableUnits : string[]
}

export interface ResourceData {
  gold : number
  wood : number
  stone : number
}

export interface UnitData {
  pos : PosData
  team : number
}

export interface BoardData {
  width : number
  height : number
}

export interface PosData {
  x : number
  y : number
}

// units
export const SOLDIER_NAME = "Soldier";
// resource units
export const MERCHANT_NAME = "Merchant";
export const LUMBER_JACK_NAME = "Lumber Jack";
export const MINER_NAME = "Miner";