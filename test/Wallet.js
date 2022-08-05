
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");

describe("SmartWallet",  function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshopt in every test.
  let accounts;
  let deployedWallet,deployedMockerc20,deployedMockerc721;


  beforeEach(async () => {

    accounts = await ethers.getSigners();
    const Wallet = await ethers.getContractFactory("SmartWallet");
    deployedWallet = await Wallet.deploy(12345,accounts[1].address,[]);
    await deployedWallet.deployed();

    // deploy mockerc20
    const mockerc20 = await ethers.getContractFactory("Mockerc20");
    deployedMockerc20 = await mockerc20.deploy();
    await deployedMockerc20.deployed();

    // sending some tokens to deployedsmartwallet
    await deployedMockerc20.transfer(deployedWallet.address,12345);
    
    // deploy erc721
    const mockerc721 = await ethers.getContractFactory("Mockerc721");
    deployedMockerc721 = await mockerc721.deploy();
    await deployedMockerc721.deployed();

    // minting
    await deployedMockerc721.safeMint(deployedWallet.address);
    // console.log(await deployedMockerc20.allowance(deployedWallet.address,accounts[5].address),"this is allowance");
    // console.log(await deployedMockerc20.balanceOf(deployedWallet.address),"this is balance of deployed");
    // console.log(await deployedMockerc20.balanceOf(accounts[0].address),"this is the balace");

    // console.log(deployedWallet.address,"this is deployedaddress");
  });

  it("Should Approve token to another address",async function(){

    // console.log( await deployedMockerc20.balanceOf(deployedWallet.address),"this is balance of wallet");
    // await deployedWallet.invoke(deployedMockerc20.address,0,"0x095ea7b30000000000000000000000009965507d1a55bcc2695c58ba16fb37d819b0a4dc0000000000000000000000000000000000000000000000000000000000003039");
    // console.log(await deployedMockerc20.balanceOf(deployedWallet.address),"this is old balance of deployed Wallet");
    // // transfer it to another account
    // await deployedWallet.invoke(deployedMockerc20.address,0,"0xa9059cbb0000000000000000000000009965507d1a55bcc2695c58ba16fb37d819b0a4dc0000000000000000000000000000000000000000000000000000000000003039");
    // console.log(await deployedMockerc20.balanceOf(deployedWallet.address),"this is new balance of deployed Wallet");    
    // const a = await deployedMockerc20.allowance(deployedWallet.address,accounts[5].address);
    // console.log(a,"this is the allowance");
    // console.log(accounts[5].address,"this is address");
  })

});
