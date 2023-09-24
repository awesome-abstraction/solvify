const path = require('path');
const rootPath = path.resolve(__dirname, '../');
const dotenv = require("dotenv")
const { getDefaultProvider, Contract, Wallet, utils } = require('ethers');
const { AxelarQueryAPI, Environment, EvmChain, GasToken} = require("@axelar-network/axelarjs-sdk");
const { eth } = require('web3');
const DistributionExecutable = require(`${rootPath}/${'artifacts/contracts/DistributionExecutable.sol/DistributionExecutable.json'}`)
const Gateway = require(`${rootPath}/${'artifacts/@axelar-network/axelar-gmp-sdk-solidity/contracts/interfaces/IAxelarGateway.sol/IAxelarGateway.json'}`);
const IERC20 = require(`${rootPath}/${'artifacts/@axelar-network/axelar-gmp-sdk-solidity/contracts/interfaces/IERC20.sol/IERC20.json'}`);

dotenv.config()

// Testnet RPCs
const ethRPC = 'https://goerli.infura.io/v3/a4812158fbab4a2aaa849e6f4a6dc605'
const polygonRPC = 'https://polygon-mumbai.g.alchemy.com/v2/Ksd4J1QVWaOJAJJNbr_nzTcJBJU-6uP3'
const arbRPC = 'https://goerli-rollup.arbitrum.io/rpc'
const lineaRPC = 'https://rpc.goerli.linea.build'

// Testnet Gateway Contracts
const ethGatewayAddress = '0xe432150cce91c13a887f7D836923d5597adD8E31'
const polygonGatewayAddress = '0xBF62ef1486468a6bd26Dd669C06db43dEd5B849B'
const arbGatewayAddress = '0xe432150cce91c13a887f7D836923d5597adD8E31'
const lineaGatewayAddress = '0xe432150cce91c13a887f7D836923d5597adD8E31'

// Testnet Distribution Contracts
const ethDistributionAddress = '0x39786c8dC764D4306B908F5Fc2De08A1382bD83D'
const polygonDistributionAddress = '0x8063623544561Db815f84521Ad0eAb023bE1497F'
const arbDistributionAddress = '0x8229896Cc02B98c0d21cb3d54D46DB1e156Ec764'
const lineaDistributionAddress = '0x62fD46BDEEF1657B97B9E27d58382351F6e6FEa2'

// Evm Chain IDs for axelar api
const ethChainID = "ethereum"
const polygonChainID = "polygon"
const lineaChainID = "linea"
const arbChainID = "arbitrum"

// Example prompt
// Send 10 USDC from Ethereum to Arbitrum from myself to this address

// Example inputs
// const fromChain = "Ethereum"
// const toChain = "Polygon"
// const amountToSend = "0.0001" 
// const recipients = ["0x6508AFcE56F08Ec965F0Dd9993805671d392c517"]
// const tokenSymbol = "aUSDC" 
async function executeCrossChainTransfer(
    fromChain,
    toChain,
    amountString,
    recipient,
    tokenSymbol){
    // setup inputs
    const recipients = []
    recipients.push(recipient)
    const amount = Math.floor(parseFloat(amountString)) * 1e6 || 10e6

    console.log(`Send ${amount} ${tokenSymbol} from myself to ${recipients[0]} across ${fromChain} to ${toChain}`)
    
    // Setup source chain variables
    let srcRPC;
    let srcChainID;
    let srcGatewayAddress;
    let srcDistributionAddress;
    if (fromChain == "Ethereum"){
        srcRPC = ethRPC;
        srcChainID = ethChainID;
        srcGatewayAddress = ethGatewayAddress;
        srcDistributionAddress = ethDistributionAddress;
    } else if(fromChain == "Polygon") {
        srcRPC = polygonRPC;
        srcChainID = polygonChainID;
        srcGatewayAddress = polygonGatewayAddress;
        srcDistributionAddress = polygonDistributionAddress;
    } else if(fromChain == "Arbitrum") {
        srcRPC = ethRPC;
        srcChainID = arbChainID;
        srcGatewayAddress = arbGatewayAddress;
        srcDistributionAddress = arbDistributionAddress;
    } else if(fromChain == "Linea"){
        srcRPC = lineaRPC;
        srcChainID = lineaChainID;
        srcGatewayAddress = lineaGatewayAddress;
        srcDistributionAddress = lineaDistributionAddress;
    } else {
        console.log("Unsupported source chain provided.")
    }

    // Setup destination chain variables
    let destRPC;
    let destChainID;
    let destGatewayAddress;
    let destDistributionAddress;
    if (toChain == "Ethereum"){
        destRPC = ethRPC;
        destChainID = ethChainID;
        destGatewayAddress = ethGatewayAddress;
        destDistributionAddress = ethDistributionAddress;
    } else if(toChain == "Polygon") {
        destRPC = polygonRPC;
        destChainID = polygonChainID;
        destGatewayAddress = polygonGatewayAddress;
        destDistributionAddress = polygonGatewayAddress;   
    } else if(toChain == "Arbitrum") {
        destRPC = arbRPC;
        destChainID = arbChainID;
        destGatewayAddress = arbGatewayAddress;
        destDistributionAddress = arbDistributionAddress;
    } else if(toChain == "Linea"){
        destRPC = lineaRPC;
        destChainID = lineaChainID;
        destGatewayAddress = lineaGatewayAddress;
        destDistributionAddress = lineaDistributionAddress;
    } else {
        console.log("Unsupported destination chain provided.")
    }

    // setup wallet 
    const wallet = new Wallet(process.env.PRIVATE_KEY)

    // get chain providers
    const srcProvider = getDefaultProvider(srcRPC)
    const destProvider = getDefaultProvider(destRPC)

    // connect wallet to chains
    const srcWallet = wallet.connect(srcProvider)
    const destWallet = wallet.connect(destProvider)
    console.log("Wallets are setup.")

    // create gateway contract objects
    const srcGatewayContract = new Contract(srcGatewayAddress, Gateway.abi, srcWallet)
    const destGatewayContract = new Contract(destGatewayAddress, Gateway.abi, srcWallet)

    // create token contract objects
    const srcTokenAddress = await srcGatewayContract.tokenAddresses(tokenSymbol)
    const srcTokenContract = new Contract(srcTokenAddress, IERC20.abi, srcWallet)
    const destTokenAddress = await destGatewayContract.tokenAddresses(tokenSymbol)
    const destTokenContract = new Contract(destTokenAddress, IERC20.abi, destWallet)


    const srcBalance = await srcTokenContract.balanceOf(recipients[0])
    const destBalance = await destTokenContract.balanceOf(recipients[0])
    console.log("Token contracts created.")
    async function logAccountBalances() {
        console.log(`${recipients[0]} has ${srcBalance} ${tokenSymbol}`)
        console.log(`${recipients[0]} has ${destBalance} ${tokenSymbol}`);
    }
    logAccountBalances()

    // setup distribution contracts
    const srcDistributionContract = new Contract(srcDistributionAddress, DistributionExecutable.abi, srcWallet)

    // approve the transaction on the token address
    const approveTx = await srcTokenContract.approve(ethDistributionAddress, amount)
    await approveTx.wait()
    console.log("Approve transaction successful.")

    // calculate estimated gas fee using axelar api (always pay gas in eth)
    const api = new AxelarQueryAPI({ environment: Environment.TESTNET });
    const fee = await api.estimateGasFee(
        srcChainID,
        destChainID,
        GasToken.ETH,
        700000,
        2,
    );
    console.log(`Queried for gas estimation succssfully with the following fee: ${fee}`)

    const sendTx = await srcDistributionContract.sendToMany(
        toChain,
        destDistributionAddress,
        recipients,
        tokenSymbol,
        amount,{
            value: fee,
        },
    )
    await sendTx.wait()
    console.log(`Send transaction was successful.`)
    console.log(`Waiting until the updated balance is reflected on the destination chain.`)
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

// executeCrossChainTransfer("Ethereum", "Arbitrum", "2", "0x6508AFcE56F08Ec965F0Dd9993805671d392c517", "aUSDC", ).catch((error) => {
//     console.log(error);
// });

module.exports = executeCrossChainTransfer;