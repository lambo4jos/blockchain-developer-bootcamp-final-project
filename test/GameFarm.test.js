const GameFarm = artifacts.require("GameFarm");


// Utils
const ETHER_ADDRESS = '0x0000000000000000000000000000000000000000';
const ether = (n) => {
    return new web3.utils.BN(
        web3.utils.toWei(n.toString(), 'ether')
    );
}

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
contract("GameFarm", function ([owner, farmer]) {
  let gameFarm;

  beforeEach(async () => {
    // gameFarm = await GameFarm.new({from: owner});
    gameFarm = await GameFarm.new();
  });
  
  it("should have an owner", async () => {
    assert.equal(typeof gameFarm.owner, "function", "the contract has no owner");
  });

  it("should assert true", async () => {
    // console.log(gameFarm._owner);
    // console.log(owner.address);
    // assert.equal(gameFarm._owner, owner);
  });

  it("Should create a farm rate, get it, and verify it's values", async () => {
    let result = await gameFarm.createFarmRate(ether(0.0001), 100, 1, {from: owner});    
    result = await gameFarm.getFarmRate(0);

    assert.equal(result.id, 0);
    assert.equal(result.owner, owner);
    assert.equal(result.price, ether(0.0001));
    assert.equal(result.payout, 100);
    assert.equal(result.blockCount, 1);
  });

  it("Should createUserHarvest and check for return true", async () => {
    // console.log(gameFarm);
    // gameFarm = await GameFarm.new({from: farmer});
    let result = await gameFarm.createUserHarvest(0, {from: farmer, value: ether(0.0001)}).send();
    
  });

  it("should get the ETH balance of the contract", async () => {
    // let result = await gameFarm.getBalance();

    console.log(gameFarm);
    assert.equal(typeof gameFarm.farmRates, "FarmRate[]", "the contract has no owner");
  });

  it("should do even more", async () => {


  });
});

