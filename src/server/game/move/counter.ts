export class Counter {
    private counter;
    constructor(private speed : number) {
        this.counter = this.speed;
    }

    tick() : boolean {
        if (this.counter <= 0) {
            this.reset();
            return true;
        }
        this.counter--;
        return false;
    }

    tickHold() : boolean {
        if (this.counter <= 0) {
            return true;
        }
        this.counter--;
        return false;
    }

    reset() {
        this.counter = this.speed;
    }

    get remaining() : number {
        return this.counter;
    }

    get total() : number {
        return this.speed;
    }

    setSpeed(newSpeed : number) {
        this.speed = newSpeed;
        // if (this.counter > this.speed) {
        //     this.counter = this.speed;
        // }
        this.counter = this.speed;
    }
}