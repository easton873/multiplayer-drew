
import * as assert from "assert";
import { Resources } from "../src/server/game/resources.js";
import { Era } from "../src/server/game/era.js";

describe('Era Test', () => {
    it('era test', () => {
        let era = new Era();
        let myResources = new Resources(5, 0, 0);
        assert.strictEqual(era.canAffordNextEra(myResources), false);
        era.advanceToNextEra(myResources);
        assert.strictEqual(myResources.equals(new Resources(5, 0, 0)), true);
        myResources.add(era.nextEraCost);
        assert.strictEqual(era.canAffordNextEra(myResources), true);
        era.advanceToNextEra(myResources);
        assert.strictEqual(myResources.equals(new Resources(5, 0, 0)), true);
        assert.strictEqual(era.canAffordNextEra(myResources), false);
    });
});