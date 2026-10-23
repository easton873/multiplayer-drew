import { CircleDrawingData, SquareDrawingData } from "../../../shared/types.js";
import { Pos } from "../pos.js";

export interface Shape<T> {
    getDrawingData(): T;
}

export class Circle implements Shape<CircleDrawingData> {
    constructor(private pos: Pos, private radius: number, private color: string) {}

    getDrawingData(): CircleDrawingData {
        return {
            pos: this.pos.getPosData(),
            radius: this.radius,
            color: this.color,
        }
    }
}

export class Square implements Shape<SquareDrawingData> {
    constructor(private pos: Pos, private color: string, private image?: string){}

    getDrawingData(): SquareDrawingData {
        return {
            pos: this.pos.getPosData(),
            color: this.color,
            image: this.image,
        }
    }
}