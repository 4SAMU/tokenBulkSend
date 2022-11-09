/** @format */
// import { ethers } from "ethers";
import { Alchemy, Network } from "alchemy-sdk";
import multi from "../multitrasfer.json";

export const connectWallet = async () => {
  try {
    // const provider = await detectEthereumProvider();
    // const provider = new ethers.providers.Web3Provider(window.ethereum);
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    const address = accounts[0];
    return address;
  } catch (error) {
    console.log(error);
  }
};

const config = {
  apiKey: "8KDtf6aRQaF85wKSuyx2pspDmjwqJ646", //"8KDtf6aRQaF85wKSuyx2pspDmjwqJ646"
  network: Network.ETH_GOERLI,
  // network: Network.ETH_MAINNET,
};
const alchemy = new Alchemy(config);

export const myTokens = async () => {
  try {
    // Wallet address
    const address = multi.address; //await connectWallet();

    const tokenContractAddresses = [
      "0xfbC8E473eB41854DB5c760572FA89D77dD5279C2",
      "0xaD141A0891325412BB652428d4EBd5829287f27B",
      "0x6b2758d81d6155f6B76F8BD0778A01d1409dBE5E",
      // "0xF440AB566290B235DDd37EbA976716a44A1F8F74",
      // "0xdAC17F958D2ee523a2206206994597C13D831ec7", //Tether USDT
      // "0xB8c77482e45F1F44dE1745F52C74426C631bDD52", //Binance coin
      // "0x64Df3aAB3b21cC275bB76c4A581Cf8B726478ee0", //cramer coin
      // "0x45804880De22913dAFE09f4980848ECE6EcbAf78", //Pax Gold
      // "0x2A65D41dbC6E8925bD9253abfAdaFab98eA53E34", //MyToken
      // "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", //USD Coin
      // "0x6B175474E89094C44Da98b954EedeAC495271d0F", //Dai Stable Coin
      // "0xB15bcb8835D454f0B47236941C5cE93aF28d7cDB", //Ghost of Okiku
      // "0x59Ab4439aD7C67851FcCE6cA644FA673a1CF78ba", //Dog City
      // "0x6B3595068778DD592e39A122f4f5a5cF09C90fE2", //SushiSwap
      // "0x8E870D67F660D95d5be530380D0eC0bd388289E1",
    ];
    // Get token balances
    const balances = await alchemy.core.getTokenBalances(
      address,
      tokenContractAddresses
    );

    return balances;
  } catch (error) {
    console.log(error);
  }
};
