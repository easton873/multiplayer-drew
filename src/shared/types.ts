export interface GameData {
  units : UnitData[]
  board : BoardData
  resources : ResourceData
  era : EraData
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
}

export interface BoardData {
  width : number
  height : number
}

export interface PosData {
  x : number
  y : number
}

// socket events
export const JOIN_ROOM_KEY = "join";
export const JOIN_SUCCESS_KEY = "join success";
export const CREATE_ROOM_KEY = "create";

export const GAME_INSTANCE_KEY = "gameInstance";
export const UNIT_SPAWN_KEY = "spawn";
export const UPGRADE_ERA_KEY = "era";
export const UPDGRADE_SUCCESS_KEY = "upgrade success";

// units
export const SOLDIER_NAME = "Soldier";
// resource units
export const MERCHANT_NAME = "Merchant";
export const LUMBER_JACK_NAME = "Lumber Jack";
export const MINER_NAME = "Miner";