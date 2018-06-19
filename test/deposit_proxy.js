//should_tokenFallback

//should_receiveApproval

//should_tokensReceived

const Contract = artifacts.require("DepositProxy");

contract('DepositProxy', function(accounts) {
  beforeEach(async function () {
    this.contract = await Contract.new();
  });

  //describe erc20 tests
  describe("Test ...", async function() {
    it("should do fall back", async function () {
      //const actual = await this.contract.tokenFallback(acounts[1], 100, "");
      //assert.equal(actual.valueOf(), 0, "Total supply should be 0");
    });

    it("should do tokensReceived", async function () {
      const actual = await this.contract.tokensReceived(acounts[1], 100, "");
      //assert.equal(actual.valueOf(), 0, "Total supply should be 0");
    });
  });
});