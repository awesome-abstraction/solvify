import web3
from web3 import Web3, HTTPProvider
from decouple import config

import json
from typing import Optional, Type

import requests
from langchain.callbacks.manager import CallbackManagerForToolRun
from langchain.tools import BaseTool

from aiudittool.utils import CMC_NETWORK_NAMES, NETWORKS, get_web3
from pydantic import BaseModel, Field

# Wallet that will receive APECOIN
sender_address = "0xcc9309b734C523226210bFac36b3A6fe5Bec66ad"

def transferApeCoin():
    INFURA_API_KEY = config("INFURA_API_KEY")
    ETH_SENDER_KEY = config("ETH_SENDER_KEY")
    APECOIN_ADDRESS_MAINNET = "0x4d224452801ACEd8B2F0aebE155379bb5D594381"
    NETWORK= "mainnet"
    eth_rpc_url = "https://{NETWORK}.infura.io/v3/{INFURA_API_KEY}"
    eth_rpc_url = "https://mainnet.infura.io/v3/06bd8e943c7046b78ee5225573a8f314"
    # Initialize a Web3 instance
    w3 = Web3(HTTPProvider(eth_rpc_url))

    # Load the ABI (Application Binary Interface) of the token contract
    with open('./apecoin_abi.json', 'r') as abi_file:
        token_abi = json.load(abi_file)

    # Create a contract instance
    token_contract = w3.eth.contract(address=sender_address, abi=token_abi)

    # Define the amount of Goerli ETH to transfer in wei
    amount_to_transfer_wei = w3.toWei('0.001', 'ether')
    current_nonce = w3.eth.getTransactionCount(sender_address, "pending")

    # Build the transaction
    transaction = {
        'to': APECOIN_ADDRESS_MAINNET,
        'value': amount_to_transfer_wei,
        'gas': 21000,  # Standard gas limit for a simple Ether transfer
        'gasPrice': w3.toWei('5', 'gwei'),  # Replace with an appropriate gas price
        'nonce': current_nonce + 1,
    }

    # Sign the transaction
    signed_transaction = w3.eth.account.signTransaction(transaction, ETH_SENDER_KEY)

    # Send the transaction
    transaction_hash = w3.eth.sendRawTransaction(signed_transaction.rawTransaction)

    print(f"Transaction sent with hash: {transaction_hash.hex()}")


class ApeCoinToolInput(BaseModel):
    address: str = Field(
        description="The wallet address that swaps ETH for Apecoin APE"
    )

class ApeCoinTool(BaseTool):
    name = "ApeCoinTool"
    description = "This tool allows the user to swap ETH for Apecoin APE ."
    args_schema: Type[BaseModel] = ApeCoinToolInput

    def _run(
        self,
        address: str,
        run_manager: Optional[CallbackManagerForToolRun] = None,
    ) -> str:
        transferApeCoin()

    def _arun(
        self,
        network: NETWORKS,
        symbol: str,
        run_manager: Optional[CallbackManagerForToolRun] = None,
    ) -> str:
        raise NotImplementedError


# Quick Test
if __name__ == "__main__":
    tool = ApeCoinTool()
    response = tool._run(sender_address)