// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.10;


import "./Storage.sol";

contract Modifiers is Storage{

        // modifiers
    modifier txExists(uint _txId){
        require(_txId < transactions.length,"Tx does not exist");
        _;
    }

    modifier notApproved(uint _txId){
        require(!approved[_txId][msg.sender],"Already approved");
        _;
    }

    modifier notExecuted(uint _txId){   
    require(!transactions[_txId].executed,"Transaction already executed");
    _;
    }

    modifier whenNotFreezed {
        require(!isFreezed,"Account is freezed");
        _;
    }

    modifier whenMultiSigDisabled{
        require(!isMultisigOn,"Use Multisig function");
        _;
    }

    modifier onlyGuardian {
    require(msg.sender==guardian,"Only guardian can approve");
    _;
    }

    modifier onlySigners {
       require(isSigner[msg.sender],"Caller should be a signer");
       _;
    }

}