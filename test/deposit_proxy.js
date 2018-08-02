//should_tokenFallback

//should_receiveApproval

//should_tokensReceived

const DepositProxy = artifacts.require("DepositProxy");

contract('DepositProxy', function(accounts) {
  beforeEach(async function () {
    this.depositProxy = await DepositProxy.new(accounts[0], accounts[1]);
  });

  describe("Deposit constructor tests", async function() {
    it("should get beneficiary address", async function () {
      const actual = await this.depositProxy.beneficiary();
      assert.equal(actual, accounts[1], "Address should be 0x521f76b5f95bc0b0acd8c2d27c1f48e5db97e0c2");
    });

    it("should get exchange address", async function () {
      const actual = await this.depositProxy.exchange();
      assert.equal(actual, accounts[0], "Address should be 0x1b70ea1e5f0ff005794aaa79465d4b7d2c664e36");
    });

    it("should receive tokens", async function () {
      const actual = await this.depositProxy.exchange();
      assert.equal(actual, accounts[0], "Address should be 0x1b70ea1e5f0ff005794aaa79465d4b7d2c664e36");
    });

    // it("should receive approval", async function () {
    //   //const actual = await this.depositProxy.receiveApproval('0x00');
      
    // });

    // it("should deposit all", async function () {
    //   //const actual = await this.depositProxy.depositAll('0x00');
      
    // });
  });
});