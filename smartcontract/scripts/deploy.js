/** @format */

const hre = require("hardhat");
const fs = require("fs");

async function main() {
  const Bulksend = await hre.ethers.getContractFactory("Bulksend");
  const bulksend = await Bulksend.deploy();
  await bulksend.deployed();
  console.log("bulksend deployed to:", bulksend.address);

  const data = {
    address: bulksend.address,
    abi: JSON.parse(bulksend.interface.format("json")),
  };

  //This writes the ABI and address to the mktplace.json
  fs.writeFileSync("./Bulksend.json", JSON.stringify(data));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
