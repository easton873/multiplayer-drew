import { Pos } from "../pos.js";
import { DrawingManager } from "./manager.js";

export function drawRandomPath(start: Pos, target: Pos, color: string, drawingManager: DrawingManager): void {
    target = target.clone();
    let max = 100;
    let i = 0;
    const posList: Pos[] = [];
    // pos starts on the target and is never pushed itself, and we stop before start's own tile
    while (i < max) {
        target.moveTowards(start);
        if (target.equals(start)) {
            break;
        }
        posList.push(target.clone());
        i++;
    }
    let duration = 2;
    posList.reverse(); // nearest start first, so the path appears to travel out to the target
    posList.forEach((p: Pos) => {
        drawingManager.addColorSquare(p, color, duration);
        duration += 1;
    })
}

export function drawExpandingCircle(center: Pos, maxRadius: number, frameDuration: number, color: string, drawingManager: DrawingManager): void {
    for (let i = 1; i < maxRadius; ++i) {
        drawingManager.addCircle(center, i * i, color, frameDuration, i * frameDuration);
    }
}

export function drawShrinkingCircle(center: Pos, maxRadius: number, frameDuration: number, color: string, drawingManager: DrawingManager): void {
    for (let i = maxRadius; i > 0; --i) {
        drawingManager.addCircle(center, i * i, color, frameDuration, (maxRadius - i) * frameDuration);
    }
}