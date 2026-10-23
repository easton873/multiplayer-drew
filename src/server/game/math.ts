export class Random {
    static fromRange(min : number, max : number) : number { // min and max included 
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    static fromList<T>(list: T[]): T | null {
        if (list.length == 0) {
            return null;
        }
        return list[this.fromRange(0, list.length - 1)];
    }

    static fromMap<K, V>(m: Map<K, V>): V {
        return this.fromList(Array.from(m.values()))
    }

    static fromObject<V>(o: Record<string, V>): V {
      const values = Object.values(o);
      return values[this.fromRange(0, values.length - 1)];
  }
}