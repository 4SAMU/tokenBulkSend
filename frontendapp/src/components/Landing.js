/** @format */

import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "../App.css";
import { ethers } from "ethers";
import { Alchemy, Network } from "alchemy-sdk";
import { myTokens } from "../utils/walletConnect";
import Navbar from "./Navbar";
import multi from "../multitrasfer.json";
import Loader from "../utils/Loader";
import { toast } from "react-toastify";

const Landing = () => {
  const [data, setData] = useState([]);
  const [dataFetched, updateDataFetched] = useState(false);
  const [tokenValue, setTokenValue] = useState();
  const [busy, setBusy] = useState(false);
  const [amount, setAmount] = useState({ amt: "" });

  const getMyToken = async () => {
    const tokens = await myTokens();
    const itemsFound = tokens.tokenBalances;

    // alchemy sdk
    const config = {
      apiKey: "8KDtf6aRQaF85wKSuyx2pspDmjwqJ646",
      network: Network.ETH_GOERLI,
      // network: Network.ETH_MAINNET,
    };
    const alchemy = new Alchemy(config);

    const items = await Promise.all(
      itemsFound.map(async (i) => {
        const metadata = await alchemy.core.getTokenMetadata(i.contractAddress);
        const price = i.tokenBalance;
        const tokenAddress = i.contractAddress;
        const tokenPrice = parseFloat(
          ethers.utils.formatUnits(price.toString(), "ether")
        ).toFixed(4);
        let item = {
          name: metadata.name,
          Symbol: metadata.symbol,
          tokenPrice,
          logo: metadata.logo,
          tokenAddress,
        };
        return item;
      })
    );
    setData(items);
    updateDataFetched(true);
  };

  window.setInterval(async function () {
    if (!dataFetched) {
      await getMyToken();
    }
  }, 60000);

  if (!dataFetched) getMyToken();
  const handleChange = (newTokenAddress) => {
    setTokenValue(newTokenAddress);
    // alert(newTokenAddress);
  };

  async function fundWallet() {
    try {
      setBusy(true);
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      let contract = new ethers.Contract(tokenValue, multi.abi, signer);

      const transaction = await contract.transfer(
        multi.address,
        ethers.utils.parseEther(amount.amt)
      );
      await transaction.wait();
      setBusy(false);
      toast.success(`You have transferred${amount.amt} to your wallet`);
      setAmount({ amt: "" });

      // const tx =
    } catch (error) {
      if (error) {
        setBusy(false);
      }
      toast.error(error.code);
    }
  }

  return (
    <div className="App_page1">
      <Navbar />
      <h3>Tokens</h3>
      <div className="container">
        {data.map((item, i) => (
          <NavLink
            key={i}
            to={`/send?token=${item.Symbol}&tokenAddress=${item.tokenAddress}&balance=${item.tokenPrice}`}
          >
            <div className="tokens">
              <img className="tokenLogo" src={item.logo} alt={""} />
              <label className="tokens_name">
                {item.name + " (" + item.Symbol + ")"}
              </label>
              <label className="tokens_price">{item.tokenPrice}</label>
            </div>
          </NavLink>
        ))}
      </div>
      <div className="howitworks">
        <h2>To add funds to your Wallet</h2>
        <div className="circle1">
          <div className="line"></div>
          <span className="circleText">select Token</span>
        </div>
        <div className="circle2">
          <div className="line1"></div>
          <span className="circleText">Enter Amount of tokens</span>
          <input
            className="inputs"
            placeholder="tokens amount"
            value={amount.amount}
            onChange={(e) => setAmount({ ...amount, amt: e.target.value })}
          ></input>
        </div>
        <div className="circle3">
          <span className="circleText">Confirm</span>
          <button className="sendBtnLandingPAge" onClick={fundWallet}>
            {busy ? <Loader /> : "confirm"}
          </button>
        </div>
        <select
          onChange={(e) => handleChange(e.target.value)}
          value={tokenValue}
        >
          <option>select tokens</option>
          <option value="0xfbC8E473eB41854DB5c760572FA89D77dD5279C2">
            Binance (BNB)
          </option>
          <option value="0xaD141A0891325412BB652428d4EBd5829287f27B">
            Tether (USDT)
          </option>
          <option value="0x6b2758d81d6155f6B76F8BD0778A01d1409dBE5E">
            Royalty (ROYT)
          </option>
        </select>
      </div>
    </div>
  );
};

export default Landing;
