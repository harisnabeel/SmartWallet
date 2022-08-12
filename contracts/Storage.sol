// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.10;

import "./interfaces/ITransaction.sol";

contract Storage is ITransaction{
  // storage variables

  // smartWallet contract storage variables

    uint public dailyWithdrawalLimit;
    mapping (address => bool) whiteListed;
    address[] signers;
    mapping (address => bool) isSigner;
    uint signersCount;
    uint threshold; // required to exectute a transaction
    mapping (uint => mapping(address=> bool)) approved; // txID => addressOfSigner => isAlreadyApprovedOrNot
    bool isFreezed;
    bool isMultisigOn;
    uint withdrawedToday;
    uint timeToTodayLimit; // when 24 hours will be completed (for withdrawal limit)
    Transaction[] public transactions; 

    // Guardian contract storage
    address public guardian;
    mapping (uint => bool) public isApprovedByGuardian;
    mapping (uint => bool) public doesRequireGuardianApproval;
}