import { CircleDrawingData, SquareDrawingData, DrawingData } from "../../../shared/types.js";
import { Pos } from "../pos.js";
import { Circle, Shape, Square } from "./shapes.js";

export class DrawingManager {
    private squares: DrawingCounter<SquareDrawingData>[] = [];
    private circles: DrawingCounter<CircleDrawingData>[] = [];

    getDrawings(): DrawingData {
        return {
            squares: this.getSquares(),
            circles: this.getCircles(),
        };
    }

    addColorSquare(pos: Pos, color: string, duration: number, delay: number = 0): void {
        this.squares.push(new DrawingCounter(new Square(pos, color), duration, delay));
    }

    addImageSquare(pos: Pos, image: string, duration: number, delay: number = 0): void {
        this.squares.push(new DrawingCounter(new Square(pos, "#000000", image), duration, delay));
    }

    addCircle(pos: Pos, radius: number, color: string, duration: number, delay: number = 0): void {
        this.circles.push(new DrawingCounter(new Circle(pos, radius, color), duration, delay));
    }

    // Called once per game loop so the duration doesn't depend on how many times the data is read
    tick(): void {
        this.tickShapes(this.squares);
        this.tickShapes(this.circles);
    }

    getSquares(): SquareDrawingData[] {
        return this.getShapes(this.squares);
    }

    getCircles(): CircleDrawingData[] {
        return this.getShapes(this.circles);
    }

    private getShapes<T>(shapes: DrawingCounter<T>[]): T[] {
        return shapes.filter((shape) => shape.isActive()).map((shape) => shape.getDrawingData());
    }

    private tickShapes<T>(shapes: DrawingCounter<T>[]): void {
        for (let i = shapes.length - 1; i >= 0; i--) {
            shapes[i].tick();
            if (shapes[i].isDone()) {
                shapes.splice(i, 1);
            }
        }
    }
}

class DrawingCounter<T> {
    constructor(private shape: Shape<T>, private duration: number, private delay: number = 0) {
    }

    tick(): void {
        if (this.delay > 0) {
            this.delay--;
            return;
        }
        this.duration--;
    }

    getDrawingData(): T {
        return this.shape.getDrawingData();
    }

    isDone(): boolean {
        return this.duration <= 0;
    }

    isActive(): boolean {
        return this.delay <= 0;
    }
}
