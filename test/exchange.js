const Exchange = artifacts.require('Exchange');

const durationTime = 28; //4 weeks
const account_1 = '0x521f76b5f95bc0b0acd8c2d27c1f48e5db97e0c2';

contract('Exchange', function(accounts) {
  beforeEach(async function () {
    
    this.exchange = await Exchange.new(accounts[1]);
  });

  describe("Test new exchange features", async function() {
    it("should have fee account", async function () {
      const actual = await this.exchange.feeAccount();
      assert.equal(actual, account_1, "Fee account should be 0xa5f8ff129c19dbc0849619916c16010738ab5b1f");
    });
  });
});