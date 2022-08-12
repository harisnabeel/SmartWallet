// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.10;

// Import this file to use console.log
import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "./interfaces/ITransaction.sol";
import "./Storage.sol";
import "./Modifiers.sol";

contract Guardian is Ownable, ITransaction,Storage,Modifiers{



    constructor(address _guardian) {
        guardian = _guardian;
    }

    function changeGuardian(address _newGuardian) external onlyOwner {
        guardian = _newGuardian;
    }

    function guardianApproval(uint _gTxId) external txExists(_gTxId) onlyGuardian{
        isApprovedByGuardian[_gTxId] = true;
    }

}