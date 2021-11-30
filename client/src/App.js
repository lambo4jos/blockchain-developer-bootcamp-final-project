import React, { useState, useEffect, useRef } from "react";
import Web3 from 'web3';
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

function NavBar(props) {
  return (
    <nav className="navbar navbar-dark bg-primary">
      <span className="navbar-brand mb-0 h1">Game Farm</span>
      <span className="navbar-text">
        ETH: {props.ethbal}
      </span>
      <span className="navbar-text">
        Score: {props.score}
      </span>
      <span className="navbar-text">
        Account: {props.account}
      </span>
    </nav>
  );
}

function FarmRate(props) {
  const { rate } = props;

  const [rateId, setRateId] = useState(parseInt(rate[0]) + 1);
  const [price, setPrice] = useState(ether(rate[2], 'ether'));
  const [blocks, setBlocks] = useState(rate[4]);
  const [points, setPoints] = useState(rate[3]);

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

// const harvests = [
//   [ 0, "0x3fc3B82Eb9a22bdaeeD9a7333308Baec32Ee96dA", 0.0001, 100, 1 ],
//   [ 1, "0x3fc3B82Eb9a22bdaeeD9a7333308Baec32Ee96dA", 0.001, 1000, 10 ],
//   [ 2, "0x3fc3B82Eb9a22bdaeeD9a7333308Baec32Ee96dA", 0.01, 10000, 100 ],
//   [ 3, "0x3fc3B82Eb9a22bdaeeD9a7333308Baec32Ee96dA", 0.1, 100000, 1000 ],
//   [ 4, "0x3fc3B82Eb9a22bdaeeD9a7333308Baec32Ee96dA", 1, 1000000, 10000 ],
// ]

// harvests.map((harvest) => console.log(harvest));

function App() {
  const [farmRates, setFarmRates] = useState(null);
  const [account, setAccount] = useState(null);

  const accounts = useRef();
  // let account;
  const web3 = useRef();
  const networkId = useRef();
  const gameFarmAddress = useRef();
  const gameFarmContract = useRef();
  // let getFarmRates;
  const ratesArr = useRef();

  // let userGalleonBalance = await 
  // galleonsContract.methods.balanceOf(currentAccount).call()
  //   .then(function (bal){
  //         return bal
  //   });

  useEffect(() => {
    if (!account || farmRates) return;
    let rates = async () => {
      web3.current = await new Web3(window.ethereum);
      // accounts.current = await window.ethereum.request({ method: 'eth_requestAccounts' });
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
    });
  }, [account, farmRates]);

  async function loadBlockchainData() {
    try {
      // accounts.current = await window.ethereum.request({ method: 'eth_requestAccounts' });
      // account = accounts.current[0];
      // setAccount(accounts.current[0]);
      // console.log("account: ", account);
      web3.current = await new Web3(window.ethereum);
      networkId.current = await web3.current.eth.net.getId();
      console.log("networkId: ", networkId.current);
      gameFarmAddress.current = await GameFarm.networks[networkId.current].address;
      console.log("gameFarmAddress: ", gameFarmAddress.current);
      // setAccount(web3.current.currentProvider.selectedAddress);
      console.log("account after set: ", account);
      console.log('web3 address: ', web3.current.currentProvider.selectedAddress);
      gameFarmContract.current = new web3.current.eth.Contract(GameFarm.abi, gameFarmAddress.current, {from: accounts.current[0]});
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if(!account) return;
    getActiveAccount();
    loadBlockchainData();
    // setAccount(accounts.current[0]);
    console.log("setAccount after async", account);
  });

  // async function loadConnectMetamask() {
  //   if(account) return;

  //   accounts.current = await window.ethereum.request({ method: 'eth_requestAccounts' });
  //   setAccount(accounts.current[0]);
  //   console.log("account loadConnectMetamask: ", account);
  //   web3.current = await new Web3(window.ethereum);
  //   setAccount(web3.current.currentProvider.selectedAddress);
  //   console.log("account after loadConnectMetamask set: ", account);
  // }

  async function getActiveAccount() {
    if(account) return;
    accounts.current = await window.ethereum.request({ method: 'eth_requestAccounts' });
    setAccount(accounts.current[0]);
    return account;
  }

  function connectMetamask() {
    getActiveAccount();
    loadBlockchainData();
  }

  // Return rand render APP
  if (!farmRates) {
    return (
      <div className="App">
        <NavBar connect={connectMetamask}/>
        <button onClick={connectMetamask} className="btn btn-outline-success my-2 my-sm-0">Connect Metamask</button>
      </div>
    );
  } else {
    console.log("farmRates return: ", farmRates);
    return (
      <div className="App">
        <NavBar account={account}/>
        <h1>Available Farm Rates</h1>
        <div className="card-deck">
          {farmRates.map((rate) => (
            <FarmRate key={rate[0]} rate={rate} />
          ))}
        </div>
      </div>
    );
  }
}

export default App;
