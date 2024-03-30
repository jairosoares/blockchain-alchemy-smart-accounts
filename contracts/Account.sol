// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.12;

import "@account-abstraction/contracts/core/EntryPoint.sol";
import "@account-abstraction/contracts/interfaces/IAccount.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "hardhat/console.sol";

contract Account is IAccount {

    uint256 public count;
    address public owner;

    constructor (address _owner) {
        owner = _owner;
    }

    // Parameter names were removed!?
    function validateUserOp(
        UserOperation calldata userOp,
        bytes32 userOpHash,
        uint256 
    ) external view override returns (uint256 validationData) {
        console.log("* Validating...");
        //address recovered = ECDSA.recover(ECDSA.toEthSignedMessageHash(keccak256("wee")), userOp.signature);
        address recovered = ECDSA.recover(ECDSA.toEthSignedMessageHash(userOpHash), userOp.signature);
        console.log(recovered);
        return owner == recovered ? 0 : 1;
    }

    function execute() external {
        count++;
    }

}

contract AccountFactory {
    
    function createAccount(address owner) external returns (address) {
        Account acc = new Account(owner);
        return address(acc);
    }

}