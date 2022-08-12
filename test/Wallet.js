
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
    // await deployedMockerc721.safeMint(deployedWallet.address);
    // console.log(await deployedMockerc20.allowance(deployedWallet.address,accounts[5].address),"this is allowance");
    // console.log(await deployedMockerc20.balanceOf(deployedWallet.address),"this is balance of deployed");
    // console.log(await deployedMockerc20.balanceOf(accounts[0].address),"this is the balace");

    // console.log(deployedWallet.address,"this is deployedaddress");
  });

  xit("Should transfer tokens to another address",async function(){

    // console.log( await deployedMockerc20.balanceOf(deployedWallet.address),"this is balance of wallet");
    // // approving tokens to a deployed wallet
    // await deployedWallet.invoke([deployedMockerc20.address,0,"0x095ea7b30000000000000000000000009965507d1a55bcc2695c58ba16fb37d819b0a4dc0000000000000000000000000000000000000000000000000000000000003039"]);
    console.log(await deployedMockerc20.balanceOf(deployedWallet.address),"this is old balance of deployed Wallet");
    // // transfer it to another account
    await deployedWallet.invoke([deployedMockerc20.address,0,"0xa9059cbb0000000000000000000000009965507d1a55bcc2695c58ba16fb37d819b0a4dc0000000000000000000000000000000000000000000000000000000000003039"]);
    console.log(await deployedMockerc20.balanceOf(deployedWallet.address),"this is new balance of deployed Wallet");    
 
  })

  it("Should be able to perform a multisig transaction", async function(){

    // first enable multisig
    await deployedWallet.enableMultisig([accounts[0].address ,accounts[6].address,accounts[7].address],2);

    // creates a transaction that=> transfers erc20 token to an address
    await deployedWallet.submitTx([deployedMockerc20.address,0,"0xa9059cbb000000000000000000000000bcd4042de499d14e55001ccbb24a551f3b9540960000000000000000000000000000000000000000000000000000000000003039"]);
    
    // now signer 2 approves tx that=> should execute the transaction because threshold is 2
    await deployedWallet.connect(accounts[7]).approve(0);

    // now checking balance if account[10] balance updaated after approval and execution simultaneoulsy
    console.log(await deployedMockerc20.balanceOf(accounts[10].address),'this is balance of account 10');

    // disabling multisig
    await deployedWallet.disableMultisig();
  })

});
