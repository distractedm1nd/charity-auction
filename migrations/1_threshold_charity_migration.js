var ThresholdCharity = artifacts.require("CharityAuctionThreshold");

module.exports = function(deployer) {
    deployer.deploy(ThresholdCharity, "Test Message", "0x1E3dc500A86b568D5010733cfFAA9597Cf65411c", "10000000000000000000");
}