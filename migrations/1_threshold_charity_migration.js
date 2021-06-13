var ThresholdRelease = artifacts.require("ThresholdRelease");

module.exports = function(deployer) {
    deployer.deploy(
        ThresholdRelease,
        "Example Campaign",
        "This is a test campaign for my smart contract",
        "Test Message",
        "0x1E3dc500A86b568D5010733cfFAA9597Cf65411c",
        "10000"
    );
}