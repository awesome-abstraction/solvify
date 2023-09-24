import web3
from web3 import Web3, HTTPProvider
from decouple import config

import json
from typing import Optional, Type

import requests
from langchain.callbacks.manager import CallbackManagerForToolRun
from langchain.tools import BaseTool

from aiudittool.utils import CMC_NETWORK_NAMES, NETWORKS, get_web3, NETWORK_RPC_ENDPOINTS
from pydantic import BaseModel, Field


import os
import secrets
from uuid import uuid4
from eth_account.account import Account
from eth_account.signers.local import LocalAccount
from flashbots import flashbot
from web3.exceptions import TransactionNotFound
from web3.types import TxParams

# Wallet that will receive APECOIN
def transferTokenGoerli():
    INFURA_API_KEY = config("INFURA_API_KEY")
    sender_address = "0xcc9309b734C523226210bFac36b3A6fe5Bec66ad"
    sender_private_key = config("ETH_SENDER_KEY")
    recipient_address = "0x39b36FE39A14365709d52a4Aeb36E80CdA88Ce67"
    goerli_rpc_url = f"https://goerli.infura.io/v3/{INFURA_API_KEY}"
    w3 = Web3(Web3.HTTPProvider(goerli_rpc_url))

    current_nonce = w3.eth.getTransactionCount(sender_address, "pending")

    # Define the transaction parameters
    transaction_params = {
        "to": recipient_address,
        "value": w3.toWei(0.0001, "ether"),  # Amount to send in wei (0.1 ETH in this example)
        "gas": 21000,  # Gas limit for the transaction
        "nonce": current_nonce,
        "gasPrice": w3.toWei("10", "gwei"),  # Gas price in wei (50 Gwei in this example)
    }

    # Sign and send the transaction
    transaction = w3.eth.account.signTransaction(transaction_params, sender_private_key)
    transaction_hash = w3.eth.sendRawTransaction(transaction.rawTransaction)

    print(f"Transaction sent with hash: {transaction_hash.hex()}")

