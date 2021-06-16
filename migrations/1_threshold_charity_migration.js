var ThresholdRelease = artifacts.require("ThresholdRelease");

module.exports = function(deployer) {
    deployer.deploy(
        ThresholdRelease,
        "Ryan's Campaign",
        "This is a test campaign for my smart contract",
        "Overwrite me!",
        "0x2E5Cd1c99c10fBF4BC1cF60D8820696e73e94f52",
        "1000000000"
    );
}