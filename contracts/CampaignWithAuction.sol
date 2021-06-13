// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

abstract contract CampaignWithAuction  {
    string public title;
    string public description;
    address payable immutable public charityAddress;

    string public message;
    address public lastDonor;
    uint public lastDonation = 0;
    bool public campaignCompleted = false;


    constructor(string memory _title, string memory _description, string memory _initialMessage, address _charityAddress) {
        title = _title;
        description = _description;
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
