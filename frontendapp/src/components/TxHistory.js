/** @format */

import React, { useState } from "react";
import { Sheet } from "../utils/GoogleSheet";
import Navbar from "./Navbar";

const TxHistory = () => {
  const [data, setData] = useState([]);
  const [dataFetched, updateDataFetched] = useState(false);

  async function getData() {
    const readSheet = await Sheet();
    setData(readSheet.rowSheet2);
    updateDataFetched(true);
  }
  if (!dataFetched) getData();

  return (
    <div className="App_page1">
      <Navbar />
      <div>
        <span className="tokenSendData">Token Send</span>
        <span className="date">Date</span>
      </div>
      <div className="txhistoryTable">
        {data.map((googleSheetData, i) => (
          <div key={i} className="employees">
            <a key={i} href={googleSheetData._rawData[0]}>
              <div className="txhistoryData">
                <span className="tokenSend">
                  {googleSheetData._rawData[2] +
                    "  " +
                    googleSheetData._rawData[3]}
                </span>

                <span className="googleSheetAmount">
                  {googleSheetData._rawData[1]}
                </span>
              </div>
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TxHistory;
