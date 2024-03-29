import { ethers } from "hardhat";

async function main() {
  const entryPoint = await ethers.deployContract("EntryPoint");
  await entryPoint.waitForDeployment();
  console.log(`    Contract EntryPoint deployed to ${entryPoint.target}`);
  
  const paymaster = await ethers.deployContract("Paymaster");
  await paymaster.waitForDeployment();
  console.log(`     Contract Paymaster deployed to ${paymaster.target}`);
  
  const accountFactory = await ethers.deployContract("AccountFactory");
  await accountFactory.waitForDeployment();
  console.log(`Contract AccountFactory deployed to ${accountFactory.target}`);
  
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
