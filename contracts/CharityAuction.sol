// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

abstract contract CharityAuction {
    string public message;
    address public lastDonater;
    uint public lastDonation;

    address payable public charityAddress;

    constructor(string memory _initialMessage, address _charityAddress) {
        message = _initialMessage;
        lastDonation = 0;
        charityAddress = payable(_charityAddress);
    }

    function changeMessage(string memory _newMessage) virtual public payable {
        require(msg.value > lastDonation);
        message = _newMessage;
    }

    // How will this get called from oracle? 🤔
    function donateToCharity() internal virtual;

    receive() external payable {
        changeMessage("Last donater did not leave a message.");
    }
}

contract CharityAuctionThreshold is CharityAuction {
    uint threshold;

    // Uhh what is standard practice for where to set line breaks?
    constructor(string memory _initialMessage, address _charityAddress, uint _threshold) CharityAuction(_initialMessage, _charityAddress) {
        threshold = _threshold;
    }

    function changeMessage(string memory _newMessage) override public payable {
        require(msg.value > lastDonation);
        message = _newMessage;
        if(address(this).balance + msg.value >= threshold) {
            donateToCharity();
        }
    }

    function donateToCharity() internal override {
        selfdestruct(charityAddress);
    }
}
