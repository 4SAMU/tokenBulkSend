/** @format */

import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "../App.css";
import { connectWallet } from "../utils/walletConnect";
import { ethers } from "ethers";
// import ContractAbi from "../abi.json";
import multi from "../multitrasfer.json";
import { Sheet } from "../utils/GoogleSheet";

const Send = () => {
  const search = useLocation().search;
  const token = new URLSearchParams(search).get("token");
  const tokenAddress = new URLSearchParams(search).get("tokenAddress");
  const balance = new URLSearchParams(search).get("balance");

  const [acc, setAddress] = useState();
  const [data, setData] = useState([]);

  const [addreses, setAddresses] = useState({});
  const [amounts, setAmounts] = useState([]);

  const [dataFetched, updateDataFetched] = useState(false);

  const walletConnect = async () => {
    const address = await connectWallet();
    setAddress(
      String(address).substring(0, 5) + "..." + String(address).substring(38)
    );
  };

  async function addressesArray() {
    const readSheet = await Sheet();
    const dataItems = readSheet.rows;
    const items = await Promise.all(
      dataItems.map((index) => {
        const addresss = index._rawData[1];
        // const amount = index._rawData[2];

        // let array = [addresss];
        // const addressesArray = [];
        // addressesArray.push()

        return addresss;
      })
    );
    setAddresses(items);
  }
  if (!dataFetched) addressesArray();

  async function amountsArray() {
    const readSheet = await Sheet();
    const dataItems = readSheet.rows;
    const items = await Promise.all(
      dataItems.map((index) => {
        // const addresss = index._rawData[1];
        const amount = ethers.utils.parseEther(index._rawData[2]);
        // const priceFormatted = ethers.utils.parseEther(x.toString());

        // let array = [addresss];
        // const addressesArray = [];
        // addressesArray.push()

        return amount;
      })
    );
    setAmounts(items);
  }
  if (!dataFetched) amountsArray();

  const multiSend = async () => {
    // const { toAddress, amount } = formData;
    // event.currentTarget.disabled = true;
    try {
      // const readSheet = await Sheet();
      // await readSheet.sheet.loadCells(`A1:Z${readSheet.rows.length + 1}`);
      //=====================================

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      let contract = new ethers.Contract(multi.address, multi.abi, signer);

      // const dataItems = readSheet.rows;

      // dataItems.map((index) => {
      //   const addresss = index._rawData[1];
      //   const amount = index._rawData[2];
      //   // const addressesArray = [];
      //   // const amountArray = [];

      //   // addressesArray.push(addresss);
      //   // amountArray.push(amount);

      //   let addressesArray = [addresss];
      //   let amountArray = {
      //     amount,
      //   };
      //   console.log(addressesArray);
      // });

      // let i;
      // for (i = 0; i <= dataItems.length + 1; i++) {
      //   addressesArray.push(addresss);
      //   amountArray.push(amount);

      //   console.log("here", addressesArray, amountArray);
      // }

      // let x = 0.01;
      const transaction = await contract.multiTransfer(
        tokenAddress,
        addreses,
        amounts
      );
      await transaction.wait();

      alert("successfully finished all tx");
      console.log(addreses);
    } catch (error) {
      console.log(error);
    }
  };

  async function getData() {
    const readSheet = await Sheet();
    setData(readSheet.rows);
    updateDataFetched(true);
  }

  useEffect(() => {
    walletConnect();
    if (!dataFetched) getData();
  }, []);

  window.setInterval(function () {
    walletConnect();
  }, 5000);

  return (
    <div className="App_page1">
      <nav className="navbar">
        <label className="appname">Tokens Bulksender</label>
        {!acc ? (
          <button className="connectWallet" onClick={walletConnect}>
            connect Wallet
          </button>
        ) : (
          <button className="connectWallet">{acc}</button>
        )}
      </nav>
      <h3>
        Sending [{token}] Current Balance is [{balance}]
      </h3>
      <div>
        <span className="empName">Name</span>
        <span className="empAddress">Address</span>
        <span className="empAmount">Amount</span>
        <a href="https://docs.google.com/spreadsheets/d/1I0OHpROXHSvszuM-c2u11lKAQMYHw95u5SoIde0aLfE/edit#gid=0">
          <button className="addBtn">Edit details</button>
        </a>
      </div>
      <div className="myTable">
        {data.map((googleSheetData, i) => (
          <div key={i} className="employees">
            <span className="Number">{i + 1 + "."}</span>
            <span className="googleSheetName">
              {googleSheetData._rawData[0]}
            </span>
            <span className="googleSheetAddress">
              {googleSheetData._rawData[1]}
            </span>
            <span className="googleSheetAmount">
              {googleSheetData._rawData[2]}
            </span>
          </div>
        ))}
      </div>
      <button className="sendBtn" onClick={multiSend}>
        Send
      </button>
    </div>
  );
};

export default Send;
