const GameFarm = artifacts.require("GameFarm");

const ether = (n) => {
    return new web3.utils.BN(
        web3.utils.toWei(n.toString(), 'ether')
    );
}

module.exports = async function (deployer) {
  await deployer.deploy(GameFarm);
  
  const farm = await GameFarm.deployed();
  farm.createFarmRate(ether(0.0001), 100, 1);
  farm.createFarmRate(ether(0.001), 1000, 10);
  farm.createFarmRate(ether(0.01), 10000, 100);
  farm.createFarmRate(ether(0.1), 100000, 1000);
  farm.createFarmRate(ether(1), 1000000, 10000);
};
