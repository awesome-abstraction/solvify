require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.19",
  networks:{
    goerli: {
      url: 'https://goerli.infura.io/v3/a4812158fbab4a2aaa849e6f4a6dc605',
    },
    fuji: {
      url: 'https://api.avax-test.network/ext/bc/C/rpc',
    },
    mumbai: {
      url: "https://polygon-mumbai.g.alchemy.com/v2/Ksd4J1QVWaOJAJJNbr_nzTcJBJU-6uP3",
    },
    arb: {
      url: "https://goerli-rollup.arbitrum.io/rpc",
    },
    linea: {
      url: "https://rpc.goerli.linea.build",
    },
  }
};
