const Exchange = artifacts.require('Exchange');
//const assertJump = require("./assertJump.js");

const durationTime = 28; //4 weeks

contract('Exchange', function(accounts) {
  beforeEach(async function () {
    //const alice = '0xa5f8ff129c19dbc0849619916c16010738ab5b1f';
    // this.exchange = await Exchange.new(); /accounts[0]
    this.exchange = await Exchange.new(accounts[1]);
  });

  describe("Test new exchange features", async function() {
    it("should have ...", async function () {
      //const actual = await this.exchange.INACTIVITY_CAP();
      //assert.equal(actual, '0x00', "Cap should be ");
    });
  });
});