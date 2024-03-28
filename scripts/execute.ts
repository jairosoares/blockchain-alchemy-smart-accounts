import { ethers } from "hardhat";

const ENTRY_POINT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3"
const FACTORY_ADDRESS = "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9";
const FACTORY_NONCE = 1;

async function main() {
  console.log("* Executing...");
  const [signer0] = await ethers.getSigners();
  const address0 = await signer0.getAddress();
  console.log("* address0:", address0);

  const entryPoint = await ethers.getContractAt("EntryPoint", ENTRY_POINT_ADDRESS);
  
  const sender = ethers.getCreateAddress({
    from: FACTORY_ADDRESS,
    nonce: FACTORY_NONCE
  });

  const AccountFactory = await ethers.getContractFactory("AccountFactory");
  const initCode = "0x";
    //FACTORY_ADDRESS + 
    //AccountFactory.interface
    //  .encodeFunctionData("createAccount", [address0])
    //  .slice(2);
  console.log("* sender", sender);
  console.log("* initCode = Factory Address + function name will call:", initCode);
  const Account = await ethers.getContractFactory("Account");

  /*
  await entryPoint.depositTo(sender, {
    value: ethers. parseEther("100")
  })
  */

  const userOperation = {
    sender,
    nonce: await entryPoint.getNonce(sender,0),
    initCode,
    callData: Account.interface.encodeFunctionData("execute"),
    callGasLimit: 200_000,
    verificationGasLimit: 200_000,
    preVerificationGas: 50_000,
    maxFeePerGas: ethers.parseUnits("10", 'gwei'),
    maxPriorityFeePerGas: ethers.parseUnits("5", 'gwei'),
    paymasterAndData: "0x",
    signature: "0x"
  }

  console.log("* userOperation:", userOperation);
  const tx = await entryPoint.handleOps([userOperation], address0);
  console.log("* tx:", tx);

  const receipt = await tx.wait();
  console.log(receipt);

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
