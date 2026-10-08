import * as assert from "assert";
import { Resources } from "../src/server/game/resources.js";

describe('Resources Tests', () => {
    it('equals test', () => {
        assert.strictEqual(new Resources().equals(new Resources()), true);
        assert.strictEqual(new Resources({ gold: 1 }).equals(new Resources()), false);
        assert.strictEqual(new Resources({ wood: 1 }).equals(new Resources()), false);
        assert.strictEqual(new Resources({ stone: 1 }).equals(new Resources()), false);
        assert.strictEqual(new Resources({ gold: 1 }).equals(new Resources({ gold: 1 })), true);
        assert.strictEqual(new Resources({ wood: 1 }).equals(new Resources({ wood: 1 })), true);
        assert.strictEqual(new Resources({ stone: 1 }).equals(new Resources({ stone: 1 })), true);
        assert.strictEqual(new Resources({ gold: 1, wood: 1, stone: 1 }).equals(new Resources({ gold: 1, wood: 1, stone: 1 })), true);
    });

    it('canAfford test', () => {
        assert.strictEqual(new Resources().canAfford(new Resources()), true);
        assert.strictEqual(new Resources().canAfford(new Resources({ gold: 1 })), false);
        assert.strictEqual(new Resources().canAfford(new Resources({ wood: 1 })), false);
        assert.strictEqual(new Resources().canAfford(new Resources({ stone: 1 })), false);
        assert.strictEqual(new Resources({ gold: 1 }).canAfford(new Resources({ gold: 1 })), true);
        assert.strictEqual(new Resources({ wood: 1 }).canAfford(new Resources({ wood: 1 })), true);
        assert.strictEqual(new Resources({ stone: 1 }).canAfford(new Resources({ stone: 1 })), true);
        assert.strictEqual(new Resources({ gold: 2, wood: 2, stone: 2 }).canAfford(new Resources({ gold: 1, wood: 1, stone: 1 })), true);
    });

    it ('spend test', () => {
        let r = new Resources({ gold: 1, wood: 1, stone: 1 });
        r.spend(new Resources());
        assert.strictEqual(r.equals(new Resources({ gold: 1, wood: 1, stone: 1 })), true);
        r.spend(new Resources({ gold: 1 }));
        assert.strictEqual(r.equals(new Resources({ wood: 1, stone: 1 })), true);
        r.spend(new Resources({ wood: 1 }));
        assert.strictEqual(r.equals(new Resources({ stone: 1 })), true);
        r.spend(new Resources({ stone: 1 }));
        assert.strictEqual(r.equals(new Resources()), true);
    });

    it ('add test', () => {
        let r = new Resources();
        r.add(new Resources());
        assert.strictEqual(r.equals(new Resources()), true);
        r.add(new Resources({ gold: 1 }));
        assert.strictEqual(r.equals(new Resources({ gold: 1 })), true);
        r.add(new Resources({ wood: 1 }));
        assert.strictEqual(r.equals(new Resources({ gold: 1, wood: 1 })), true);
        r.add(new Resources({ stone: 1 }));
        assert.strictEqual(r.equals(new Resources({ gold: 1, wood: 1, stone: 1 })), true);
    });
})