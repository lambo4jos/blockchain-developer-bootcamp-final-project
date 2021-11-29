GameFarm Scaffolding
1. The owner will create various farm rates that users can harvest

function createFarmRate(price, payout, blockCount) {
    // createFarmRate
}

2. Users will have to create a harvest on the contract to being playing the game

function createUserHarvest(farmRateId) {
    // createUserHarvest
}

3. Once mature, a user can complete the harvest and earn points

function claimHarvest(harvestId) {
    // claimHarvest
}

4. The contract owner is able to collect the fees earned by the contract for users playing

function withdrawal() {
    // withdrawal earned fees
}