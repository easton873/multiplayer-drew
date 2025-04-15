export interface GameData {
  units : UnitData[]
}

export interface UnitData {
  pos : PosData
}

export interface PosData {
  x : number,
  y : number,
}