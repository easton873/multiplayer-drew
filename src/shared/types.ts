export interface GameData {
  playerData : PlayerSpecificData
  units : UnitData[]
  board : BoardData
  resources : ResourceData
  era : EraData
}

export interface PlayerSpecificData {
  pos : PosData
  radius : number
  health : number
  totalHealth : number
  numUnits : number
  maxUnits : number
}

export interface EraData {
  eraName : string
  nextEraCost : ResourceData
  availableUnits : UnitCreationData[]
}

export interface UnitCreationData {
  name : string
  cost : ResourceData
}

export interface ResourceData {
  gold : number
  wood : number
  stone : number
}

export interface UnitData {
  pos : PosData
  team : number
  color : string
  playerColor : string
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
export const ARCHER_NAME = "Archer";
export const KAMAKAZE_NAME = "Kamakaze";
// resource units
export const MERCHANT_NAME = "Merchant";
export const LUMBER_JACK_NAME = "Lumber Jack";
export const MINER_NAME = "Miner";