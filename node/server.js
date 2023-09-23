const express = require("express");
const axios = require("axios");
const OpenAI = require("openai");
const dotenv = require("dotenv");
const { ethers } = require("ethers");
const Web3 = require("web3");
const web3 = new Web3(process.env.INFURA);

dotenv.config();
const app = express();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

const contractABI = [
    {
        'constant': false,
        'inputs': [
            {
                'name': '_to',
                'type': 'address'
            },
            {
                'name': '_value',
                'type': 'uint256'
            }
        ],
        'name': 'transfer',
        'outputs': [
            {
                'name': '',
                'type': 'bool'
            }
        ],
    }
]

async function send_token(tokenAddress, amount, toAddress) {
    const provider = new ethers.providers.JsonRpcProvider(process.env.INFURA);
    const toAddy = await provider.resolveName(toAddress);
    const contract = new web3.eth.Contract(contractABI, tokenAddress, { from: process.env.SEPOLIA })
    const amt = web3.utils.toHex(Web3js.utils.toWei(amount));
    const data = contract.methods.transfer(toAddy, amt).encodeABI();

    let txObj = {
        gas: web3.utils.toHex(100000),
        "to": tokenAddress,
        "value": "0x00",
        "data": data,
        "from": process.env.SEPOLIA
    }

    web3.eth.accounts.signTransaction(txObj, process.env.SEPOLIA_KEY, (err, signedTx) => {
        if (err) { 
            return callback(err);
        } else {
            console.log(signedTx)
            return web3.eth.sendSignedTransaction(signedTx.rawTransaction, (err, res) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log(res);
                }
            })
        }
    });
}

app.get("/solver", async (req, res) => {
    console.log("In solver");

    const prompt = "Send 1 ETH token to address derek.eth";
    const systemPrompt = "You are a helpful assistant that assists the user to execute crypto transactions."

    const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
            {
                "role": "system",
                "content": systemPrompt
            },
            {
                "role": "user",
                "content": prompt,
            },
        ],
        functions: [
            {
                "name": "send_token",
                "description": "Send a given amount of a token to a given address",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "token": {
                            "type": "string",
                            "enum": ["USDC", "ETH"]
                        },
                        "amount": {
                            "type": "integer",
                            "description": "The amount of the token being sent, e.g. 2.05"
                        },
                        "address": {
                            "type": "string",
                            "description": "The address that the tokens are being sent to, e.g. "
                        }
                    },
                    "required": ["token, amount, address"]
                }
            },
        ],
        function_call: "auto",
    });

    const function_call = response.choices[0].message.function_call;

    if(function_call) {
        if(function_call.name === "send_token") {
            const params = JSON.parse(function_call.arguments);
            console.log(params);

            const output = await send_token(params.token, params.amount, params.address);
            console.log(output);
        }
    }

    return JSON.stringify(response);
})

app.listen(3000);