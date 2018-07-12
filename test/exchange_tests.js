//whip venture public clip similar debris minimum mandate despair govern rotate swim

const Exchange = artifacts.require('Exchange');
const Token = artifacts.require('ERC20');
//const assertJump = require("./assertJump.js");

const durationTime = 28; //4 weeks
const alice = '0x521f76b5f95bc0b0acd8c2d27c1f48e5db97e0c2';


contract('Exchange', function(accounts) {
  beforeEach(async function () {
    
    this.exchange = await Exchange.new(accounts[1]);

    this.TokenA = await Token.new(1000, "Token A", 0, "A", {from: accounts[2]});
    this.TokenB = await Token.new(2000, "Token B", 0, "B", {from: accounts[3]});
  });

  describe("Test new exchange features", async function() {

    it("should deploy test tokens", async function () {
      const tokenA = await this.TokenA.name();
      assert.equal(tokenA, "Token A", "Token name should be Token A");

      const tokenB = await this.TokenB.name();
      assert.equal(tokenB, "Token B", "Token name should be Token B");
    });

    it("should deploy with fee account", async function () {
      const actual = await this.exchange.feeAccount.call();
      assert.equal(actual, alice, "Fee account should be 0x521f76b5f95bc0b0acd8c2d27c1f48e5db97e0c2");
    });

    it("should add new trade", async function () {
      const amountBuy = 100;
      const amountSell = 200;
      const expires = 10000;
      const nonce = 0;
      const amount = 10;
      const tradeNonce = 0;

      let tradeValues = [amountBuy, amountSell, expires, nonce, amount, tradeNonce];

      //let addresses = [alice, TOKEN_A, TOKEN_B];

      //await this.exchange.addTrade(tradeValues, addresses);

      //assert.equal(actual, alice, "Fee account should be 0x521f76b5f95bc0b0acd8c2d27c1f48e5db97e0c2");
    });
  });
});