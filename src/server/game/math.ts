export class Random {
    static fromRange(min : number, max : number) : number { // min and max included 
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    static fromList<T>(list: T[]): T {
        return list[this.fromRange(0, list.length - 1)];
    }
}