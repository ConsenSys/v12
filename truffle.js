module.exports = {
  networks: {
    unspecified: {
      host: "localhost",
      port: 8545,
      network_id: "*", // Match any network id
      gas: 100000000,
      gasPrice: 10000000000
    },
    rinkeby:  {
    network_id: 4,
    host: "localhost",
    port: 8545,
    gas: 2900000
  }}
};