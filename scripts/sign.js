const { ethers } = require('hardhat');
const { signMetaTxRequest } = require('../src/signer');
const { readFileSync, writeFileSync } = require('fs');

const DEFAULT_NAME = 'sign-test';

function getInstance(name) {
  const address = JSON.parse(readFileSync('deploy.json'))[name];
  if (!address) throw new Error(`Contract ${name} not found in deploy.json`);
  return ethers.getContractFactory(name).then(f => f.attach(address));
}

async function main() {
  const forwarder = await getInstance('MinimalForwarder');
  const registry = await getInstance("SmartWallet");
  console.log(registry.address,'this is SmartWallet address')
  
  const { NAME: name, PRIVATE_KEY: signer } = process.env;
  const from = new ethers.Wallet(signer).address;
  console.log(`Signing registration of ${name || DEFAULT_NAME} as ${from}...`);
  const data = registry.interface.encodeFunctionData('register', [name]);
  // console.log(data,"this is data in sign.js");
  const result = await signMetaTxRequest(signer, forwarder, {
    from: from ,to: registry.address, data:data
  });

  writeFileSync('./scripts/tmp/request.json', JSON.stringify(result, null, 2));
  console.log(`Signature: `, result.signature);
  console.log(`Request: `, result.request);
}

if (require.main === module) {
  main().then(() => process.exit(0))
    .catch(error => { console.error(error); process.exit(1); });
}