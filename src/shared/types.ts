export interface GameData {
  units : UnitData[]
  board : BoardData
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