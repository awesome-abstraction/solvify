const path = require('path');
const rootPath = path.resolve(__dirname, '../');
const dotenv = require("dotenv")
const { getDefaultProvider, Contract, Wallet, utils } = require('ethers');
const { AxelarQueryAPI, Environment, EvmChain, GasToken} = require("@axelar-network/axelarjs-sdk");

const DistributionExecutable = require(`${rootPath}/${'artifacts/contracts/DistributionExecutable.sol/DistributionExecutable.json'}`)

const Gateway = require(`${rootPath}/${'artifacts/@axelar-network/axelar-gmp-sdk-solidity/contracts/interfaces/IAxelarGateway.sol/IAxelarGateway.json'}`);

const IERC20 = require(`${rootPath}/${'artifacts/@axelar-network/axelar-gmp-sdk-solidity/contracts/interfaces/IERC20.sol/IERC20.json'}`);

dotenv.config()

const fromChain = "Ethereum"
const toChain = "Polygon"
const amountToSend = "0.0001" // token amount
const recipients = ["0x6508AFcE56F08Ec965F0Dd9993805671d392c517"] // address to transfer tokens to myself
const tokenSymbol = "aUSDC" // token symbol

// Send 10 USDC from Ethereum to Arbitrum from myself to this address
// Convert my USDC to Arbitrum USDC
async function execute(
    toChain,
    amountString,
    recipients,
    tokenSymbol){
    const amount = Math.floor(parseFloat(amountString)) * 1e6 || 10e6
    console.log(`Amount of ${tokenSymbol} to send from ${fromChain} to ${toChain}: ${amount}.`)
    // setup wallet 
    const wallet = new Wallet(process.env.PRIVATE_KEY)

    // get chain providers
    const ethProvider = getDefaultProvider("https://goerli.infura.io/v3/a4812158fbab4a2aaa849e6f4a6dc605")
    // const avaProvider = getDefaultProvider("https://api.avax-test.network/ext/bc/C/rpc")
    const polygonProvider = getDefaultProvider("https://polygon-mumbai.g.alchemy.com/v2/Ksd4J1QVWaOJAJJNbr_nzTcJBJU-6uP3")

    // connect wallet to chains
    const srcWallet = wallet.connect(ethProvider)
    const destWallet = wallet.connect(polygonProvider)
    console.log("Wallets are setup.")

    const ethGatewayAddress = '0xe432150cce91c13a887f7D836923d5597adD8E31'
    // const avaGatewayAddress = '0xC249632c2D40b9001FE907806902f63038B737Ab'
    const polygonGatewayAddress = '0xBF62ef1486468a6bd26Dd669C06db43dEd5B849B'

    // create gateway contracts
    const ethGatewayContract = new Contract(ethGatewayAddress, Gateway.abi, srcWallet)
    // const avaGatewayContract = new Contract(avaGatewayAddress, Gateway.abi, destWallet)
    const polygonGatewayContract = new Contract(polygonGatewayAddress, Gateway.abi, destWallet)

    // create token contracts
    const srcTokenAddress = await ethGatewayContract.tokenAddresses(tokenSymbol)
    const srcTokenContract = new Contract(srcTokenAddress, IERC20.abi, srcWallet)
    const destTokenAddress = await polygonGatewayContract.tokenAddresses(tokenSymbol)
    const destTokenContract = new Contract(destTokenAddress, IERC20.abi, destWallet)
    const srcBalance = await srcTokenContract.balanceOf(recipients[0])
    const destBalance = await destTokenContract.balanceOf(recipients[0])
    console.log("Token contracts created.")
    async function logAccountBalances() {
        console.log(`${recipients[0]} has ${srcBalance} ${tokenSymbol}`)
        console.log(`${recipients[0]} has ${destBalance} ${tokenSymbol}`);
    }
    logAccountBalances()

    const ethDistributionAddress = '0x39786c8dC764D4306B908F5Fc2De08A1382bD83D' // contract deployed to goerli
    // const avaDistributionAddress = '' 
    const polygonDistributionAddress = '0x8063623544561Db815f84521Ad0eAb023bE1497F' // contract deployed to mumbai
    const ethDistributionContract = new Contract(ethDistributionAddress, DistributionExecutable.abi, srcWallet)
    // const avaDistributionContract = new Contract(avaDistributionAddress, DistributionExecutable.abi, destWallet)
    const polygonDistributionContract = new Contract(polygonDistributionAddress, DistributionExecutable.abi, destWallet)

    // approve the transaction on the token address
    const approveTx = await srcTokenContract.approve(ethDistributionAddress, amount)
    await approveTx.wait()
    console.log("Approve transaction successful.")

    // calculate estimated gas fee
    const api = new AxelarQueryAPI({ environment: Environment.TESTNET });
    const fee = await api.estimateGasFee(
        "ethereum-2",
        EvmChain.POLYGON,
        GasToken.ETH,
        700000, // where does this come from...
        2, // where does this come from...
    );
    console.log(`Queried for gas estimation succssfully with the following fee: ${fee}`)

    const sendTx = await ethDistributionContract.sendToMany(
        toChain,
        polygonDistributionAddress,
        recipients,
        tokenSymbol,
        amount,{
            value: fee,
        },
    )
    await sendTx.wait()
    console.log(`Send transaction was successful.`)
    console.log(`Waiting until the balance is reflected on the destination chain.`)
    while (true) {
        const updatedBalance = await destTokenContract.balanceOf(recipients[0]);

        if (updatedBalance > destBalance) {
            break;
        }

        await sleep(1000);
    }
    await logAccountBalances()
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

execute(toChain, amountToSend, recipients, tokenSymbol).catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });

  module.exports = {
    execute,
  };