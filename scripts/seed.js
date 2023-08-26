const hre = require("hardhat");
const config = require('../src/config.json')

async function main() {
  console.log(`Fetching accounts & network...\n`)

  	const accounts = await ethers.getSigners()

	const hardhat0 = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'
	const hardhat1 = '0x70997970C51812dc3A010C7d01b50e0d17dc79C8'
	const hardhat2 = '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC'
	const hardhat3 = '0x90F79bf6EB2c4f870365E785982E1f101E93b906'
	const hardhat4 = '0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65'

  let transaction

  // Fetch network
  const { chainId } = await ethers.provider.getNetwork()

  // Fetch deployed crowdsale
  const crowdsale = await ethers.getContractAt('Crowdsale', config[chainId].crowdsale.address)
  console.log(`Crowdsale fetched: ${crowdsale.address}\n`)

let addToWhitelist = await crowdsale.whitelist(hardhat0)
await addToWhitelist.wait()

console.log(`${hardhat0} added to whitelist`)

addToWhitelist = await crowdsale.whitelist(hardhat1)
await addToWhitelist.wait()

console.log(`${hardhat1} added to whitelist`)

addToWhitelist = await crowdsale.whitelist(hardhat2)
await addToWhitelist.wait()

console.log(`${hardhat2} added to whitelist`)

addToWhitelist = await crowdsale.whitelist(hardhat3)
await addToWhitelist.wait()

console.log(`${hardhat3} added to whitelist`)

addToWhitelist = await crowdsale.whitelist(hardhat4)
await addToWhitelist.wait()

console.log(`${hardhat4} added to whitelist`)

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});