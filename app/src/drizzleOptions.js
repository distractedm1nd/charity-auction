import Web3 from "web3";
import CharityAuctionThreshold from "./contracts/CharityAuctionThreshold.json";

const options = {
  web3: {
    block: false,
  },
  contracts: [CharityAuctionThreshold],
};

export default options;
