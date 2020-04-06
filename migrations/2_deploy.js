const Auction = artifacts.require("Auction");

const biddingTime = 1
const owner = "0xDF6E105b95A6Ea73B9c06733F445D543a1F6c5dc"
const brand = "Tesla"
const number = "???"

module.exports = function(deployer) {
  deployer.deploy(Auction, biddingTime, owner, brand, number);
};

