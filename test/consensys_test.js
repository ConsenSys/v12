'use strict';

const expect = require('chai').expect;
const eth = require('./eth');
const {join} = require('path');
const util = require('./util');
const {generate} = require('ethereumjs-wallet');
const BN = require('bignumber.js');
const Transaction = require('ethereumjs-tx');
const {unitMap, fromDecimal, soliditySha3} = require('web3-utils');
const {property, mapValues, method, partial, bindKey} = require('lodash');
const {flow} = require('lodash/fp');
const compose = require('promise-compose');
const {
  toBuffer,
  hashPersonalMessage,
  ecsign,
  bufferToHex,
} = require('ethereumjs-util');
const curryN = require('lodash/fp/curryN');
const {readFileSync} = require('fs');

const exchangeInterface = JSON.parse(
  readFileSync(join(__dirname, '..', 'Exchange.interface')),
);

const getContractBalance = curryN(3, (contract, user, token) =>
  eth.call({
    to: contract,
    data: eth.encodeFunctionCall(
      {
        name: 'tokens',
        inputs: [
          {
            name: 'token',
            type: 'address',
          },
          {
            name: 'user',
            type: 'address',
          },
        ],
      },
      [token, user],
    ),
  }),
);

const joinCurry3 = curryN(3, join);
const joinToParentDir = joinCurry3(__dirname)('..');

const sendTxCurried = curryN(
  3,
  (
    {gas, gasPrice},
    to,
    {
      from,
      data,
      to: toOverride,
      gas: gasOverride,
      gasPrice: gasPriceOverride,
      value,
    },
  ) =>
    eth.sendTransaction({
      gas: gasOverride || gas,
      gasPrice: gasPriceOverride || gasPrice,
      to: toOverride || to,
      from,
      data,
      value,
    }),
);

const sendOfflineTx = ({data, value, to, from, pk}) =>
  Promise.all([
    eth.getTransactionCount(from, 'pending'),
    eth.getBlock('pending').then(property('gasLimit')),
    eth.getGasPrice(),
  ]).then(([nonce, gas, gasPrice]) => {
    const tx = new Transaction({
      gasLimit: fromDecimal(gas),
      gasPrice: fromDecimal(gasPrice),
      nonce: fromDecimal(nonce),
      data,
      from,
      to,
      value: fromDecimal(value),
    });
    tx.sign(pk);
    return eth.sendSignedTransaction(bufferToHex(tx.serialize()));
  });

const getContractAddressFromTx = compose(
  eth.getTransactionReceipt,
  property('contractAddress'),
);

const wallet = generate();

const ETH_ADDRESS = '0x' + Array(41).join(0);

const uninitialized = () => Promise.reject(Error('Not initialized'));

const aliceWallet = generate();
const bobWallet = generate();
const carolWallet = generate();

const getBalance = (user, token) =>
  eth
    .call({
      to: token,
      data: eth.encodeFunctionCall(
        {
          name: 'balanceOf',
          inputs: [
            {
              name: 'holder',
              type: 'address',
            },
          ],
        },
        [user],
      ),
    })
    .then(util.toBN)
    .then(method('toPrecision'));

describe('IDEX contract v2 updates', () => {
  let from,
    gas,
    gasPrice,
    exchangeContract,
    accounts,
    erc20Contract,
    erc20Contract2,
    eip777Contract,
    erc223Contract,
    erc223Contract2;
  let getCurrentContractBalance = curryN(2, uninitialized);
  let createContract = uninitialized,
    sendTx = uninitialized,
    sendEther = uninitialized,
    createContractFromFile = uninitialized,
    sendExchangeTx = uninitialized;
  before(() =>
    eth
      .getAccounts()
      .then(_accounts => (accounts = _accounts))
      .then(([_from]) => (from = _from))
      .then(() => eth.getGasPrice())
      .then(_gasPrice => (gasPrice = _gasPrice))
      .then(() => eth.getBlock('pending'))
      .then(property('gasLimit'))
      .then(_gas => (gas = _gas))
      .then(() => {
        createContract = compose(
          sendTxCurried({gas, gasPrice})(undefined),
          getContractAddressFromTx,
        );
        createContractFromFile = compose(
          util.readFileAsUtf8,
          bindKey(JSON, 'parse'),
          util.addHexPrefix,
          data => ({
            from,
            data,
          }),
          createContract,
        );
        sendTx = sendTxCurried({gas, gasPrice});
        sendEther = sendTx(undefined);
      })
      .then(() =>
        sendEther({
          to: wallet.getAddressString(),
          from,
          value: unitMap.ether,
        }),
      )
      .then(() => eth.getCode('0x9aa513f1294c8f1b254ba1188991b4cc2efe1d3b'))
      .then(code => util.toBN(code))
      .then(method('toPrecision'))
      .then(
        v =>
          v === '0' &&
          sendEther({
            to: '0xc253917a2b4a2b7f43286ae500132dae7dc22459',
            from,
            value: unitMap.ether,
          }).then(() => eth.sendSignedTransaction(require('./registry.json'))),
      )
      .then(() => createContractFromFile('Exchange.bytecode'))
      .then(contractAddress => (exchangeContract = contractAddress))
      .then(
        contractAddress =>
          (getCurrentContractBalance = getContractBalance(contractAddress)),
      )
      .then(() => createContractFromFile('ERC20.bytecode'))
      .then(tokenContract => (erc20Contract = tokenContract))
      .then(() => createContractFromFile('EIP777.bytecode'))
      .then(tokenContract => (eip777Contract = tokenContract))
      .then(() => createContractFromFile('ERC223.bytecode'))
      .then(tokenContract => (erc223Contract = tokenContract))
      .then(() => createContractFromFile('ERC223.bytecode'))
      .then(tokenContract => (erc223Contract2 = tokenContract))
      .then(() => createContractFromFile('ERC20.bytecode'))
      .then(tokenContract => (erc20Contract2 = tokenContract))
      .then(() => {
        sendExchangeTx = sendTx(exchangeContract);
      }),
  );
  
  
  describe('trade function', () => {
    before(() =>
      sendEther({
        from,
        to: aliceWallet.getAddressString(),
        value: unitMap.ether,
      })
        .then(() =>
          sendEther({
            from,
            to: bobWallet.getAddressString(),
            value: unitMap.ether,
          }),
        )
        .then(() =>
          sendTx(erc20Contract)({
            from,
            data: eth.encodeFunctionCall(
              {
                name: 'transfer',
                inputs: [
                  {
                    name: 'beneficiary',
                    type: 'address',
                  },
                  {
                    name: 'amount',
                    type: 'uint256',
                  },
                ],
              },
              [aliceWallet.getAddressString(), unitMap.ether],
            ),
          }),
        )
        // .then(() =>
        //   sendOfflineTx({
        //     from: takerWallet.getAddressString(),
        //     to: exchangeContract,
        //     data: eth.encodeFunctionCall(
        //       {
        //         name: 'deposit',
        //         inputs: [
        //           {
        //             type: 'address',
        //             name: 'beneficiary',
        //           },
        //         ],
        //       },
        //       [ETH_ADDRESS],
        //     ),
        //     value: '1000',
        //     pk: takerWallet.getPrivateKey(),
        //   }),
        // )
        // .then(() =>
        //   sendOfflineTx({
        //     from: makerWallet.getAddressString(),
        //     to: erc20Contract,
        //     data: eth.encodeFunctionCall(
        //       {
        //         name: 'approveAndCall',
        //         inputs: [
        //           {
        //             name: 'beneficiary',
        //             type: 'address',
        //           },
        //           {
        //             name: 'amount',
        //             type: 'uint256',
        //           },
        //           {
        //             name: 'data',
        //             type: 'bytes',
        //           },
        //         ],
        //       },
        //       [exchangeContract, '10000', '0x'],
        //     ),
        //     value: '0',
        //     pk: makerWallet.getPrivateKey(),
        //   }),
        //),
    );

    it('change to limit order', () => {
      const contractAddress = exchangeContract;
      const tokenBuy = ETH_ADDRESS;
      const amoutBuy = '0';
      const tokenSell = erc20Contract;
      const amountSell = '100';
      const expires = '10000';
      const nonce = '0';

      
      const bob = bobWallet.getAddressString();
      //const carol = carolWallet.getAddressString();
      
      const orderHash = soliditySha3(
        {
          t: 'address',
          v: contractAddress,
        },
        {
          t: 'address',
          v: tokenBuy,
        },
        {
          t: 'uint256',
          v: amountBuy,
        },
        {
          t: 'address',
          v: tokenSell,
        },
        {
          t: 'uint256',
          v: amountSell,
        },
        {
          t: 'uint256',
          v: expires,
        },
        {
          t: 'uint256',
          v: nonce,
        },
        {
          t: 'address',
          v: bob,
        },
      );

      const amount = '100';
      const alice = aliceWallet.getAddressString();
      const tradeNonce = '0';
      const tradeHash = soliditySha3(
        {
          t: 'bytes32',
          v: orderHash,
        },
        {
          t: 'uint256',
          v: amount,
        },
        {
          t: 'address',
          v: alice,
        },
        {
          t: 'uint256',
          v: tradeNonce,
        },
      );

      const {v, r, s} = mapValues(
        ecsign(
          hashPersonalMessage(toBuffer(orderHash)),
          aliceWallet.getPrivateKey(),
        ),
        (v, k) => (k === 'v' ? v : bufferToHex(v)),
      );

      const {v: tradeV, r: tradeR, s: tradeS} = mapValues(
        ecsign(
          hashPersonalMessage(toBuffer(tradeHash)),
          bobWallet.getPrivateKey(),
        ),
        (v, k) => (k === 'v' ? v : bufferToHex(v)),
      );

      const feeMake = new BN('0.00001').times(unitMap.ether).toPrecision();
      const feeTake = feeMake;
      return sendExchangeTx({
        from,
        data: eth.encodeFunctionCall(
          {
            name: 'trade',
            inputs: [
              {
                type: 'uint256[8]',
                name: 'tradeValues',
              },
              {
                type: 'address[4]',
                name: 'tradeAddresses',
              },
              {
                type: 'uint8[2]',
                name: 'v',
              },
              {
                type: 'bytes32[4]',
                name: 'rs',
              },
            ],
          },
          [
            [
              amountBuy,
              amountSell,
              expires,
              nonce,
              amount,
              tradeNonce,
              feeMake,
              feeTake,
            ],
            [tokenBuy, tokenSell, user, bob],
            [v, tradeV],
            [r, s, tradeR, tradeS],
          ],
        ),
      })
        .then(() => getCurrentContractBalance(bob, erc20Contract))
        .then(balance => util.toBN(balance).toPrecision())
        .then(balance => expect(balance).to.eql('10000'));
    });
  });
});
