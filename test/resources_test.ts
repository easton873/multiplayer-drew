import * as assert from "assert";
import { Resources } from "../src/server/game/resources.js";

describe('Resources Tests', () => {
    it('equals test', () => {
        assert.strictEqual(new Resources(0, 0, 0).equals(new Resources(0, 0, 0)), true);
        assert.strictEqual(new Resources(1, 0, 0).equals(new Resources(0, 0, 0)), false);
        assert.strictEqual(new Resources(0, 1, 0).equals(new Resources(0, 0, 0)), false);
        assert.strictEqual(new Resources(0, 0, 1).equals(new Resources(0, 0, 0)), false);
        assert.strictEqual(new Resources(1, 0, 0).equals(new Resources(1, 0, 0)), true);
        assert.strictEqual(new Resources(0, 1, 0).equals(new Resources(0, 1, 0)), true);
        assert.strictEqual(new Resources(0, 0, 1).equals(new Resources(0, 0, 1)), true);
        assert.strictEqual(new Resources(1, 1, 1).equals(new Resources(1, 1, 1)), true);
    });

    it('canAfford test', () => {
        assert.strictEqual(new Resources(0, 0, 0).canAfford(new Resources(0, 0, 0)), true);
        assert.strictEqual(new Resources(0, 0, 0).canAfford(new Resources(1, 0, 0)), false);
        assert.strictEqual(new Resources(0, 0, 0).canAfford(new Resources(0, 1, 0)), false);
        assert.strictEqual(new Resources(0, 0, 0).canAfford(new Resources(0, 0, 1)), false);
        assert.strictEqual(new Resources(1, 0, 0).canAfford(new Resources(1, 0, 0)), true);
        assert.strictEqual(new Resources(0, 1, 0).canAfford(new Resources(0, 1, 0)), true);
        assert.strictEqual(new Resources(0, 0, 1).canAfford(new Resources(0, 0, 1)), true);
        assert.strictEqual(new Resources(2, 2, 2).canAfford(new Resources(1, 1, 1)), true);
    });

    it ('spend test', () => {
        let r = new Resources(1, 1, 1);
        r.spend(new Resources(0, 0, 0));
        assert.strictEqual(r.equals(new Resources(1, 1, 1)), true);
        r.spend(new Resources(1, 0, 0));
        assert.strictEqual(r.equals(new Resources(0, 1, 1)), true);
        r.spend(new Resources(0, 1, 0));
        assert.strictEqual(r.equals(new Resources(0, 0, 1)), true);
        r.spend(new Resources(0, 0, 1));
        assert.strictEqual(r.equals(new Resources(0, 0, 0)), true);
    });

    it ('add test', () => {
        let r = new Resources(0, 0, 0);
        r.add(new Resources(0, 0, 0));
        assert.strictEqual(r.equals(new Resources(0, 0, 0)), true);
        r.add(new Resources(1, 0, 0));
        assert.strictEqual(r.equals(new Resources(1, 0, 0)), true);
        r.add(new Resources(0, 1, 0));
        assert.strictEqual(r.equals(new Resources(1, 1, 0)), true);
        r.add(new Resources(0, 0, 1));
        assert.strictEqual(r.equals(new Resources(1, 1, 1)), true);
    });
})