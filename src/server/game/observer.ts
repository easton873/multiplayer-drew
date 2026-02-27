export abstract class ObservedBy<T> {
    protected observers : T[] = [];

    get TESTObservers() {
        return this.observers;
    }

    registerObserver(o : T) {
        this.observers.push(o);
    }

    unregisterObserver(o : T) {
        let index = this.observers.findIndex((observer : T) => observer === o);
        if (index == -1) {
            console.log("issue removing observer");
        }
        this.observers.splice(index, 1);
    }

}