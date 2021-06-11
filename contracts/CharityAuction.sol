// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

abstract contract CharityAuction {
    string public message;
    address public lastDonor;
    uint public lastDonation = 0;
    bool public campaignCompleted = false;

    address payable public charityAddress;

    constructor(string memory _initialMessage, address _charityAddress) {
        message = _initialMessage;
        charityAddress = payable(_charityAddress);
    }

    function changeMessage(string memory _newMessage) virtual public payable {
        require(msg.value > lastDonation);
        message = _newMessage;
    }

    // How will this get called from oracle? 🤔
    function withdrawalBalanceToCharity() internal virtual;

    modifier requiresActiveCampaign() {
        require(!campaignCompleted);
        _;
    }

    receive() external payable {}
}
