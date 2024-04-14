var Item = artifacts.require("./Item");

contract("Item", (accounts) => {
  it("should be named Item", async () => {
    const item = await Item.deployed();
    // const item = new Item(1);
    const name = await item.name.call();
    console.log("Name:", name);
    assert.equal(name, "Item", "name is not Item");
  });
});
