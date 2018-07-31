# Notes

## Code as handed over
1. Compile `Exchange.sol` from AuroarDAO with `solc --bin Exchange.sol`
2. `rm -R node_modules`
3. `npm install`

Using Granche "desktop" version, results an `Error: Returned error: sender doesn't have enough funds to send tx. The upfront cost is: 80000000000000000 and the sender's account only has: 0`

4. `npm run test` against `granche-cli`
5. All tests pass

## Using truffle
1. Refactor to use `/contracts` `/migrations` folders
```
mkdir contracts
mkdir migrations
mv *.sol contracts
```
4. Copy `exchange.js` test for truffle to run `truffle test`.  An EVM gas exception is thrown on the `Trade` function of the Exchange.sol contract.
