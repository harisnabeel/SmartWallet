const { expect } = require("chai");
const { ethers } = require("hardhat");
const { signMetaTxRequest } = require("../src/signer");

async function deploy(name, ...params) {
  const Contract = await ethers.getContractFactory(name);
  return await Contract.deploy(...params).then(f => f.deployed());
}

describe.only("contracts/SmartWallet", function() {
    // let accounts;
    let provider = ethers.provider;
    beforeEach(async function() {
    this.accounts = await ethers.getSigners();
    // accounts = await ethers.getSigners();
    this.forwarder = await deploy('MinimalForwarder');
    console.log(this.forwarder.address,"forwarder address");
    this.smartWallet = await deploy("SmartWallet", 12345,this.accounts[1].address,[],this.forwarder.address);
    console.log(this.smartWallet.address,"Smart Wallet address");
  });

  xit("Toggle Freeze directly", async function() {
    const sender = this.accounts[0];
    const smartWallet = this.smartWallet.connect(sender);
    
    const receipt = await smartWallet.toogleFreeze(true).then(tx => tx.wait());

    expect(await smartWallet.isFreezed()).to.equal(true);
  });

  // doing a meta-transaction.
  it("registers a name via a meta-tx", async function() {
    const signer = this.accounts[0];
    const relayer = this.accounts[3];
    const forwarder = this.forwarder.connect(relayer);
    const smartWallet = this.smartWallet;
    console.log(await smartWallet.isFreezed(),"this is isFreezed before ")
    console.log(await provider.getBalance(this.accounts[0].address),"this is balance before execution");

    const { request, signature } = await signMetaTxRequest(signer.provider, forwarder, {
      from: signer.address,
      to: smartWallet.address,
      data: smartWallet.interface.encodeFunctionData('toogleFreeze', [true]),
    });
    
    await forwarder.execute(request, signature).then(tx => tx.wait());

    console.log(await provider.getBalance(this.accounts[0].address),"this is balance after execution")

    expect(await smartWallet.isFreezed()).to.equal(true);
    console.log(await smartWallet.isFreezed(),"this is result of isFreezeed");
  });
});