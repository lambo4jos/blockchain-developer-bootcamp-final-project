const { assert } = require('chai');
const GameFarm = artifacts.require("GameFarm");

const timeTravel = require("./testHelpers");

require('chai')
    .use(require('chai-as-promised'))
    .should();

// Utils
const ETHER_ADDRESS = '0x0000000000000000000000000000000000000000';
const ether = (n) => {
    return new web3.utils.BN(
        web3.utils.toWei(n.toString(), 'ether')
    );
}

const increaseTime = function(duration) {
  const id = Date.now()

  return new Promise((resolve, reject) => {
    web3.currentProvider.send({
      jsonrpc: '2.0',
      method: 'evm_increaseTime',
      params: [duration],
      id: id,
    }, err1 => {
      if (err1) return reject(err1)

      web3.currentProvider.send({
        jsonrpc: '2.0',
        method: 'evm_mine',
        id: id+1,
      }, (err2, res) => {
        return err2 ? reject(err2) : resolve(res)
      })
    })
  })
}

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
contract("GameFarm", function ([owner, farmer]) {
  let gameFarm;
  openingTime = Math.floor(new Date().getTime() / 1000);
  closingTime = openingTime + 10000;

  beforeEach(async () => {
    // gameFarm = await GameFarm.new({from: owner});
    gameFarm = await GameFarm.new();
  });
  
  it("should have an owner", async () => {
    assert.equal(typeof gameFarm.owner, "function", "the contract has no owner");
  });

  it("Test createFarmRate() then getFarmRate() and verify it's values", async () => {
    await gameFarm.createFarmRate(ether(0.0001), 100, 1, {from: owner});    
    let result = await gameFarm.getFarmRate(0);

    assert.equal(result.id, 0);
    assert.equal(result.owner, owner);
    assert.equal(result.price, ether(0.0001));
    assert.equal(result.payout, 100);
    assert.equal(result.blockCount, 1);
  });

  it("Test getAllFarmRates()", async () => {
    await gameFarm.createFarmRate(ether(0.0001), 100, 1, {from: owner});    
    await gameFarm.createFarmRate(ether(0.001), 1000, 10, {from: owner});    
    await gameFarm.createFarmRate(ether(0.01), 10000, 100, {from: owner});    
    await gameFarm.createFarmRate(ether(0.1), 100000, 1000, {from: owner});    
    await gameFarm.createFarmRate(ether(1), 1000000, 10000, {from: owner});    

    let result = await gameFarm.getAllFarmRates();

    // check rate1
    assert.equal(result[0].id, 0);
    assert.equal(result[0].owner, owner);
    assert.equal(result[0].price, ether(0.0001));
    assert.equal(result[0].payout, 100);
    assert.equal(result[0].blockCount, 1);

    // check rate2
    assert.equal(result[1].id, 1);
    assert.equal(result[1].owner, owner);
    assert.equal(result[1].price, ether(0.001));
    assert.equal(result[1].payout, 1000);
    assert.equal(result[1].blockCount, 10);

    // check rate3
    assert.equal(result[2].id, 2);
    assert.equal(result[2].owner, owner);
    assert.equal(result[2].price, ether(0.01));
    assert.equal(result[2].payout, 10000);
    assert.equal(result[2].blockCount, 100);

    // check rate4
    assert.equal(result[3].id, 3);
    assert.equal(result[3].owner, owner);
    assert.equal(result[3].price, ether(0.1));
    assert.equal(result[3].payout, 100000);
    assert.equal(result[3].blockCount, 1000);

    // check rate5
    assert.equal(result[4].id, 4);
    assert.equal(result[4].owner, owner);
    assert.equal(result[4].price, ether(1));
    assert.equal(result[4].payout, 1000000);
    assert.equal(result[4].blockCount, 10000);
  });

  it("Test createUserHarvest and then getUserHarvests to check creation", async () => {
    await gameFarm.createFarmRate(ether(0.0001), 100, 1, {from: owner});    
    let farmRate = await gameFarm.getFarmRate(0);

    await gameFarm.createUserHarvest(0, {from: farmer, value: ether(0.0001)});
    let userHarvests = await gameFarm.getUserHarvests({from: farmer});

    // check userHarvests values are correct
    assert.equal(userHarvests[0].id, 0);
    assert.equal(userHarvests[0].owner, farmer);
    assert.equal(userHarvests[0].farmRateId, 0);
    let blockCount = userHarvests[0].endBlock - userHarvests[0].startBlock;
    assert.equal(blockCount, 1);
    assert.equal(userHarvests[0].isClaimed, false);
  });

  it("Test claimHarvest() for a harvestId and that it's claimed state changed to true", async () => {
    await gameFarm.createFarmRate(ether(0.0001), 100, 1, {from: owner});    
    let farmRate = await gameFarm.getFarmRate(0);

    await gameFarm.createUserHarvest(0, {from: farmer, value: ether(0.0001)});
    
    await increaseTime(5000);

    let response = await gameFarm.claimHarvest(0, {from: farmer});
    
    let userHarvests = await gameFarm.getUserHarvests({from: farmer});
    assert.equal(userHarvests[0].isClaimed, true);
  });

  it("Test getScore() before points and after points earned", async () => {
    let result = await gameFarm.getScore({from: farmer});

    assert.equal(result, 0);

    await gameFarm.createFarmRate(ether(0.0001), 100, 1, {from: owner});    
    let farmRate = await gameFarm.getFarmRate(0);

    await gameFarm.createUserHarvest(0, {from: farmer, value: ether(0.0001)});
    
    await increaseTime(5000);

    let response = await gameFarm.claimHarvest(0, {from: farmer});
    
    let userHarvests = await gameFarm.getUserHarvests({from: farmer});
    assert.equal(userHarvests[0].isClaimed, true);

    result = await gameFarm.getScore({from: farmer});

    assert.equal(result, 100);
  });

  it("Test smart contract getBalance() before eth deposit, then after eth deposit", async () => {
    let result = await gameFarm.getBalance();

    assert.equal(result, 0);

    await gameFarm.sendTransaction({from: owner, value: ether(0.001)});

    result = await gameFarm.getBalance();
    assert.equal(result.toString(), ether(0.001));

    let balance = await web3.eth.getBalance(gameFarm.address);
    assert.equal(balance.toString(), ether(0.001));
  });

  it("Test withDrawal() by owner", async () => {
    await gameFarm.sendTransaction({from: owner, value: ether(0.001)});

    let result = await gameFarm.getBalance();
    assert.equal(result.toString(), ether(0.001));

    let balance = await web3.eth.getBalance(gameFarm.address);
    assert.equal(balance.toString(), ether(0.001));

    await gameFarm.withdrawal({from: owner});

    balance = await web3.eth.getBalance(gameFarm.address);
    assert.equal(balance.toString(), ether(0));
  });

  it("Test withDrawal() by not the owner", async () => {
    await gameFarm.sendTransaction({from: owner, value: ether(0.001)});

    let result = await gameFarm.getBalance();
    assert.equal(result.toString(), ether(0.001));

    let balance = await web3.eth.getBalance(gameFarm.address);
    assert.equal(balance.toString(), ether(0.001));

    await gameFarm.withdrawal({from: farmer}).should.be.rejectedWith('VM Exception while processing transaction: revert');

    balance = await web3.eth.getBalance(gameFarm.address);
    assert.equal(balance.toString(), ether(0.001));
  });

});

