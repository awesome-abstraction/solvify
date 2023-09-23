from web3 import Web3, EthereumTesterProvider
import os
from dotenv import load_dotenv
load_dotenv()

def create_wallet():
    return "create_wallet"

def lend(pool, amount):
    return "USD lent!"

def send_token(token, amount, address):
    return "Token sent!"

def swap(from_token, to_token, amount):
    # here
    return "Tokens swapped!"

def buy(token, amount):
    return "Tokens bought!"