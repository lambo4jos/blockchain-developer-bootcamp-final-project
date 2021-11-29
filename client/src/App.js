import React, { useState, useEffect, useRef } from "react";
import Web3 from 'web3';
import BN from 'bn.js';
import { toWei } from 'web3-utils';
import { fromWei } from 'web3-utils';
import GameFarm from "./abis/GameFarm.json";
import './App.css';

const wait = (seconds) => {
    const milliseconds = seconds * 1000;
    return new Promise(resolve => setTimeout(resolve, milliseconds));
};

const ether = (n) => {
  return fromWei(n.toString(), 'ether');
}

function Harvest(props) {
  const [rateId, setRateId] = useState(null);
  const [price, setPrice] = useState(null);
  const [blocks, setBlocks] = useState(null);
  const [points, setPoints] = useState(null);

  const { harvest } = props;

  useEffect(() => {
    setRateId(parseInt(harvest[0])+1);
  }, [harvest]);

  useEffect(() => {
    setPrice(ether(harvest[2], 'ether'));
  }, [harvest]);

  useEffect(() => {
    setBlocks(harvest[4]);
  }, [harvest]);

  useEffect(() => {
    setPoints(harvest[3]);
  }, [harvest]);

  return (
    <div className="card" style={{width: 18+'rem'}}>
      <h5 className="card-header">Rate {rateId}</h5>
      <ul className="list-group list-group-flush">
        <li className="list-group-item">Price in ETH: {price}</li>
        <li className="list-group-item">Blocks until Maturity: {blocks}</li>
        <li className="list-group-item">Points at Claim: {points}</li>
      </ul>
      <div className="card-body">
        <button className="btn btn-primary claimHarvestButton">Start Farming</button>
      </div>
    </div>
  );
}

const harvests = [
  [ 0, "0x3fc3B82Eb9a22bdaeeD9a7333308Baec32Ee96dA", 0.0001, 100, 1 ],
  [ 1, "0x3fc3B82Eb9a22bdaeeD9a7333308Baec32Ee96dA", 0.001, 1000, 10 ],
  [ 2, "0x3fc3B82Eb9a22bdaeeD9a7333308Baec32Ee96dA", 0.01, 10000, 100 ],
  [ 3, "0x3fc3B82Eb9a22bdaeeD9a7333308Baec32Ee96dA", 0.1, 100000, 1000 ],
  [ 4, "0x3fc3B82Eb9a22bdaeeD9a7333308Baec32Ee96dA", 1, 1000000, 10000 ],
]

harvests.map((harvest) => console.log(harvest));

async function getFarmRates() {
  let web3 = await new Web3(window.ethereum);
  let accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
  let networkId = await web3.eth.net.getId();
  let gameFarmAddress = await GameFarm.networks[networkId].address;
  let gameFarmContract = new web3.eth.Contract(GameFarm.abi, gameFarmAddress, {from: accounts[0]});
  let rates; 
  await gameFarmContract.methods.getFarmRates().call()
    .then(function(receipt) {
      rates = receipt;
      console.log("receipt: ", receipt);
    });
  console.log("rates: ", rates);
  console.log("typeof(rates): ", typeof(rates));
  wait(1);
  console.log("Object.entries(rates)", Object.entries(rates));
  for(const [key, value] of Object.entries(rates)) {
    console.log(`${key}: ${value}`);
  }
  const map = new Map(Object.entries(rates));
  console.log("rates as map:", map);

  console.log("rates[0]: ", rates[0]);
  console.log("rates[1]: ", rates[1]);
  console.log("rates[2]: ", rates[2]);
  console.log("rates[3]: ", rates[3]);
  console.log("rates[4]: ", rates[4]);

  console.log("rates[0][0]: ", rates[0][0]);
  console.log("rates[0][1]: ", rates[0][1]);
  console.log("rates[0][2]: ", rates[0][2]);
  console.log("rates[0][3]: ", rates[0][3]);
  console.log("rates[0][4]: ", rates[0][4]);

  return rates;
}

// const rates = getFarmRates();
// wait(1);
// console.log("rates: ", rates);
// console.log("typeof(rates): ", typeof(rates[0]));



function App() {
  const [farmRates, setFarmRates] = useState(null);
  const [account, setAccount] = useState(null);

  // const rates = getFarmRates();

  // let gameFarmJson;
  // fetch("/abis/GameFarm.json")
  //   .then(response => {
  //     return response.json();
  //   })
  //   .then(jsondata => {
  //     gameFarmJson = jsondata["abi"];
  //     console.log("gameFarmJson: ", gameFarmJson);
  //   });

  const accounts = useRef();
  // let account;
  const web3 = useRef();
  const networkId = useRef();
  const gameFarmAddress = useRef();
  const gameFarmContract = useRef();
  // let getFarmRates;
  const ratesArr = useRef();

  // async function loadBlockchainData() {
  //   try {
  //     accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
  //     // account = accounts[0];
  //     setAccount(accounts[0]);
  //     console.log("account: ", account);
  //     web3 = await new Web3(window.ethereum);
  //     networkId = await web3.eth.net.getId();
  //     console.log("networkId: ", networkId);
  //     gameFarmAddress = await GameFarm.networks[networkId].address;
  //     console.log("gameFarmAddress: ", gameFarmAddress);
  //     setAccount(web3.currentProvider.selectedAddress);
  //     console.log('web3 address: ', web3.currentProvider.selectedAddress);
  //     gameFarmContract = new web3.eth.Contract(GameFarm.abi, gameFarmAddress, {from: account});
  //     // getFarmRates = await gameFarmContract.methods.getFarmRates().call();
  //     // console.log("getFarmRates", getFarmRates);
  //     // console.log("typeof(getFarmRates)", typeof(getFarmRates[0]));
  //     // console.log("getFarmRates[0][0]: ", getFarmRates[0][0]);
  //     // console.log("getFarmRates[0][1]: ", getFarmRates[0][1]);
  //     // console.log("getFarmRates[0][2]: ", getFarmRates[0][2]);
  //     // console.log("getFarmRates[0][3]: ", getFarmRates[0][3]);
  //     // console.log("getFarmRates[0][4]: ", getFarmRates[0][4]);
  //     // console.log("getFarmRates[0][5]: ", getFarmRates[0][5]);
  //     // console.log("farmRates before set: ", farmRates);
  //     // wait(5);
  //     // setFarmRates(getFarmRates);
  //     // wait(2);
  //     // console.log("farmRates after set: ", farmRates);
  //     // return getFarmRates;
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  // async function getFarmRates() {
  //   web3 = await new Web3(window.ethereum);
  //   accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
  //   networkId = await web3.eth.net.getId();
  //   gameFarmAddress = await GameFarm.networks[networkId].address;
  //   gameFarmContract = new web3.eth.Contract(GameFarm.abi, gameFarmAddress, {from: accounts[0]});
  //   const rates = await gameFarmContract.methods.getFarmRates().call()
  //   console.log("rates: ", rates);
  //   setFarmRates(rates);
  // }

  // const accounts = window.ethereum.request({ method: 'eth_requestAccounts' });
  // const account = accounts[0];
  // console.log("account: ", account);
  // const web3 = new Web3(window.ethereum);
  // const networkId = web3.eth.net.getId();
  // console.log("networkId: ", networkId);
  // const gameFarmAddress = gameFarmJson.networks[networkId].address;
  // console.log('web3 address: ', web3.currentProvider.selectedAddress);

  useEffect(() => {
    if (farmRates) return;
    let rates = async () => {
      web3.current = await new Web3(window.ethereum);
      accounts.current = await window.ethereum.request({ method: 'eth_requestAccounts' });
      networkId.current = await web3.current.eth.net.getId();
      gameFarmAddress.current = await GameFarm.networks[networkId.current].address;
      gameFarmContract.current = new web3.current.eth.Contract(GameFarm.abi, gameFarmAddress.current, {from: accounts.current[0]});
      let results = await gameFarmContract.current.methods.getFarmRates().call();
      console.log("useEffect rates: ", results);
      return results;
    }

    rates().then((value) => {
      ratesArr.current = value;
      setFarmRates(value);
      console.log("farmRates: ", farmRates)
      console.log("value: ", value);
      console.log("ratesArr.current: ", ratesArr.current);
      // const [one, two, three, four, five] = ratesArr.current;
      // console.log("one: ", one);
      // console.log("two: ", two);
      // console.log("three: ", three);
      // console.log("four: ", four);
      // console.log("five: ", five);
    });
  }, [farmRates]);

  useEffect(() => {
    // if (account) return;
    // let acc = async () => {
    //   accounts.current = await window.ethereum.request({ method: 'eth_requestAccounts' });
    //   // account = accounts.current[0];
    //   setAccount(accounts.current[0]);
    //   console.log("account: ", account);
    //   web3.current = await new Web3(window.ethereum);
    //   networkId.current = await web3.current.eth.net.getId();
    //   console.log("networkId: ", networkId.current);
    //   gameFarmAddress.current = await GameFarm.networks[networkId.current].address;
    //   console.log("gameFarmAddress: ", gameFarmAddress.current);
    //   setAccount(web3.current.currentProvider.selectedAddress);
    //   console.log("account after set: ", account);
    //   return web3.current.currentProvider.selectedAddress;
    // }

    // acc().then((value) => {
    //   setFarmRates(value);
    //   console.log("acc().then accounts: ", account);
    // });

    async function loadBlockchainData() {
      try {
        accounts.current = await window.ethereum.request({ method: 'eth_requestAccounts' });
        // account = accounts.current[0];
        setAccount(accounts.current[0]);
        console.log("account: ", account);
        web3.current = await new Web3(window.ethereum);
        networkId.current = await web3.current.eth.net.getId();
        console.log("networkId: ", networkId.current);
        gameFarmAddress.current = await GameFarm.networks[networkId.current].address;
        console.log("gameFarmAddress: ", gameFarmAddress.current);
        setAccount(web3.current.currentProvider.selectedAddress);
        console.log("account after set: ", account);
        console.log('web3 address: ', web3.current.currentProvider.selectedAddress);
        gameFarmContract.current = new web3.current.eth.Contract(GameFarm.abi, gameFarmAddress.current, {from: accounts.current[0]});
      } catch (error) {
        console.log(error);
      }
    }
    loadBlockchainData();
    // setAccount(accounts.current[0]);
    console.log("setAccount after async", account);
  }, [account]);

  // useEffect(() => {
  //   async function getFarmRates() {
  //     web3.current = await new Web3(window.ethereum);
  //     accounts.current = await window.ethereum.request({ method: 'eth_requestAccounts' });
  //     networkId.current = await web3.current.eth.net.getId();
  //     gameFarmAddress.current = await GameFarm.networks[networkId.current].address;
  //     gameFarmContract.current = new web3.current.eth.Contract(GameFarm.abi, gameFarmAddress.current, {from: accounts.current[0]});
  //     await gameFarmContract.current.methods.getFarmRates().call()
  //       .then(function(receipt) {
  //         setFarmRates(receipt);
  //         console.log("farmRates after set: ", farmRates);
  //       });
  //     console.log("useEffect rates: ", farmRates);
  //   }
    
  //   getFarmRates();
  // }, []);

  // console.log("final rates: ", rates);

  if (!farmRates) {
    return null;
  } else {
    console.log("farmRates return: ", farmRates);
    return (
      <div className="App">
        <button className="enableMetamaskButton">Enable Metamask</button>
        <h2>Account: <span className="showAccount">{account}</span></h2>
        <button className="claimHarvestButton">Claim Harvest</button>
        <h1>Available Farm Rates</h1>
        <div className="card-deck">
          {farmRates.map((harvest) => (
            <Harvest key={harvest[0]} harvest={harvest} />
          ))}
          {/* <Harvest harvest={farmRates[0]} />
          <Harvest harvest={farmRates[1]} />
          <Harvest harvest={farmRates[2]} />
          <Harvest harvest={farmRates[3]} />
          <Harvest harvest={farmRates[4]} /> */}

          {/* {Object.entries(getFarmRates()).map((farmRate) => (
            <Harvest key={farmRate[0]} harvest={farmRate[0]} />
          ))} */}
          {/* <div className="card" style={{width: 18+'rem'}}>
            <h5 className="card-header">Rate {farmRates[0][0]+1}</h5>
            <ul className="list-group list-group-flush">
              <li className="list-group-item">Price in ETH: {farmRates[0][2]}</li>
              <li className="list-group-item">Blocks until Maturity: {farmRates[0][4]}</li>
              <li className="list-group-item">Points at Claim: {farmRates[0][3]}</li>
            </ul>
            <div className="card-body">
              <button className="btn btn-primary claimHarvestButton">Start Farming</button>
            </div>
          </div> */}
        </div>
      </div>
    );
  }
}

export default App;
