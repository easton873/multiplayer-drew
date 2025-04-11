import * as assert from "assert";
import { Pos } from "../server/pos";


describe('Test pos', () => {
    it ('equality test', () => {
        let a = new Pos(0, 0);
        assert.strictEqual(a.equals(new Pos(0, 0)), true);
        assert.strictEqual(a.equals(new Pos(1, 0)), false);
        assert.strictEqual(a.equals(new Pos(0, 1)), false);
        assert.strictEqual(a.equals(new Pos(1, 1)), false);
    });

    it ('adjacent test', () => {
        let a = new Pos(0, 0);
        assert.strictEqual(a.isAdjacent(new Pos(0, 0)), true);
        assert.strictEqual(a.isAdjacent(new Pos(0, 1)), true);
        assert.strictEqual(a.isAdjacent(new Pos(1, 1)), true);
        assert.strictEqual(a.isAdjacent(new Pos(1, 0)), true);
        assert.strictEqual(a.isAdjacent(new Pos(1, -1)), true);
        assert.strictEqual(a.isAdjacent(new Pos(0, -1)), true);
        assert.strictEqual(a.isAdjacent(new Pos(-1, -1)), true);
        assert.strictEqual(a.isAdjacent(new Pos(-1, 0)), true);
        assert.strictEqual(a.isAdjacent(new Pos(-1, 1)), true);
        assert.strictEqual(a.isAdjacent(new Pos(2, 2)), false);
        assert.strictEqual(a.isAdjacent(new Pos(-2, 0)), false);
        assert.strictEqual(a.isAdjacent(new Pos(0, 2)), false);
    });

    it('distance test', () => {
        let a = new Pos(0, 0);
        let b = new Pos(1, 0);
        let c = new Pos(2, 0);
        assert.strictEqual(a.distanceTo(b), 1);
        assert.strictEqual(b.distanceTo(a), 1);
        assert.strictEqual(a.distanceTo(c), 4);
        let d = new Pos(1, 1);
        assert.strictEqual(a.distanceTo(d), 2);
    });

    it('move test', () => {
        let a = new Pos(0, 0);
        a.moveRight();
        assert.strictEqual(a.equals(new Pos(1, 0)), true);
        a.moveUp();
        assert.strictEqual(a.equals(new Pos(1, 1)), true);
        a.moveLeft();
        assert.strictEqual(a.equals(new Pos(0, 1)), true);
        a.moveDown();
        assert.strictEqual(a.equals(new Pos(0, 0)), true);
    });

    it ('moveTowards test', () => {
        let a = new Pos(0, 0);
        a.moveTowards(new Pos(0, 0));
        assert.strictEqual(a.equals(new Pos(0, 0)), true);
        a.moveTowards(new Pos(1, 0));
        assert.strictEqual(a.equals(new Pos(1, 0)), true);
        a.moveTowards(new Pos(1, 1));
        assert.strictEqual(a.equals(new Pos(1, 1)), true);
        a.moveTowards(new Pos(2, 2));
        a.moveTowards(new Pos(2, 2));
        assert.strictEqual(a.equals(new Pos(2, 2)), true);
        a.moveTowards(new Pos(2, 1));
        assert.strictEqual(a.equals(new Pos(2, 1)), true);
        a.moveTowards(new Pos(1, 1));
        assert.strictEqual(a.equals(new Pos(1, 1)), true);
        a.moveTowards(new Pos(0, 0));
        a.moveTowards(new Pos(0, 0));
        assert.strictEqual(a.equals(new Pos(0, 0)), true);
        a.moveTowards(new Pos(-4, -2));
        a.moveTowards(new Pos(-4, -2));
        a.moveTowards(new Pos(-4, -2));
        a.moveTowards(new Pos(-4, -2));
        a.moveTowards(new Pos(-4, -2));
        a.moveTowards(new Pos(-4, -2));
        assert.strictEqual(a.equals(new Pos(-4, -2)), true);
    });
});
