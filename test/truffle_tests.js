//whip venture public clip similar debris minimum mandate despair govern rotate swim

const Exchange = artifacts.require('Exchange');
//const assertJump = require("./assertJump.js");

const durationTime = 28; //4 weeks
const alice = '0x521f76b5f95bc0b0acd8c2d27c1f48e5db97e0c2';

contract('Exchange', function(accounts) {
  beforeEach(async function () {
    
    this.exchange = await Exchange.new(accounts[1]);
  });

  describe("Test new exchange features", async function() {
    it("should deploy with fee account", async function () {
      const actual = await this.exchange.feeAccount.call();
      assert.equal(actual, alice, "Fee account should be 0x521f76b5f95bc0b0acd8c2d27c1f48e5db97e0c2");
    });
  });
});