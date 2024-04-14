var Utils = artifacts.require("./Utils");
var Greenom = artifacts.require("./Greenom");
var Item = artifacts.require("./Item");
var Market = artifacts.require("./Market");

module.exports = async function (deployer, network, accounts) {
  const owner = accounts[0];
  const totalGreenomSupply = 1000;
  const maxItemTrades = 10;
  const maxSolts = 3;
  const initialItemPrice = 1;
  const increasePercentage = 10;

  await deployer.deploy(Utils);
  await deployer.deploy(Greenom, totalGreenomSupply);
  deployer.link(Utils, Item);
  await deployer.deploy(Item, maxItemTrades, increasePercentage);
  await deployer.deploy(Market, Greenom.address, Item.address, maxSolts, initialItemPrice);

  const greenomInstance = await Greenom.deployed();
  await greenomInstance.transferOwnership(Market.address);
  const itemInstance = await Item.deployed();
  await itemInstance.transferOwnership(Market.address);

  console.log("Greenom address:", Greenom.address);
  console.log("Item address:", Item.address);
  console.log("Market address:", Market.address);
};
