// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./CharityAuction.sol";

contract CharityAuctionThreshold is CharityAuction {
    uint public threshold;

    // Uhh what is standard practice for where to set line breaks?
    constructor(string memory _initialMessage, address _charityAddress, uint _threshold) CharityAuction(_initialMessage, _charityAddress) {
        threshold = _threshold;
    }

    function remainingWei() public view returns (uint) {
        return address(this).balance - threshold;
    }

    function changeMessage(string memory _newMessage) override public payable {
        require(msg.value > lastDonation);
        message = _newMessage;
        lastDonor = msg.sender;
        lastDonation = msg.value;
        if(address(this).balance + msg.value >= threshold) {
            withdrawalBalanceToCharity();
        }
    }

    function withdrawalBalanceToCharity() internal override {
        charityAddress.transfer(address(this).balance);
    }
}
