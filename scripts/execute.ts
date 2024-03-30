import { ethers } from "hardhat";
require("dotenv").config()

const epa = process.env.ENTRY_POINT_ADDRESS;
const pma = process.env.PAY_MASTER_ADDRESS;
const fa = process.env.FACTORY_ADDRESS;
const fn = process.env.FACTORY_NONCE;
if (!epa || !pma || !fa || !fn ) {
  console.error("ENTRY_POINT_ADDRESS or  PAY_MASTER_ADDRESS or FACTORY_ADDRESS is not defined in .env file");
  process.exit(1);
}
const ENTRY_POINT_ADDRESS = epa;
const PAY_MASTER_ADDRESS = pma;
const FACTORY_ADDRESS = fa;
const FACTORY_NONCE = fn;

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
  const initCode = //"0x"; // to run the second time, uncomment this, and comment below
    FACTORY_ADDRESS + 
    AccountFactory.interface
      .encodeFunctionData("createAccount", [address0])
      .slice(2);
  console.log("* sender", {sender});
  console.log("* initCode = Factory Address + function name will call:", initCode);
  const Account = await ethers.getContractFactory("Account");

  // Deposito 100 ETH from EntryPoint to Paymaster
  await entryPoint.depositTo(PAY_MASTER_ADDRESS, {
    value: ethers. parseEther("100")
  });

    const userOperation = {
    sender,
    nonce: await entryPoint.getNonce(sender,0),
    initCode,
    callData: Account.interface.encodeFunctionData("execute"),
    callGasLimit: 800_000,
    verificationGasLimit: 800_000,
    preVerificationGas: 200_000,
    maxFeePerGas: ethers.parseUnits("10", 'gwei'),
    maxPriorityFeePerGas: ethers.parseUnits("5", 'gwei'),
    paymasterAndData: PAY_MASTER_ADDRESS,
    signature: "0x",
  }
  // Signature security
  const userOpHash = await entryPoint.getUserOpHash(userOperation);
  userOperation.signature= await signer0.signMessage(ethers.getBytes(userOpHash));
  //console.log("* userOperation:", userOperation);

  const tx = await entryPoint.handleOps([userOperation], address0);
  console.log("* tx:", tx);

  const receipt = await tx.wait();
  console.log(receipt);

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
