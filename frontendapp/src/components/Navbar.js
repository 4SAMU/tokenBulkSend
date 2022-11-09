/** @format */

import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { connectWallet } from "../utils/walletConnect";

const Navbar = () => {
  const [acc, setAddress] = useState();

  const walletConnect = async () => {
    const address = await connectWallet();
    setAddress(
      String(address).substring(0, 5) + "..." + String(address).substring(38)
    );
  };
  useEffect(() => {
    walletConnect();
  }, []);
  return (
    <nav className="navbar">
      <label className="appname">Tokens Bulksender</label>
      {!acc ? (
        <button className="connectWallet" onClick={walletConnect}>
          connect Wallet
        </button>
      ) : (
        <button className="connectWallet">{acc}</button>
      )}

      <button className="txhistory">
        <NavLink activeclassname="active" to={"/txhistory"}>
          Transaction history
        </NavLink>
      </button>
      <button className="selectTokens">
        <NavLink activeclassname="active" to={"/"}>
          My Tokens
        </NavLink>
      </button>
    </nav>
  );
};

export default Navbar;
