// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./TimeoutRelease.sol";
import "./CampaignWithAuction.sol";

contract TimeoutRelease is CampaignWithAuction {
    uint public timeout;

    constructor(string memory _title, string memory _description, string memory _initialMessage, address _charityAddress, uint _timeInDays)
        CampaignWithAuction( _title, _description, _initialMessage, _charityAddress)
    {
        timeout = block.timestamp + (_timeInDays * 1 days);
    }

    function changeMessage(string memory _newMessage) override virtual public payable requiresActiveCampaign {
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
        campaignCompleted = true;
    }
}

