/** @format */

import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import "../App.css";
import { ethers } from "ethers";
import { Alchemy, Network } from "alchemy-sdk";
import { connectWallet, myTokens } from "../utils/walletConnect";

const Landing = () => {
  const [acc, setAddress] = useState();
  const [data, setData] = useState([]);

  const [dataFetched, updateDataFetched] = useState(false);

  const walletConnect = async () => {
    const address = await connectWallet();
    setAddress(
      String(address).substring(0, 5) + "..." + String(address).substring(38)
    );
  };

  const getMyToken = async () => {
    const tokens =await myTokens();
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

  useEffect(() => {
    walletConnect();
  }, []);
  window.setInterval(async function () {
    walletConnect();

    if (!dataFetched) {
      await getMyToken();
    }
  }, 60000);

  if (!dataFetched) getMyToken();
  return (
    <div className="App_page1">
      <nav className="navbar">
        <label className="appname">Tokens Bulksender</label>
        {!acc ? (
          <button className="connectWallet" onClick={walletConnect}>
            connect Wallet
          </button>
        ) : (
          <button className="connectWallet" onClick={null}>
            {acc}
          </button>
        )}
      </nav>
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
    </div>
  );
};

export default Landing;
