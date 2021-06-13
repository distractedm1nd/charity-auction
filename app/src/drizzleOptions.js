import Web3 from "web3";
import ThresholdRelease from "./contracts/ThresholdRelease.json";

const options = {
  web3: {
    block: false,
  },
  contracts: [ThresholdRelease],
};

export default options;
