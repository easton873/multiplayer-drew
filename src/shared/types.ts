export interface GameData {
  playerData : PlayerSpecificData
  resources : ResourceData
  era : EraData
  generalData : GeneralGameData
}

export interface GeneralGameData {
  units : UnitData[]
  board : BoardData
}

export interface PlayerSpecificData {
  hearts : PlayerHeartData[]
  numUnits : number
  maxUnits : number
}

export interface PlayerHeartData {
  pos : PosData
  radius : number
  health : number
  totalHealth : number
}

export interface EraData {
  eraName : string
  nextEraCost : ResourceData
  availableUnits : UnitCreationData[]
}

export interface UnitCreationData {
  name : string
  cost : ResourceData
  blurb : string
}

export interface ResourceData {
  gold : number
  wood : number
  stone : number
}

export interface UnitData {
  name : string
  pos : PosData
  team : number
  color : string
  playerColor : string
  hp : number
  totalHP : number
}

export interface BoardData {
  width : number
  height : number
}

export interface PosData {
  x : number
  y : number
}