import * as assert from "assert";
require('source-map-support/register'); // tells me line numbers in typescript instead of js


describe('Test test', () => {
  it('a test', () => {
    assert.strictEqual(1, 1 + 0);
  });
});
