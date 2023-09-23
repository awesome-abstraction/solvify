# Swap all ETH to USDC on an L2 like Polygon zkEVM, Arbitrum using 1inch API


import json
import logging
from typing import Optional
from pathlib import Path

import requests
from web3 import Web3

from decouple import config
from langchain.callbacks.manager import CallbackManagerForToolRun
from langchain.tools import BaseTool

from aiudittool.utils import CMC_NETWORK_NAMES, NETWORKS, get_web3, save_to_text_file, NETWORK_RPC_ENDPOINTS
from typing import Type
import subprocess
from pydantic import BaseModel, Field

USDC_ADDRESS="0x7EA2be2df7BA6E54B1A9C70676f668455E329d29"  # Token address of usdc
APECOIN_ADDRESS="0x4d224452801ACEd8B2F0aebE155379bb5D594381" # Token address of apecoin
walletAddress = config("WALLET_ADDRESS")

UNI_ADDRESS="0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984"


def execute_swap(src: str, dst:str, amount: str, from_add:str, slippage=1.0):
    endpoint = 'https://api.1inch.dev/swap/v5.2/1/swap'
    payload = {
        'src': src,
        'dst': dst,
        'amount': amount,
        'from': from_add,
        'slippage': slippage
    }
    response = requests.get(
        endpoint, 
        params=payload, 
        headers={'Authorization': f'Bearer {ONEINCH_API_KEY}'})
    return response.json()

def check_swappable_tokens():
    endpoint = 'https://api.1inch.dev/swap/v5.2/1/tokens'
    payload = {
    }
    response = requests.get(
        endpoint, 
        params=payload,
        headers={'Authorization': f'Bearer {ONEINCH_API_KEY}'})
    return response.json()

def get_token_balances(wallet_address):
    endpoint = f'https://api.1inch.dev/balance/v1.2/1/balances/{ONE}'
    response = requests.get(endpoint)

    if response.status_code == 200:
        print(response)
        return response.json()
    else:
        print(f"Failed to fetch token balances. Error code: {response.status_code}")
        return None


def oneinch_swap():
    ONEINCH_API_KEY = config("ONEINCH_API_KEY")
    chainId =  1 # Chain ID for Mainnet
    web3RpcUrl = NETWORK_RPC_ENDPOINTS['ethereum_mainnet']  # URL for Mainnet node
    headers = {f"Authorization": "Bearer {ONEINCH_API_KEY}", "accept": "application/json" }
    walletAddress = config("WALLET_ADDRESS")
    privateKey = config("ETH_SENDER_KEY") 

    swapParams = {
        "src": "0x7EA2be2df7BA6E54B1A9C70676f668455E329d29",  # Token address of usdc
        "dst": "0x4d224452801ACEd8B2F0aebE155379bb5D594381",  # Token address of apecoin
        "amount": "183",  # Amount of 1INCH to swap (in wei)
        "from": walletAddress,
        "slippage": 1,  # Maximum acceptable slippage percentage for the swap (e.g., 1 for 1%)
        "disableEstimate": False,  # Set to True to disable estimation of swap details
        "allowPartialFill": False,  # Set to True to allow partial filling of the swap order
    }

    apiBaseUrl = f"https://api.1inch.dev/swap/v5.2/{chainId}"
    web3 = Web3(web3RpcUrl);

def intToDecimal(qty, decimal):
      return int(qty * int("".join(["1"] + ["0"]*decimal)))
      
if __name__ == "__main__":
    ONEINCH_API_KEY = config("ONEINCH_API_KEY")
    # Execute a token swap
    from_token_address = USDC_ADDRESS
    to_token_address = UNI_ADDRESS
    amount_to_swap = "1"
    # Replace with the desired amount to swap
    swap_result = execute_swap(USDC_ADDRESS, APECOIN_ADDRESS, amount_to_swap, walletAddress)

