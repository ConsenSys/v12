module.exports = {
  networks: {
    development: {
      host: "localhost",
      port: 8545,
      network_id: "*", // Match any network id
      gas: 6721975
    },
    rinkeby:  {
    network_id: 4,
    host: "localhost",
    port: 8545,
    gas: 2900000
  }}
};