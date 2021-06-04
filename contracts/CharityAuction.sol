pragma solidity ^0.8.0;

contract CharityAuction {
    string public message;
    address public lastDonater;
    uint public lastDonation;

    address payable public charityAddress;

    constructor(string memory _initialMessage, address _charityAddress) public {
        message = _initialMessage;
        lastDonation = 0;
        charityAddress = payable(_charityAddress);
    }

    function changeMessage(string memory _newMessage) external payable {
        require(msg.value > last_donation);
        message = _newMessage;
    }

    // How will this get called? 🤔
    function donateToCharity() internal {
        selfdestruct(charityAddress);
    }

    function fallback() external payable {
        changeMessage("Last donater did not leave a message.");
    }
}
