/** @format */

import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "../App.css";
import { ethers } from "ethers";
// import ContractAbi from "../abi.json";
import multi from "../multitrasfer.json";
import { Sheet } from "../utils/GoogleSheet";
import Navbar from "./Navbar";
import { toast } from "react-toastify";

const Send = () => {
  const search = useLocation().search;
  const token = new URLSearchParams(search).get("token");
  const tokenAddress = new URLSearchParams(search).get("tokenAddress");
  const balance = new URLSearchParams(search).get("balance");

  const [data, setData] = useState([]);
  const [addreses, setAddresses] = useState({});
  const [amounts, setAmounts] = useState([]);
  const [totalAmounts, setTotalAmounts] = useState([]);
  const [dataFetched, updateDataFetched] = useState(false);

  async function addressesArray() {
    const readSheet = await Sheet();
    const dataItems = readSheet.rows;
    const items = await Promise.all(
      dataItems.map((index) => {
        const addresss = index._rawData[1];
        return addresss;
      })
    );
    setAddresses(items);
    updateDataFetched(true);
  }
  if (!dataFetched) addressesArray();

  async function amountsArray() {
    const readSheet = await Sheet();
    const dataItems = readSheet.rows;
    const items = await Promise.all(
      dataItems.map((index) => {
        const amount = ethers.utils.parseEther(index._rawData[2]);
        return amount;
      })
    );
    setAmounts(items);
    updateDataFetched(true);
  }
  if (!dataFetched) amountsArray();

  async function totalAmountArray() {
    const readSheet = await Sheet();
    const dataItems = readSheet.rows;
    const items = await Promise.all(
      dataItems.map((index) => {
        const totalAmount = Number(index._rawData[2]);
        return totalAmount;
      })
    );
    setTotalAmounts(items);
    updateDataFetched(true);
  }
  if (!dataFetched) totalAmountArray();

  const multiSend = async () => {
    // e.currentTarget.disabled = true;
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      let contract = new ethers.Contract(multi.address, multi.abi, signer);

      const transaction = await contract.multiTransfer(
        tokenAddress,
        addreses,
        amounts
      );
      const tx = await transaction.wait();
      // const result = await tx.json();
      const hash = `https://goerli.etherscan.io/tx/${tx.transactionHash}`;

      toast.success("successfully finished all tx");

      // saving txHistory to sheet after 10 seconds
      setTimeout(async function () {
        const readSheet = await Sheet();
        const sheet = readSheet.sheet2;
        await sheet.addRow({
          Transactions: hash,
          Date: new Date().toString(),
          AmountSent: totalAmounts.reduce((a, b) => a + b),
          TokenSend: token,
        });
      }, 10000);
    } catch (error) {
      console.log(error);
      toast.error(error);
      // if (error.code === "execution reverted: ERR 1") {
      //   alert("Token balance less than the estimated amount to send");
      // }
    }
  };

  async function getData() {
    const readSheet = await Sheet();
    setData(readSheet.rows);
    updateDataFetched(true);
  }

  useEffect(() => {
    if (!dataFetched) getData();
  }, []);

  // window.setInterval(function () {
  //   walletConnect();
  // }, 5000);

  return (
    <div className="App_page1">
      <Navbar />
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
