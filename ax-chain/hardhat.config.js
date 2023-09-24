require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.19",
  networks:{
    goerli: {
      url: 'https://goerli.infura.io/v3/a4812158fbab4a2aaa849e6f4a6dc605',
      accounts:['f52959927ca6cf5615a8b7db0d66ef0e9eadb4b93c1ff91941e90af27135dca8'],
    },
    fuji: {
      url: 'https://api.avax-test.network/ext/bc/C/rpc',
      accounts:['f52959927ca6cf5615a8b7db0d66ef0e9eadb4b93c1ff91941e90af27135dca8'],
    },
    mumbai: {
      url: "https://polygon-mumbai.g.alchemy.com/v2/Ksd4J1QVWaOJAJJNbr_nzTcJBJU-6uP3",
      accounts: ['f52959927ca6cf5615a8b7db0d66ef0e9eadb4b93c1ff91941e90af27135dca8'],
    }
  }
};
