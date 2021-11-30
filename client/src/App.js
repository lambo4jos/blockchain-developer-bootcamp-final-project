import React, { useState, useEffect, useRef } from "react";
import Web3 from 'web3';
import { fromWei } from 'web3-utils';
import { toWei } from 'web3-utils';
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
  const harvest = props.harv;
  const farmRates = props.farmRates;

  return (
    <div className="card text-center">
      <div className="card-header">
        Harvest {parseInt(harvest[0])+1}
      </div>
      <div className="card-body">
        <h5 className="card-title">Farm Rate {harvest[2]}</h5>
        <ul className="list-group list-group-flush">
          <li className="list-group-item">Farm Rate Payout: {farmRates[harvest[2]][3]}</li>
          <li className="list-group-item">Start Block: {harvest[3]}</li>
          <li className="list-group-item">End Block: {harvest[4]}</li>
          <li className="list-group-item">Is Claimed: {harvest[5].toString()}</li>
        </ul>
        <button className="btn btn-primary" disabled>Claim Harvest</button>
      </div>
      <div className="card-footer text-muted">
        Claim in X blocks
      </div>
    </div>
  );
}

function NavBar(props) {
  return (
    <nav className="navbar navbar-dark bg-primary">
      <span className="navbar-brand mb-0 h1">Game Farm</span>
      <span className="navbar-text">
        ETH: {props.ethBal}
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
  const rate = props.rate;
  const gameFarmContract = props.gameFarmContract;
  const account = props.account;
  const setScore = props.setScore;
  const setEthBal = props.setEthBal;
  const didCreate = props.didCreate;
  const setDidCreate = props.setDidCreate;

  const [rateId, setRateId] = useState(parseInt(rate[0]) + 1);
  const [price, setPrice] = useState(ether(rate[2]));
  const [blocks, setBlocks] = useState(rate[4]);
  const [points, setPoints] = useState(rate[3]);

  const [contBal, setContBal] = useState(100);

  // useEffect(() => {
  //   console.log("contBal useEffect");
  // }, [contBal]);

  function createHarvest() {
    let contractBalance = async () => {
      console.log("gameFarmContract Harvest: ", gameFarmContract);
      let result = await gameFarmContract.methods.getBalance().call();
      console.log("contractBalance result: ", result);
      setContBal(ether(result));
      setEthBal(ether(result));
      setScore(result);
      return contBal;
    }
    const rez = contractBalance();
    // setContBal(rez);
    console.log("contractBalance: ", contBal);

    let createUserHarvest = async () => {
      console.log("createUserHarvest rate[2}: ", rate[2]);
      console.log("createUserHarvest toWei(price): ", toWei(price));
      console.log("gameFarmContract.address createUserHarvest: ", gameFarmContract.address)
      await gameFarmContract.methods.createUserHarvest(rateId).send({from: account, value: toWei(price, 'ether')});
      // setDidCreate(result);
    }
    createUserHarvest();
  };

  return (
    <div className="card" style={{width: 18+'rem'}}>
      <h5 className="card-header">Rate {rateId}</h5>
      <ul className="list-group list-group-flush">
        <li className="list-group-item">Price in ETH: {price}</li>
        <li className="list-group-item">Blocks until Maturity: {blocks}</li>
        <li className="list-group-item">Points at Claim: {points}</li>
      </ul>
      <div className="card-body">
        <button onClick={createHarvest} className="btn btn-primary claimHarvestButton">Create Harvest</button>
        <p>{didCreate}</p>
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
  const [score, setScore] = useState(null);
  const [ethBal, setEthBal] = useState(null);
  const [didCreate, setDidCreate] = useState(null);
  const [userHarvests, setUserHarvests] = useState(null);

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
      console.log("gameFarmContract: APP useEffect", gameFarmContract.current);
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
      
      let results = await gameFarmContract.current.methods.getUserHarvests().call({from: account});
      console.log("loadBlockchainData getUserHarvests: ", results);
      setUserHarvests(results);

    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if(!account || userHarvests) return;
    getActiveAccount();
    loadBlockchainData();
    // setAccount(accounts.current[0]);
    console.log("setAccount after async", account);
  }, []);

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

  // Return and render APP
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
        <NavBar account={account} score={score} ethBal={ethBal}/>
        <h1>Available Farm Rates</h1>
        <div className="card-deck">
          {farmRates.map((rate) => (
            <FarmRate 
              key={rate[0]} 
              rate={rate} 
              gameFarmContract={gameFarmContract.current} 
              account={account} 
              setScore={setScore} 
              setEthBal={setEthBal}
              setDidCreate={setDidCreate}
              didCreate={didCreate}
            />
          ))}
        </div>

        <br />
        <h1>Currently Harvesting</h1>

        <div className="card-deck" style={{ width: "100rem" }}>
          
          {userHarvests.map((harv) => (
            <Harvest key={harv[0]} harv={harv} farmRates={farmRates} />
          ))}
          
        </div>

      </div>
    );
  }
}

export default App;
