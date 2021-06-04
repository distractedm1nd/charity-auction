pragma solidity ^0.8.0;

contract CharityAuction {
    string public message;
    address public lastDonater;
    uint public lastDonation;

    address payable public charityAddress;

    // Warning: Instantiating this contract and not it's inheritants will result in locked funds.
    constructor(string memory _initialMessage, address _charityAddress) public {
        message = _initialMessage;
        lastDonation = 0;
        charityAddress = payable(_charityAddress);
    }

    function changeMessage(string memory _newMessage) external payable;

    // How will this get called from oracle? 🤔
    function donateToCharity() internal;

    function fallback() external payable {
        changeMessage("Last donater did not leave a message.");
    }
}

contract CharityAuctionThreshold is CharityAuction {
    uint threshold;

    // Uhh what is standard practice for where to set line breaks?
    constructor(string memory _initialMessage, address _charityAddress, uint _threshold) Constructor(_initialMessage, _charityAddress) public {
        threshold = _threshold;
    }

    function changeMessage(string memory _newMessage) external payable {
        require(msg.value > lastDonation);
        message = _newMessage;
        if(address(this).balance + msg.value >= threshold) {
            donateToCharity();
        }
    }

    function donateToCharity() internal {
        selfdestruct(charityAddress);
    }
}
