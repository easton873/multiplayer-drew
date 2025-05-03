import { PosData } from "../../shared/types.js";
import { Random } from "./math.js";

export class Pos {
    constructor(private _x : number, private _y : number) {}

    static FromPosData(pos : PosData) : Pos {
        return new Pos(pos.x, pos.y);
    }

    getPosData() : PosData {
        return {x: this._x, y: this._y};
    }

    clone() : Pos {
        return new Pos(this._x, this._y);
    }

    get x() : number {
        return this._x;
    }

    get y() : number {
        return this._y;
    }

    isAdjacent(other : Pos) : boolean {
        let x = Math.abs(this._x - other._x);
        let y = Math.abs(this._y - other._y);
        return x <= 1 && y <= 1;
    }

    equals(other : Pos) : boolean {
        return this._x == other._x && this._y == other._y;
    }

    moveUp() {
        this._y++;
    }

    moveDown() {
        this._y--;
    }

    moveRight() {
        this._x++;
    }

    moveLeft() {
        this._x--;
    }

    distanceTo(other : Pos) {
        let x = other._x - this._x;
        let y = other._y - this._y;
        return x * x + y * y;
    }

    moveTowards(other : Pos) {
        if (this.equals(other)) {
            return;
        } else if (this._y == other._y) {
            this.moveXTowards(other);
        } else if (this._x == other._x) {
            this.moveYTowards(other);
        } else {
            if (Random.fromRange(0, 1) == 0) {
                this.moveXTowards(other);
            } else {
                this.moveYTowards(other);
            }
        }
    }

    private moveXTowards(other : Pos) {
        if (this._x < other._x) {
            this.moveRight();
        } else if (this._x > other._x) {
            this.moveLeft();
        }
    }

    private moveYTowards(other : Pos) {
        if (this._y < other._y) {
            this.moveUp();
        } else if (this._y > other._y) {
            this.moveDown();
        }
    }
}

