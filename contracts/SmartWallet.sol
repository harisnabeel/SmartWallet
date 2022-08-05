// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Import this file to use console.log
import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";

contract SmartWallet is Ownable{
    uint public dailyWithdrawalLimit;
    address public guardian;
    mapping (address => bool) whiteListed;
    constructor(uint _dailyWithdrawalLimit, address _guardian, address[] memory whiteList){
        require(_dailyWithdrawalLimit>0,"Limit should be greater than 0");
        dailyWithdrawalLimit = _dailyWithdrawalLimit;
        guardian = _guardian;
        for(uint i; i<whiteList.length;i++){
            whiteListed[whiteList[i]] = true;
        }
    }

    function changeGuardian(address _newGuardian) external onlyOwner {
        guardian = _newGuardian;
    }

    function changeWithdrawalLimit(uint _newLimit) external onlyOwner{
        require(_newLimit>0,"Limit should be greater than 0");
        dailyWithdrawalLimit = _newLimit;
    }

        // creates a simple transaction
        function invoke(address _target, uint _value, bytes calldata _data) external  {
        bool success;
        bytes memory result;
        (success, result) = _target.call{value: _value}(_data);
        if (!success) {
            // solhint-disable-next-line no-inline-assembly
            assembly {
                returndatacopy(0, 0, returndatasize())
                revert(0, returndatasize())
            }
        }
    }
}
