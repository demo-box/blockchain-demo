import { ethers } from "hardhat";

(async () => {
  const [account1, account2] = await ethers.getSigners();
  // 创建Bank合约并给它30个eth
  const Bank = await ethers.getContractFactory("Bank");
  const bank = await Bank.connect(account2).deploy({ value: ethers.utils.parseEther('30') });
  await bank.deployed();
  console.log("The address of the bank contract is:", bank.address);
  // 创建attacker合约，并给它1个eth
  const Attacker = await ethers.getContractFactory("Attacker");
  const attacker = await Attacker.connect(account1).deploy(bank.address, { value: ethers.utils.parseEther('1') });
  await attacker.deployed();
  console.log("The address of the attacker contract is:", attacker.address);

  try {
    await attacker.attack();
  } catch (err: any) {
    console.log(err.message);
  }
  const balance = await ethers.provider.getBalance(bank.address);
  console.log('The balance of bank is:', balance);
  console.log('The balance of attacker is:', await ethers.provider.getBalance(attacker.address));
})();
