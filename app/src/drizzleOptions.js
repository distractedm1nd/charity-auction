import Web3 from "web3";
import CharityAuctionThreshold from "./contracts/CharityAuctionThreshold.json";

const options = {
  web3: {
    block: false,
    customProvider: new Web3("ws://localhost:7545"),
  },
  contracts: [CharityAuctionThreshold],
};

export default options;
