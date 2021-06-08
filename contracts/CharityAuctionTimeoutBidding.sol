// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./CharityAuctionTimeout.sol";

// Fun variation, or maybe its just the beer talking
contract CharityAuctionTimeoutBidding is CharityAuctionTimeout {
    uint incrementalTimeout;

    constructor(string memory _initialMessage, address _charityAddress, uint _timeout) CharityAuctionTimeout(_initialMessage, _charityAddress, _timeout) {
        incrementalTimeout = _timeout;
    }

    function changeMessage(string memory _newMessage) override public payable {
        require(msg.value > lastDonation);
        if(block.timestamp >= timeout) {
            withdrawalBalanceToCharity();
        } else {
            timeout += incrementalTimeout;
        }
        lastDonor = msg.sender;
        lastDonation = msg.value;
        message = _newMessage;
    }
}
