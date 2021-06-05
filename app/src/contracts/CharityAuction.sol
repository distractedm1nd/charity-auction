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

contract CharityAuctionTimeout is CharityAuction {
    uint timeout;

    constructor(string memory _initialMessage, address _charityAddress, uint _timeout) CharityAuction(_initialMessage, _charityAddress) {
        timeout = block.timestamp + _timeout;
    }

    function changeMessage(string memory _newMessage) override virtual public payable {
        require(msg.value > lastDonation);
        if(block.timestamp >= timeout) {
            donateToCharity();
        }
        message = _newMessage;
    }

    // Is self destructing really the right choice here?
    function donateToCharity() internal override {
        selfdestruct(charityAddress);
    }
}

// Fun variation, or maybe its just the beer talking 
contract CharityAuctionTimeoutBidding is CharityAuctionTimeout {
    uint incrementalTimeout;

    constructor(string memory _initialMessage, address _charityAddress, uint _timeout) CharityAuctionTimeout(_initialMessage, _charityAddress, _timeout) {
        incrementalTimeout = _timeout;
    }

    function changeMessage(string memory _newMessage) override public payable {
        require(msg.value > lastDonation);
        if(block.timestamp >= timeout) {
            donateToCharity();
        } else {
            timeout += incrementalTimeout;
        }
        message = _newMessage;
    }
}