const path = require('path');
const rootPath = path.resolve(__dirname, '../');
const { getDefaultProvider, Contract, Wallet } = require('ethers');
const { AxelarQueryAPI, Environment, EvmChain, GasToken} = require("@axelar-network/axelarjs-sdk");

const DistributionExecutable = require(`${rootPath}/${'artifacts/contracts/DistributionExecutable.sol/DistributionExecutable.json'}`)

const Gateway = require(`${rootPath}/${'artifacts/@axelar-network/axelar-gmp-sdk-solidity/contracts/interfaces/IAxelarGateway.sol/IAxelarGateway.json'}`);

const IERC20 = require(`${rootPath}/${'artifacts/@axelar-network/axelar-gmp-sdk-solidity/contracts/interfaces/IERC20.sol/IERC20.json'}`);

const fromChain = "Ethereum"
const toChain = "Polygon"
const amountToSend = "1" // token amount
const recipients = ["0x6508AFcE56F08Ec965F0Dd9993805671d392c517"] // address to transfer tokens to, for now myself
const tokenSymbol = "WETH" // token symbol

// Send 10 USDC from Ethereum to Arbitrum from myself to this address
// Convert my USDC to Arbitrum USDC
async function execute(
    toChain,
    amount,
    recipients,
    tokenSymbol){
    // setup wallet
    const PRIVATE_KEY = 'f52959927ca6cf5615a8b7db0d66ef0e9eadb4b93c1ff91941e90af27135dca8' // don't push to github pls
    const wallet = new Wallet(PRIVATE_KEY)

    // get chain providers
    const ethProvider = getDefaultProvider("https://goerli.infura.io/v3/a4812158fbab4a2aaa849e6f4a6dc605")
    const avaProvider = getDefaultProvider("https://api.avax-test.network/ext/bc/C/rpc")

    // connect wallet to chains
    const srcWallet = wallet.connect(ethProvider)
    const destWallet = wallet.connect(avaProvider)

    const ethGatewayAddress = '0xe432150cce91c13a887f7D836923d5597adD8E31'
    const avaGatewayAddress = '0xC249632c2D40b9001FE907806902f63038B737Ab'
    const polygonGatewayAddress = '0xBF62ef1486468a6bd26Dd669C06db43dEd5B849B'

    // create gateway contracts
    const ethGatewayContract = new Contract(ethGatewayAddress, Gateway.abi, srcWallet)
    // const avaGatewayContract = new Contract(avaGatewayAddress, Gateway.abi, destWallet)
    const polygonGatewayContract = new Contract(polygonGatewayAddress, Gateway.abi, destWallet)

    // create token contract
    const tokenAddress = await ethGatewayContract.tokenAddress(tokenSymbol)
    const tokenContract = new Contract(tokenAddress, IERC20.abi, srcWallet)

    // 
    const ethDistributionAddress = '0x39786c8dC764D4306B908F5Fc2De08A1382bD83D' // deploy contract to goerli
    // const avaDistributionAddress = '' 
    const polygonDistributionAddress = '0x8063623544561Db815f84521Ad0eAb023bE1497F'
    const ethDistributionContract = new Contract(ethDistributionAddress, DistributionExecutable.abi, srcWallet)
    // const avaDistributionContract = new Contract(avaDistributionAddress, DistributionExecutable.abi, destWallet)
    const polygonDistributionContract = new Contract(polygonDistributionAddress, DistributionExecutable.abi, destWallet)

    // approve the transaction on the token address
    const approveTx = await tokenContract.approve(ethDistributionAddress, amount)
    await approveTx.wait()

    // calculate estimated gas fee
    const api = new AxelarQueryAPI({ environment: Environment.TESTNET });
    const fee = api.estimateGasFee(
        EvmChain.ETHEREUM,
        EvmChain.POLYGON,
        GasToken.ETH,
        700000,
        2,
    );

    const sendTx = await ethDistributionContract.sendToMany(
        toChain,
        polygonDistributionAddress,
        recipients,
        tokenSymbol,
        ethers.utils.parseUnits(amount, 6),{
            value: fee,
        },
    )
    await sendTx.wait()
}

execute(toChain,amountToSend,recipients,tokenSymbol).catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });