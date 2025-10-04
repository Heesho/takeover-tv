const { ethers } = require("hardhat");
const { utils, BigNumber } = require("ethers");
const hre = require("hardhat");
const AddressZero = "0x0000000000000000000000000000000000000000";

/*===================================================================*/
/*===========================  SETTINGS  ============================*/

const TREASURY_ADDRESS = "0x039ec2E90454892fCbA461Ecf8878D0C45FDdFeE"; // Treasury Address

/*===========================  END SETTINGS  ========================*/
/*===================================================================*/

// Constants
const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));
const convert = (amount, decimals) => ethers.utils.parseUnits(amount, decimals);
const divDec6 = (amount, decimals = 6) => amount / 10 ** decimals;

// Contract Variables
let usdc;
let television;

/*===================================================================*/
/*===========================  CONTRACT DATA  =======================*/

async function getContracts() {
  usdc = await ethers.getContractAt(
    "contracts/mocks/USDC.sol:USDC",
    "0x6c268B147FeB6d50a165F2357cE2eC57EF17d5B7"
  );

  television = await ethers.getContractAt(
    "contracts/Television.sol:Television",
    "0x7136763c7951F923b1861774CF9ef12095cb21DD"
  );

  console.log("Contracts Retrieved");
}

/*===========================  END CONTRACT DATA  ===================*/
/*===================================================================*/

async function deployUsdc() {
  console.log("Starting USDC Deployment");
  const usdcArtifact = await ethers.getContractFactory("USDC");
  const usdcContract = await usdcArtifact.deploy({
    gasPrice: ethers.gasPrice,
  });
  usdc = await usdcContract.deployed();
  await sleep(5000);
  console.log("USDC Deployed at:", usdc.address);
}

async function verifyUsdc() {
  console.log("Starting USDC Verification");
  await hre.run("verify:verify", {
    address: usdc.address,
    contract: "contracts/mocks/USDC.sol:USDC",
  });
  console.log("USDC Verified");
}

async function deployTelevision() {
  console.log("Starting TokenFactory Deployment");
  const televisionArtifact = await ethers.getContractFactory("Television");
  const televisionContract = await televisionArtifact.deploy(usdc.address, {
    gasPrice: ethers.gasPrice,
  });
  television = await televisionContract.deployed();
  await sleep(5000);
  console.log("Television Deployed at:", television.address);
}

async function verifyTelevision() {
  console.log("Starting TokenFactory Verification");
  await hre.run("verify:verify", {
    address: television.address,
    contract: "contracts/Television.sol:Television",
    constructorArguments: [usdc.address],
  });
  console.log("Television Verified");
}

async function printDeployment() {
  console.log("**************************************************************");
  console.log("USDC: ", usdc.address);
  console.log("Television: ", television.address);
  console.log("**************************************************************");
}

async function main() {
  const [wallet] = await ethers.getSigners();
  console.log("Using wallet: ", wallet.address);

  await getContracts();

  //===================================================================
  // Deploy System
  //===================================================================

  // console.log("Starting System Deployment");
  // await deployUsdc();
  // await deployTelevision();
  // await printDeployment();

  /*********** UPDATE getContracts() with new addresses *************/

  //===================================================================
  // Verify System
  //===================================================================

  // console.log("Starting System Verification");
  // await verifyUsdc();
  // await sleep(5000);
  // await verifyTelevision();

  //===================================================================
  // Transactions
  //===================================================================

  console.log("Starting Transactions");

  // console.log("**************************************************************");
  // console.log("Mint USDC");
  // const mintTx = await usdc
  //   .connect(wallet)
  //   .mint(wallet.address, convert("100000", 6));
  // await mintTx.wait();
  // console.log("USDC Minted: ", divDec6(await usdc.balanceOf(wallet.address)));
  // console.log("**************************************************************");

  // console.log("**************************************************************");
  // console.log("Set Treasury");
  // const setTreasuryTx = await television
  //   .connect(wallet)
  //   .setTreasury(TREASURY_ADDRESS);
  // await setTreasuryTx.wait();
  // console.log("Treasury Set: ", await television.treasury());
  // console.log("**************************************************************");

  console.log("**************************************************************");
  console.log("Television Data");
  let res = await television.getSlot0();
  console.log("Epoch ID: ", res.epochId);
  console.log("Init Price: ", divDec6(res.initPrice));
  console.log("Start Time: ", res.startTime);
  console.log("Owner: ", res.owner);
  console.log("URI: ", res.uri);
  console.log("Price: ", divDec6(await television.getPrice()));
  console.log("**************************************************************");

  // console.log("**************************************************************");
  // console.log("Takeover");
  // let uri = "https://example.com/0";
  // let price = await television.getPrice();
  // res = await television.getSlot0();
  // const approveTx = await usdc
  //   .connect(wallet)
  //   .approve(television.address, price);
  // await approveTx.wait();
  // const takeoverTx = await television
  //   .connect(wallet)
  //   .takeover(uri, wallet.address, res.epochId, 1959481628, price);
  // await takeoverTx.wait();
  // console.log(
  //   "Takeover Successful, new price: ",
  //   divDec6(await television.getPrice())
  // );
  // console.log("**************************************************************");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
