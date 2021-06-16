const path = require("path");
require('dotenv').config()
const HDWalletProvider = require("@truffle/hdwallet-provider");
const privateKey = process.env.PRIVATE_KEY;

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  compilers: {
    solc: {
      version: "^0.8.0"
    }
  },
  contracts_build_directory: path.join(__dirname, "app/src/contracts"),
  networks: {
    rinkeby: {
      provider: function () {
        return new HDWalletProvider({
          privateKeys: [privateKey],
          providerOrUrl: `https://rinkeby.infura.io/v3/${process.env.INFURA_RINKEBY}`
      })
      },
      gas: 1000000,
      gasPrice: 1000000000,
      network_id: 4
    }
  }
};
