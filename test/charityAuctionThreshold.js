const CharityAuctionThreshold = artifacts.require("CharityAuctionThreshold");
const truffleAssert = require("truffle-assertions");

let instance;

before(async function () {
  instance = await CharityAuctionThreshold.deployed();
})

contract("CharityAuctionThreshold", accounts => {

  it("...should store message on first donation.", async () => {
    await instance.changeMessage("New Message", { from: accounts[1], value: 10 });

    // Get stored value
    const message = await instance.message.call();

    assert.equal(message, "New Message", "Message was not set on first donation");
  });

  it("...message should be set when donation is higher than the last", async () => {
    await instance.changeMessage("New Message 2", { from: accounts[2], value: 11});
    const message = await instance.message.call();

    assert.equal(message, "New Message 2", "Message was not set although donation value is higher");
  });

  it("...message should not be able to be set when the donation is not higher than the last", async () => {
    await truffleAssert.reverts(instance.changeMessage("New Message 3", { from: accounts[1], value:  11}), "", "Message was set with a lower donation");
  });

  it("...balance should be threshold - remainingWei", async () => {
    const balance = await web3.eth.getBalance(instance.address);
    const threshold = await instance.threshold.call();
    const remainingWei = await instance.remainingWei.call();
    assert.equal(threshold - remainingWei.toNumber(), balance);
  });

  it("...should withdrawal balance after reaching threshold", async () => {
    const initialBalance = await web3.eth.getBalance(instance.address);
    assert.equal(initialBalance, 21);
    await instance.changeMessage("New Message 4", { from: accounts[2], value: 79});
    const newBalance = await web3.eth.getBalance(instance.address);
    assert.equal(newBalance, 0);
  });

});
