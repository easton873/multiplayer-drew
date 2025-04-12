import { Pos } from "./pos";

export class GameData {
    constructor(public units : UnitData[]){}
}

export class UnitData {
    constructor(public pos : Pos){}
}