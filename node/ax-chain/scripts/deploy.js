// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

const ethGatewayAddress = '0xe432150cce91c13a887f7D836923d5597adD8E31'
const avaGatewayAddress = '0xC249632c2D40b9001FE907806902f63038B737Ab'
const ethGasServiceAddress = '0xbE406F0189A0B4cf3A05C286473D23791Dd44Cc6'
const avaGasServiceAddress = '0xbE406F0189A0B4cf3A05C286473D23791Dd44Cc6'
const polygonGatewayAddress = '0xBF62ef1486468a6bd26Dd669C06db43dEd5B849B'
const polygonGasServiceAddress = '0xbE406F0189A0B4cf3A05C286473D23791Dd44Cc6'

const arbGatewayAddress = '0xe432150cce91c13a887f7D836923d5597adD8E31'
const arbGasServiceAddress = '0xbE406F0189A0B4cf3A05C286473D23791Dd44Cc6'
const lineaGatewayAddress = '0xe432150cce91c13a887f7D836923d5597adD8E31'
const lineaGasServiceAddress = '0xbE406F0189A0B4cf3A05C286473D23791Dd44Cc6'


async function main() {
  const exec = await hre.ethers.deployContract("DistributionExecutable", [polygonGasServiceAddress, polygonGasServiceAddress])
  await exec.waitForDeployment()
  console.log("Distribution contract deployed.")
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
