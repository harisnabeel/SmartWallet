// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre  = require("hardhat");
const ethers = require("hardhat");

async function main() {

  accounts = await ethers.getSigners();
  const MinimalForwarder = await ethers.getContractFactory("MinimalForwarder");
  const deployedMinimalForwarder = await MinimalForwarder.deploy();
  await deployedMinimalForwarder.deployed();

  const Wallet = await ethers.getContractFactory("SmartWallet");
  const deployedWallet = await Wallet.deploy(12345,accounts[0].address,[],deployedMinimalForwarder.address);
  await deployedWallet.deployed();


  console.log("Smart Wallet is deployed at: ", deployedWallet.address);
  console.log("MinimalForwarded is deployed at: ", deployedMinimalForwarder.address);

  //  try {
  //   await hre.run("verify:verify", {
  //     address: "0xFe2760466308780acdA940929e6839E4B8C5E812",
  //     constructorArguments:[12345,"0x5BBB883564d0F038D3bBa190028F0250Da57C1dA",[],"0xA2c33FF033edd7AFe713C376212801E5343b95fD"] //["0x0D9818498ba5BB0A4c98aF07b939a272f59B4b87",1659602049,"0x8295026da5cebbE6C7483AeF0fDcA27e0E58FF2A","0x8295026da5cebbE6C7483AeF0fDcA27e0E58FF2A"],
  //   })
  // } catch (error) {
  //   console.log(error,"Error in SmartWallet verification");
  // }
  
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
/*   "MinimalForwarder": "0x5FbDB2315678afecb367f032d93F642f64180aa3", for hardhat 
    "SmartWallet": "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"
    */