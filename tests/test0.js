const convert = (amount, decimals) => ethers.utils.parseUnits(amount, decimals);
const divDec = (amount, decimals = 18) => amount / 10 ** decimals;
const divDec6 = (amount, decimals = 6) => amount / 10 ** decimals;
const { expect } = require("chai");
const { ethers, network } = require("hardhat");
const { execPath } = require("process");

const AddressZero = "0x0000000000000000000000000000000000000000";

let owner, treasury, user0, user1, user2, user3;
let usdc;
let television;

describe("local: test0", function () {
  before("Initial set up", async function () {
    console.log("Begin Initialization");

    [owner, treasury, user0, user1, user2, user3] = await ethers.getSigners();

    const usdcArtifact = await ethers.getContractFactory("USDC");
    usdc = await usdcArtifact.deploy();
    console.log("- USDC Initialized");

    const televisionArtifact = await ethers.getContractFactory("Television");
    television = await televisionArtifact.deploy(usdc.address);
    console.log("- Television Initialized");

    const amount = convert("100000", 6);
    await usdc.connect(owner).mint(user0.address, amount);
    await usdc.connect(owner).mint(user1.address, amount);
    await usdc.connect(owner).mint(user2.address, amount);
    await usdc.connect(owner).mint(user3.address, amount);
    console.log("- System set up");

    console.log("Initialization Complete");
    console.log();
  });

  it("Television Data", async function () {
    console.log("******************************************************");
    console.log("Television Data");
    let res = await television.getSlot0();
    console.log("Epoch ID: ", res.epochId);
    console.log("Init Price: ", res.initPrice);
    console.log("Start Time: ", res.startTime);
    console.log("Owner: ", res.owner);
    console.log("URI: ", res.uri);
    console.log("Price: ", divDec6(await television.getPrice()));
    console.log("******************************************************");
  });

  it("Forward time 4 hours", async function () {
    console.log("******************************************************");
    await network.provider.send("evm_increaseTime", [4 * 3600]); // 4 hours
    await network.provider.send("evm_mine");
  });

  it("Television Data", async function () {
    console.log("******************************************************");
    console.log("Television Data");
    let res = await television.getSlot0();
    console.log("Epoch ID: ", res.epochId);
    console.log("Init Price: ", res.initPrice);
    console.log("Start Time: ", res.startTime);
    console.log("Owner: ", res.owner);
    console.log("URI: ", res.uri);
    console.log("Price: ", divDec6(await television.getPrice()));
    console.log("******************************************************");
  });

  it("User0 takes over channel", async function () {
    console.log("******************************************************");
    const uri = "https://example.com/0";
    let price = await television.getPrice();
    let res = await television.getSlot0();
    await usdc.connect(user0).approve(television.address, price);
    await television
      .connect(user0)
      .takeover(uri, user0.address, res.epochId, 1959481628, price);
    console.log("******************************************************");
  });

  it("Television Data", async function () {
    console.log("******************************************************");
    console.log("Television Data");
    let res = await television.getSlot0();
    console.log("Epoch ID: ", res.epochId);
    console.log("Init Price: ", res.initPrice);
    console.log("Start Time: ", res.startTime);
    console.log("Owner: ", res.owner);
    console.log("URI: ", res.uri);
    console.log("Price: ", divDec6(await television.getPrice()));
    console.log("******************************************************");
  });

  it("Set treasury", async function () {
    console.log("******************************************************");
    await television.connect(owner).setTreasury(treasury.address);
    console.log("******************************************************");
  });

  it("User1 takes over channel", async function () {
    console.log("******************************************************");
    const uri = "https://example.com/1";
    let price = await television.getPrice();
    let res = await television.getSlot0();
    await usdc.connect(user1).approve(television.address, price);
    await television
      .connect(user1)
      .takeover(uri, user1.address, res.epochId, 1959481628, price);
    console.log("******************************************************");
  });

  it("Television Data", async function () {
    console.log("******************************************************");
    console.log("Television Data");
    let res = await television.getSlot0();
    console.log("Epoch ID: ", res.epochId);
    console.log("Init Price: ", res.initPrice);
    console.log("Start Time: ", res.startTime);
    console.log("Owner: ", res.owner);
    console.log("URI: ", res.uri);
    console.log("Price: ", divDec6(await television.getPrice()));
    console.log("******************************************************");
  });

  it("Forward time 1 hours", async function () {
    console.log("******************************************************");
    await network.provider.send("evm_increaseTime", [1 * 3600]); // 1 hours
    await network.provider.send("evm_mine");
  });

  it("User1 takes over channel", async function () {
    console.log("******************************************************");
    const uri = "https://example.com/1";
    let price = await television.getPrice();
    let res = await television.getSlot0();
    await usdc.connect(user1).approve(television.address, price);
    await television
      .connect(user1)
      .takeover(uri, user1.address, res.epochId, 1959481628, price);
    console.log("******************************************************");
  });

  it("Forward time 1 hours", async function () {
    console.log("******************************************************");
    await network.provider.send("evm_increaseTime", [1 * 3600]); // 1 hours
    await network.provider.send("evm_mine");
  });

  it("User1 takes over channel", async function () {
    console.log("******************************************************");
    const uri = "https://example.com/1";
    let price = await television.getPrice();
    let res = await television.getSlot0();
    await usdc.connect(user1).approve(television.address, price);
    await television
      .connect(user1)
      .takeover(uri, user1.address, res.epochId, 1959481628, price);
    console.log("******************************************************");
  });

  it("Forward time 1 hours", async function () {
    console.log("******************************************************");
    await network.provider.send("evm_increaseTime", [1 * 3600]); // 1 hours
    await network.provider.send("evm_mine");
  });

  it("User2 takes over channel", async function () {
    console.log("******************************************************");
    const uri = "https://example.com/2";
    let price = await television.getPrice();
    let res = await television.getSlot0();
    await usdc.connect(user2).approve(television.address, price);
    await television
      .connect(user2)
      .takeover(uri, user2.address, res.epochId, 1959481628, price);
    console.log("******************************************************");
  });

  it("Forward time 1 hours", async function () {
    console.log("******************************************************");
    await network.provider.send("evm_increaseTime", [1 * 3600]); // 1 hours
    await network.provider.send("evm_mine");
  });

  it("User1 takes over channel", async function () {
    console.log("******************************************************");
    const uri = "https://example.com/1";
    let price = await television.getPrice();
    let res = await television.getSlot0();
    await usdc.connect(user1).approve(television.address, price);
    await television
      .connect(user1)
      .takeover(uri, user1.address, res.epochId, 1959481628, price);
    console.log("******************************************************");
  });

  it("Forward time 1 hours", async function () {
    console.log("******************************************************");
    await network.provider.send("evm_increaseTime", [1 * 3600]); // 1 hours
    await network.provider.send("evm_mine");
  });

  it("User2 takes over channel", async function () {
    console.log("******************************************************");
    const uri = "https://example.com/2";
    let price = await television.getPrice();
    let res = await television.getSlot0();
    await usdc.connect(user2).approve(television.address, price);
    await television
      .connect(user2)
      .takeover(uri, user2.address, res.epochId, 1959481628, price);
    console.log("******************************************************");
  });

  it("Forward time 16 hours", async function () {
    console.log("******************************************************");
    await network.provider.send("evm_increaseTime", [16 * 3600]); // 16 hours
    await network.provider.send("evm_mine");
  });

  it("User3 takes over channel", async function () {
    console.log("******************************************************");
    const uri = "https://example.com/3";
    let price = await television.getPrice();
    let res = await television.getSlot0();
    await usdc.connect(user3).approve(television.address, price);
    await television
      .connect(user3)
      .takeover(uri, user3.address, res.epochId, 1959481628, price);
    console.log("******************************************************");
  });

  it("Forward time 8 hours", async function () {
    console.log("******************************************************");
    await network.provider.send("evm_increaseTime", [8 * 3600]); // 8 hours
    await network.provider.send("evm_mine");
  });

  it("User0 takes over channel", async function () {
    console.log("******************************************************");
    const uri = "https://example.com/0";
    let price = await television.getPrice();
    let res = await television.getSlot0();
    await usdc.connect(user0).approve(television.address, price);
    await television
      .connect(user0)
      .takeover(uri, user0.address, res.epochId, 1959481628, price);
    console.log("******************************************************");
  });

  it("Television Data", async function () {
    console.log("******************************************************");
    console.log("Television Data");
    let res = await television.getSlot0();
    console.log("Epoch ID: ", res.epochId);
    console.log("Init Price: ", res.initPrice);
    console.log("Start Time: ", res.startTime);
    console.log("Owner: ", res.owner);
    console.log("URI: ", res.uri);
    console.log("Price: ", divDec6(await television.getPrice()));
    console.log("******************************************************");
  });

  it("Forward time 48 hours", async function () {
    console.log("******************************************************");
    await network.provider.send("evm_increaseTime", [48 * 3600]); // 48 hours
    await network.provider.send("evm_mine");
  });

  it("Television Data", async function () {
    console.log("******************************************************");
    console.log("Television Data");
    let res = await television.getSlot0();
    console.log("Epoch ID: ", res.epochId);
    console.log("Init Price: ", res.initPrice);
    console.log("Start Time: ", res.startTime);
    console.log("Owner: ", res.owner);
    console.log("URI: ", res.uri);
    console.log("Price: ", divDec6(await television.getPrice()));
    console.log("******************************************************");
  });

  it("user1 takes over channel", async function () {
    console.log("******************************************************");
    const uri = "https://example.com/1";
    let price = await television.getPrice();
    let res = await television.getSlot0();
    await usdc.connect(user1).approve(television.address, price);
    await television
      .connect(user1)
      .takeover(uri, user1.address, res.epochId, 1959481628, price);
    console.log("******************************************************");
  });

  it("Television Data", async function () {
    console.log("******************************************************");
    console.log("Television Data");
    let res = await television.getSlot0();
    console.log("Epoch ID: ", res.epochId);
    console.log("Init Price: ", res.initPrice);
    console.log("Start Time: ", res.startTime);
    console.log("Owner: ", res.owner);
    console.log("URI: ", res.uri);
    console.log("Price: ", divDec6(await television.getPrice()));
    console.log("******************************************************");
  });
});
