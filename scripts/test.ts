import { ethers } from "hardhat";
require("dotenv").config()

const accountAddres = process.env.ACCOUNT_ADDRESS;
const epa = process.env.ENTRY_POINT_ADDRESS;
const pma = process.env.PAY_MASTER_ADDRESS;
if (!accountAddres || !epa || !pma) {
    console.error("ACCOUNT_ADDRESS | ENTRY_POINT_ADDRESS | PAY_MASTER_ADDRESS is not defined in .env file");
    process.exit(1);
}
const ACCOUNT_ADDRESS = accountAddres
const ENTRY_POINT_ADDRESS = epa;
const PAY_MASTER_ADDRESS = pma;

async function main() {
    const account = await ethers.getContractAt("Account", ACCOUNT_ADDRESS);
    const count = await account.count();
    console.log(count);
    
    console.log(
        "Account balance",
        await ethers.provider.getBalance(ACCOUNT_ADDRESS)
    );

    const entryPoint = await ethers.getContractAt("EntryPoint", ENTRY_POINT_ADDRESS);
    console.log(
        "Account balance on EntryPoint", 
        await entryPoint.balanceOf(ACCOUNT_ADDRESS));

    const balance = await entryPoint.balanceOf(PAY_MASTER_ADDRESS);
    console.log("Paymaster balance on EntryPoint", ethers.formatEther(balance));

}


main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
