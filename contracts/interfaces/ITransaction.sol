// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.10;
 interface ITransaction {
        // struct
    struct Transaction {
        address target;
        uint value;
        bytes data;
        bool executed;
    }
 }