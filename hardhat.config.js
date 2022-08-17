require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.10",
  networks: {
    local: {
      url: 'http://localhost:8545'
    },
    rinkeby: {
      url: `https://rinkeby.infura.io/v3/${process.env.API_URL}`,
      accounts: [`${process.env.PRIVATE_KEY}`]
    },
  }
};
