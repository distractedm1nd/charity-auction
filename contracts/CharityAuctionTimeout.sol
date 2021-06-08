// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./CharityAuctionTimeout.sol";
import "./CharityAuction.sol";

contract CharityAuctionTimeout is CharityAuction {
    uint timeout;

    constructor(string memory _initialMessage, address _charityAddress, uint _timeout) CharityAuction(_initialMessage, _charityAddress) {
        timeout = block.timestamp + _timeout;
    }

    function changeMessage(string memory _newMessage) override virtual public payable {
        require(msg.value > lastDonation);
        if(block.timestamp >= timeout) {
            withdrawalBalanceToCharity();
        }
        lastDonor = msg.sender;
        lastDonation = msg.value;
        message = _newMessage;
    }

    function withdrawalBalanceToCharity() internal override {
        charityAddress.transfer(address(this).balance);
    }
}

