# Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a Hardhat Ignition module that deploys that contract.

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat ignition deploy ./ignition/modules/Lock.ts
```


# Vidio Part II
https://www.youtube.com/watch?v=NM04uxcCOEw

# eth-infinitismo account-abstraction
https://github.com/eth-infinitism/account-abstraction

# https://www.npmjs.com/package/@account-abstraction/contracts
npm i @account-abstraction/contracts@0.6.0

## Error (SCRIPT-EP):
```shell
Warning: Contract code size is 29773 bytes and exceeds 24576 bytes (a limit introduced in Spurious Dragon). This contract may not be deployable on Mainnet. Consider enabling the optimizer (with a low "runs" value!), turning off revert strings, or using libraries.
  --> @account-abstraction/contracts/core/EntryPoint.sol:22:1:
   |
22 | contract EntryPoint is IEntryPoint, StakeManager, NonceManager, ReentrancyGuard {
   | ^ (Relevant source part starts here and spans across multiple lines).


Compiled 15 Solidity files successfully (evm target: paris).
ProviderError: Error: Transaction reverted: trying to deploy a contract whose code is too large
    at HttpProvider.request (/home/jairo/Development/blockchain/erc-4337/alchemy/smart-accounts/node_modules/hardhat/src/internal/core/providers/http.ts:90:21)
    at processTicksAndRejections (node:internal/process/task_queues:95:5)
    at async HardhatEthersSigner.sendTransaction (/home/jairo/Development/blockchain/erc-4337/alchemy/smart-accounts/node_modules/@nomicfoundation/hardhat-ethers/src/signers.ts:125:18)
    at async ContractFactory.deploy (/home/jairo/Development/blockchain/erc-4337/alchemy/smart-accounts/node_modules/ethers/src.ts/contract/factory.ts:111:24)
    at async main (/home/jairo/Development/blockchain/erc-4337/alchemy/smart-accounts/scripts/entrypoint-deploy.ts:4:20)
```
## Solution: Foi preciso comentar a versão do solidity e fazer a modificação abaixo. 
### The expanded usage allows for more control of the compiler:
- https://hardhat.org/hardhat-runner/docs/guides/compile-contracts

```typescript
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  //solidity: "0.8.24",
  defaultNetwork: "localhost",
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: {
        enabled: true,
        runs: 1000,
      }
    }
  }
};

export default config;
```

### Error (SCRIPT-EX): Não é um valor hexadecimal valido, 0x não é um valor valido hexadecimal:
```shell
TypeError: invalid BytesLike value (argument="value", value="0xe7f1725E7734CE288F8367e1Bb143E90bb3F05120x9859387b000000000000000000000000f39fd6e51aad88f6f4ce6ab8827279cfffb92266", code=INVALID_ARGUMENT, version=6.11.1)
```
### Solução: acrescentar o .slice(2) no final
```typescript
const initCode = FACTORY_ADDRESS + AccountFactory.interface.encodeFunctionData("createAccount", [address0]).slice(2);
```

### Error: Sempre que vem AA como mensagem de error quer dirzer que eh uma mensagem do EntryPoint contract:
```shell
ProviderError: Error: VM Exception while processing transaction: reverted with custom error 'FailedOp(0, "AA13 initCode failed or OOG")'
### Error: Não é um valor hexadecimal valido, 0x não é um valor valido hexadecimal:
```


# SCRIPT-EP >>> Deploy do EntryPoint
npx hardhat run scripts/entrypoint-deploy.ts --network localhost
# SCRIPT-AF >>> Deploy do AccountFactory
npx hardhat run scripts/account-factory-deploy.ts --network localhost
# SCRIPT-EX >>> Execute user operation
npx hardhat run scripts/execute.js --network localhost
# SCRIPT-T  >>> Run test
npx hardhat run scripts/test.ts --network localhost