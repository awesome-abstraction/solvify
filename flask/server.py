from flask import Flask, request
import openai
import os
import json
from dotenv import load_dotenv
from web3 import Web3, EthereumTesterProvider

load_dotenv()

from tools import create_wallet, lend, send_token, swap, buy

openai.api_key = os.environ["OPENAI"]

app = Flask(__name__)

@app.route("/solver", methods=["GET"])
def solver():
    args = request.args
    prompt = args.get("prompt")
    # web3 = Web3(Web3.HTTPProvider(os.environ["INFURA"]))

    # prompt = "Send 1 ETH token to address xyz"
    # prompt = "Deposit 100 USD into the AAVE lending pool"
    # prompt = "Create a wallet for me please"
    # prompt = "Please swap 1 eth for usdc"
    # prompt = "Please buy me 50 apecoin"

    systemPrompt = "You are a helpful assistant that assists the user to execute crypto transactions."

    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages = [
            {
                "role": "system",
                "content": systemPrompt
            },
            {
                "role": "user",
                "content": prompt,
            }
        ],
        functions = [
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
                            "description": "The address that the tokens are being sent to"
                        }
                    },
                    "required": ["token, amount, address"]
                }
            },
            {
                "name": "swap",
                "description": "Swap tokens",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "from_token": {
                            "type": "string",
                            "enum": ["USDC", "ETH"]
                        },
                        "to_token": {
                            "type": "string",
                            "enum": ["USDC", "ETH"]
                        },
                        "amount": {
                            "type": "integer",
                            "description": "The amount of the from_token that is being exchanged from to_token"
                        }
                    },
                    "required": ["from_token", "to_token", "amount"]
                }
            },
            {
                "name": "buy",
                "description": "Buy tokens",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "token": {
                            "type": "string",
                            "enum": ["USDC", "ETH", "apecoin"]
                        },
                        "amount": {
                            "type": "integer",
                            "description": "The amount of tokens that the user would like to buy"
                        }
                    },
                    "required": ["token", "amount"]
                }
            }
        ],
        function_call="auto",
    )

    output = response.choices[0].message
    chosen_function = eval(output.function_call.name)
    params = json.loads(output.function_call.arguments)
    function_result = chosen_function(**params)

    return function_result

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=105)