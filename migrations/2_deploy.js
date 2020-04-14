const Auction = artifacts.require("Auction");

const biddingTime = 1
const owner = "0xA73faA7C1C083e682AfdD3F4D3A70635543b6a0D"
const brand = "Tesla"
const number = "???"

module.exports = function(deployer) {
  deployer.deploy(Auction, biddingTime, owner, brand, number);
};

