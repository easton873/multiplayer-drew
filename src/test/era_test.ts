import { Era } from "../server/era";
import { Resources } from "../server/resources";
import * as assert from "assert";

describe('Era Test', () => {
    it('era test', () => {
        let era = new Era();
        let myResources = new Resources(5, 0, 0);
        assert.strictEqual(era.canAffordNextEra(myResources), false);
        era.advanceToNextEra(myResources);
        assert.strictEqual(myResources.equals(new Resources(5, 0, 0)), true);
        myResources.add(new Resources(5, 0, 0));
        assert.strictEqual(era.canAffordNextEra(myResources), true);
        era.advanceToNextEra(myResources);
        assert.strictEqual(myResources.equals(new Resources(0, 0, 0)), true);
        myResources.add(new Resources(20, 0, 0));
        assert.strictEqual(era.canAffordNextEra(myResources), false);
    });
});