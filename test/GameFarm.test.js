const GameFarm = artifacts.require("GameFarm");

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
contract("GameFarm", function (accounts) {
  it("should assert true", async function () {
    const gameFarm = await GameFarm.deployed();
    return assert.isTrue(true);
  });

  it("Should have 'name' and 'symbol' specified at the constructor and always have '18' for the decimals.", async() => {
    const owner = accounts[0];
    const gameFarm = await GameFarm.new({from: owner});
  });
});
