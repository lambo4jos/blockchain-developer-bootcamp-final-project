const GameFarm = artifacts.require("GameFarm");

// Utils
const ETHER_ADDRESS = '0x0000000000000000000000000000000000000000';
const ether = (n) => {
    return new web3.utils.BN(
        web3.utils.toWei(n.toString(), 'ether')
    );
}
// Same as ether
const tokens = (n) => ether(n);

const wait = (seconds) => {
    const milliseconds = seconds * 1000;
    return new Promise(resolve => setTimeout(resolve, milliseconds));
};

module.exports = async function(callback) {
    try {
        // fetch accounts from wallet - these are unlocked
        const accounts = await web3.eth.getAccounts();
        console.log('accounts fetched', accounts);

        // fetch the deployed Game token
        const gameFarm = await GameFarm.deployed();
        console.log('GameFarm fetched', gameFarm.address);

        // get users
        const creator = accounts[0];
        console.log('accounts[0]: ', accounts[0]);
        const farmer1 = accounts[1];
        console.log('accounts[1]: ', accounts[1]);
        const farmer2 = accounts[2];
        console.log('accounts[2]: ', accounts[2]);

        // // fetch the deployed Game token
        // const gameToken = GameToken.new({from: farmer1});
        // console.log('GameToken fetched', gameToken.address);

        // // configure Game contract for farmer1        
        // const game = await Game.new({from: farmer1});
        // console.log('GameNew fetched', game.address);

        // // create farm rates
        // let rate1 = await gameToken.createFarmRate(ether(0.0001), tokens(100), 1);
        // let rate2 = await gameToken.createFarmRate(ether(0.001), tokens(1000), 10);
        // let rate3 = await gameToken.createFarmRate(ether(0.01), tokens(10000), 100);
        // let rate4 = await gameToken.createFarmRate(ether(0.1), tokens(100000), 1000);
        // let rate5 = await gameToken.createFarmRate(ether(1), tokens(1000000), 10000);

        // let rate1 = await gameFarm.getFarmRate(0);
        // let rate2 = await gameFarm.getFarmRate(1);
        // let rate3 = await gameFarm.getFarmRate(2);
        // let rate4 = await gameFarm.getFarmRate(3);
        // let rate5 = await gameFarm.getFarmRate(4);

        // console.log('Rate 1', rate1);
        // console.log('Rate 2', rate2);
        // console.log('Rate 3', rate3);
        // console.log('Rate 4', rate4);
        // console.log('Rate 5', rate5);

        // const gotRate1 = await gameFarm.getFarmRate(0);
        // const gotRate2 = await gameFarm.getFarmRate(1);
        // const gotRate3 = await gameFarm.getFarmRate(2);
        // const gotRate4 = await gameFarm.getFarmRate(3);
        // const gotRate5 = await gameFarm.getFarmRate(4);

        const rates = await gameFarm.getAllFarmRates();
        let harvest;
        for (let i = 0; i < 5; i++) {
            console.log(`Rate ${i} id: `, rates[i].id);
            console.log(`Rate ${i} creator: `, rates[i].owner);
            console.log(`Rate ${i} price: `, web3.utils.fromWei(rates[i].price, "ether") + " ETH");
            console.log(`Rate ${i} payout: `, rates[i].payout);
            console.log(`Rate ${i} blockCount: `, rates[i].blockCount);
            // wait 1 second
            await wait(1);
            harvest = await gameFarm.createUserHarvest(rates[i].id, {from: farmer1, value: rates[i].price});
            console.log(`Harvest ${i} ${harvest}`);
        }

        // const harvest1 = await gameFarm.createUserHarvest(gotRate1.id, {from: farmer1, value: gotRate1.price});
        // console.log(`Harvest 1 ${harvest1}`);
        // const harvest2 = await gameFarm.createUserHarvest(gotRate2.id, {from: farmer1, value: gotRate2.price});
        // console.log(`Harvest 2 ${harvest2}`);
        // const harvest3 = await gameFarm.createUserHarvest(gotRate3.id, {from: farmer1, value: gotRate3.price});
        // console.log(`Harvest 3 ${harvest3}`);
        // const harvest4 = await gameFarm.createUserHarvest(gotRate4.id, {from: farmer1, value: gotRate4.price});
        // console.log(`Harvest 4 ${harvest4}`);
        // const harvest5 = await gameFarm.createUserHarvest(gotRate5.id, {from: farmer1, value: gotRate5.price});
        // console.log(`Harvest 5 ${harvest5}`);

        const farmer1harvests = await gameFarm.getUserHarvests({from: farmer1});
        for (let i = 0; i < farmer1harvests.length; i++) {
            console.log(`farmer1harvests ${farmer1harvests[i].id} ${farmer1harvests[i].owner} ${farmer1harvests[i].farmRateId} ${farmer1harvests[i].startBlock} ${farmer1harvests[i].endBlock} ${farmer1harvests[i].isClaimed}`);
            // wait 1 second
            await wait(1);
        }

        // const gameToken = await GameToken.new({from: creator});
        // const harvestFarmRateId = farmer1harvests[0].farmRateId;
        // console.log(`harvestFarmRateId: ${harvestFarmRateId}`)
        // const farmer1farmRate = await gameFarm.getFarmRate(harvestFarmRateId);
        // console.log(`farmer1farmRate: ${farmer1farmRate}`);
        // const payout = farmer1farmRate.payout;
        // console.log(`payout: ${payout}`);
        // const result = await gameToken.transfer(farmer1, 475);
        // console.log(result);

        // const balance = await gameFarm.balanceOf(farmer1);
        // console.log(`farmer1 balance: ${balance}`);

        // const contractBalance = await gameFarm.balanceOf(creator);
        // console.log(`contract balance: ${contractBalance}`)

        // await gameToken.approve(farmer1, 156);
        // await gameToken.transfer(farmer1, 156);
        // await gameToken.transferFrom("0x3fc3B82Eb9a22bdaeeD9a7333308Baec32Ee96dA", "0xD2d5082d20220E04848E2A7ab96fcE23Af4922fd", 1);

        // await game.claimHarvest(harvestFarmRateId);

        // await gameToken.transfer(farmer1, 153, {from: farmer1});
        
        // let totalSupply = await gameFarm.totalSupply();
        // console.log('totalSupply: ', web3.utils.BN(totalSupply).toString());

        // const tfgresult = await gameToken.transferFromGame(300);
        // console.log('tfgresult: ', tfgresult);

        let getScore = await gameFarm.getScore({from: farmer1});
        console.log("getScore before: ", web3.utils.BN(getScore).toString());

        // await gameToken.updateScore(farmer1harvests[0].id, {from: farmer1});
        // getScore = await gameToken.getScore({from: farmer1});
        // console.log("getScore: ", web3.utils.BN(getScore).toString());

        // await gameToken.updateScore(farmer1harvests[1].id, {from: farmer1});
        // getScore = await gameToken.getScore({from: farmer1});
        // console.log("getScore: ", web3.utils.BN(getScore).toString());

        // await gameToken.updateScore(farmer1harvests[2].id, {from: farmer1});
        // getScore = await gameToken.getScore({from: farmer1});
        // console.log("getScore: ", web3.utils.BN(getScore).toString());

        let guharvests = await gameFarm.getUserHarvests({from: farmer1});
        console.log("guharvests count: ", guharvests.length);

        for (let i = 0; i < guharvests.length; i++) {
            await gameFarm.claimHarvest(farmer1harvests[i].id, {from: farmer1});
            getScore = await gameFarm.getScore({from: farmer1});
            console.log("getScore after: ", web3.utils.BN(getScore).toString());
        }

        const balBefore = await gameFarm.getBalance();
        console.log("get balance gameFarm.address before: ", web3.utils.BN(balBefore).toString());
        web3.eth.getBalance(gameFarm.address, function(err, result) {
            if (err) {
                console.log(err);
            } else {
                console.log("web3 gameFarm.address before: " + web3.utils.fromWei(result, "ether") + " ETH");
            }
        });
        await wait(1);

        web3.eth.getBalance(creator, function(err, result) {
            if (err) {
                console.log(err)
            } else {
                console.log("web3 creator before: " + web3.utils.fromWei(result, "ether") + " ETH")
            }
        });
        await wait(1);

        const balAfter = await gameFarm.getBalance();
        console.log("get balance gameFarm.address after: ", web3.utils.BN(balAfter).toString());
        // await gameFarm.withdrawal({from: creator});
        // web3.eth.getBalance(gameFarm.address, function(err, result) {
        //     if (err) {
        //         console.log(err);
        //     } else {
        //         console.log("web3 gameFarm.address after: " + web3.utils.fromWei(result, "ether") + " ETH");
        //     }
        // });
        // await wait(1);

        web3.eth.getBalance(creator, function(err, result) {
            if (err) {
                console.log(err)
            } else {
                console.log("web3 creator after: " + web3.utils.fromWei(result, "ether") + " ETH")
            }
        });
        await wait(1);

        // await gameToken.updateScore(harvestFarmRateId, {from: farmer1});
        // await gameToken.updateScore(harvestFarmRateId, {from: farmer1});

/*         const gtbresult = await gameToken.balanceOf(farmer1);
        console.log('gtbresult: ', web3.utils.BN(gtbresult).toString());

        totalSupply = await gameToken.totalSupply();
        console.log('totalSupply: ', web3.utils.BN(totalSupply).toString()); */

/*         tk = await GameToken.deployed();
        gm = await Game.deployed();

        tk.increaseAllowance(gm.address, tokens(1000));
        gm.transferFromGame(tokens(1000), gm.address, {from: gm.address});
        (await tk.balanceOf(gm.address)).toString(); */

    } catch(error) {
        console.log(error);
    }

    callback();
}

/* const ether = (n) => { return new web3.utils.BN(web3.utils.toWei(n.toString(), 'ether'));}
const tokens = (n) => ether(n);
tk.increaseAllowance(gm.address, tokens(657981246));
gm.transferFromGame(tokens(1000));
(await tk.balanceOf(gm.address)).toString() */