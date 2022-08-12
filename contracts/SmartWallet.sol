// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.10;

// Import this file to use console.log
import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155Receiver.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "./Guardian.sol";
import "./Storage.sol";
import "./Modifiers.sol";

contract SmartWallet is Guardian, IERC721Receiver{

    // events

    event Submit(uint indexed txId);
    event Approve(address indexed owner, uint indexed txId);
    event Execute(uint indexed txId);
    event Revoke(address indexed signer, uint indexed txId); 




    // functions
    constructor(uint _dailyWithdrawalLimit, address _guardian, address[] memory whiteList) Guardian(_guardian){
        require(_dailyWithdrawalLimit>0,"Limit should be greater than 0");
        dailyWithdrawalLimit = _dailyWithdrawalLimit;
        for(uint i; i<whiteList.length;i++){
            whiteListed[whiteList[i]] = true;
        }
    }

    receive() external payable{}


    function changeWithdrawalLimit(uint _newLimit) external onlyOwner{
        require(_newLimit>0,"Limit should be greater than 0");
        dailyWithdrawalLimit = _newLimit;
    }

        // creates a simple transaction
        function invoke(Transaction memory _tx) external onlyOwner  whenNotFreezed whenMultiSigDisabled{
        bool success;
        bytes memory result;
        // checks if transaction requires guardian assistance
        if(withdrawedToday+_tx.value > dailyWithdrawalLimit){
            submitTx(_tx);
            doesRequireGuardianApproval[transactions.length-1] = true;
            updateTime();
        }
        else{
            withdrawedToday +=  _tx.value;
            (success, result) = _tx.target.call{value: _tx.value}(_tx.data);
            if (!success) {
                // solhint-disable-next-line no-inline-assembly
                assembly {
                    returndatacopy(0, 0, returndatasize())
                    revert(0, returndatasize())
                }
            }
        }
    }

    function toogleFreeze(bool freeze) external onlyOwner {
        require(freeze!=isFreezed,"Already in desired state");
        isFreezed = freeze;
    }

    function enableMultisig(address[] memory _signers,uint _threshold) external onlyOwner whenNotFreezed{
        require(!isMultisigOn,"Already enabled");
        require(_threshold>0,"Approvals can't be zero");
        require(_signers.length>2,"Must have atleast 2 signers");
        require(_threshold<=_signers.length,"Threshold must be <= Singers");
        for(uint i; i<_signers.length;i++){
            isSigner[_signers[i]] = true;
        }
        isMultisigOn = true;
        threshold = _threshold;
        signers = _signers;
    }

    function disableMultisig() external onlyOwner whenNotFreezed{
        require(isMultisigOn,"Already Disabled");
        isMultisigOn = false;
        // disabling old signers
        for(uint i; i<signers.length;i++){
            isSigner[signers[i]] = false;
        }
        address[] memory emptyArray;
        signers = emptyArray;
    }

    // TODO: needs to modify onlyOwner modifier for multisig
    // when multisig is enabled, use this function
    function submitTx(Transaction memory _tx) public onlySigners{

       if(withdrawedToday+_tx.value > dailyWithdrawalLimit){
            doesRequireGuardianApproval[transactions.length-1] = true;
            updateTime();
       }

       withdrawedToday+=_tx.value;

        transactions.push(Transaction({
            target: _tx.target,
            value: _tx.value,
            data: _tx.data,
            executed: false
        }));

        approved[transactions.length-1][msg.sender] = true;

        emit Submit(transactions.length-1);
    }

    function approve(uint _txId) external 
        
        txExists(_txId)
        notApproved(_txId)
        notExecuted(_txId)
    {
        approved[_txId][msg.sender] = true;
        emit Approve(msg.sender,_txId);

        // execute the transaction if the threshold is reached
        if(getApprovalCount(_txId)>= threshold){
            if(doesRequireGuardianApproval[_txId] )
            {
                if(isApprovedByGuardian[_txId]){
                    this.execute(_txId);
                }
            }
            else{
                this.execute(_txId);
            }
        }

    }

    function revokeApproval(uint _txId) external 
    txExists(_txId) 
    notExecuted(_txId){
        require(approved[_txId][msg.sender],"Tx not approved");
        approved[_txId][msg.sender] = false;
        emit Revoke(msg.sender,_txId);
    } 

    function getApprovalCount(uint _txId) private view returns(uint count){
        for(uint i; i<signers.length; i++){
            if(approved[_txId][signers[i]]){
                count = count + 1;
            }
        }
        
    }

    // when multisig is enabled, call this method to execute transaction
    function execute(uint _txId) external txExists(_txId) notExecuted(_txId) {
        if(doesRequireGuardianApproval[_txId]){
            if(!isApprovedByGuardian[_txId]){
                revert("Transaction requires Guradian Approval");
            }
        }
        require(getApprovalCount(_txId)>= threshold, "Approvals are not enough");
        Transaction storage transaction = transactions[_txId];
        transaction.executed = true;

        bool success;
        bytes memory result;
        (success, result) = transaction.target.call{value: transaction.value}(transaction.data);
        if (!success) {
            assembly {
                returndatacopy(0, 0, returndatasize())
                revert(0, returndatasize())
            }
        }
        
        emit Execute(_txId);
    }

    function updateTime() internal {
        if(block.timestamp>=timeToTodayLimit){
        timeToTodayLimit = block.timestamp + 24 hours;
        withdrawedToday = 0;
        }
    }

   function onERC721Received(
        address operator,
        address from,
        uint256 tokenId,
        bytes calldata data
    ) external returns (bytes4){
        return this.onERC721Received.selector;
    }

    function onERC1155Received(
        address operator,
        address from,
        uint256 id,
        uint256 value,
        bytes calldata data
    ) external returns (bytes4){
        return this.onERC1155Received.selector;
    }
    // function executeGuardianTx(uint _gTxId) external {
    //     require(isApprovedByGuardian[_gTxId], "Not approved by guardian yet");
    //     if(isMultisigOn){
    //         require(getApprovalCountGuardian(_gTxId)>= threshold, "Approvals are not enough");
    //     }
    //     Transaction storage transaction = guardianTxs[_gTxId];
    //     transaction.executed = true;

    //     bool success;
    //     bytes memory result;
    //     (success, result) = transaction.target.call{value: transaction.value}(transaction.data);
    //     if (!success) {
    //         assembly {
    //             returndatacopy(0, 0, returndatasize())
    //             revert(0, returndatasize())
    //         }
    //     }
    // }

}
