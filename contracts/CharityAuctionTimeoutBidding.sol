// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./CharityAuctionTimeout.sol";

contract CharityAuctionTimeoutBidding is CharityAuctionTimeout {
    uint incrementalTimeout;

    constructor(string memory _initialMessage, address _charityAddress, uint _timeInDays)
    CharityAuctionTimeout(_initialMessage, _charityAddress, _timeInDays)
    {
        incrementalTimeout = _timeInDays * 1 days;
    }

    function changeMessage(string memory _newMessage) override public payable requiresActiveCampaign {
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
