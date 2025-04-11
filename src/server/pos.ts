import { Random } from "./math";

export class Pos {
    constructor(private x : number, private y : number) {}

    isAdjacent(other : Pos) : boolean {
        let x = Math.abs(this.x - other.x);
        let y = Math.abs(this.y - other.y);
        return x <= 1 && y <= 1;
    }

    equals(other : Pos) : boolean {
        return this.x == other.x && this.y == other.y;
    }

    moveUp() {
        this.y++;
    }

    moveDown() {
        this.y--;
    }

    moveRight() {
        this.x++;
    }

    moveLeft() {
        this.x--;
    }

    distanceTo(other : Pos) {
        let x = other.x - this.x;
        let y = other.y - this.y;
        return x * x + y * y;
    }

    moveTowards(other : Pos) {
        if (this.equals(other)) {
            return;
        } else if (this.y == other.y) {
            this.moveXTowards(other);
        } else if (this.x == other.x) {
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
        if (this.x < other.x) {
            this.moveRight();
        } else if (this.x > other.x) {
            this.moveLeft();
        }
    }

    private moveYTowards(other : Pos) {
        if (this.y < other.y) {
            this.moveUp();
        } else if (this.y > other.y) {
            this.moveDown();
        }
    }
}

