from web3 import Web3, EthereumTesterProvider, HTTPProvider
from decouple import config
import json

import os

def create_wallet():
    return "create_wallet"

def lend(pool, amount):
    return "USD lent!"

def transfer_eth_to_apecoin(sender_address: str):
    # Wallet that will receive APECOIN
    INFURA_API_KEY = config("INFURA_API_KEY")
    ETH_SENDER_KEY = config("ETH_SENDER_KEY")
    APECOIN_ADDRESS_MAINNET = "0x4d224452801ACEd8B2F0aebE155379bb5D594381"
    APECOIN_ADDRESS_GOERLI = "0xA68AbBb4e36b18A16732CF6d42E826AAA27F52Fc"   
    NETWORK= "mainnet"
    eth_rpc_url = "https://mainnet.infura.io/v3/06bd8e943c7046b78ee5225573a8f314"
    # Initialize a Web3 instance
    w3 = Web3(HTTPProvider(eth_rpc_url))

    # Load the ABI (Application Binary Interface) of the token contract
    with open('./tools/transfer_apecoin_tool/apecoin_abi.json', 'r') as abi_file:
        token_abi = json.load(abi_file)

    # Create a contract instance
    token_contract = w3.eth.contract(address=sender_address, abi=token_abi)

    # Define the amount of Goerli ETH to transfer in wei
    amount_to_transfer_wei = w3.to_wei('0.001', 'ether')
    current_nonce = w3.eth.get_transaction_count(sender_address, "pending")

    # Build the transaction
    transaction = {
        'to': APECOIN_ADDRESS_MAINNET,
        'value': amount_to_transfer_wei,
        'gas': 21000,  # Standard gas limit for a simple Ether transfer
        'gasPrice': w3.to_wei('5', 'gwei'),  # Replace with an appropriate gas price
        'nonce': current_nonce + 3,
    }

    # Sign the transaction
    signed_transaction = w3.eth.account.sign_transaction(transaction, ETH_SENDER_KEY)

    # Send the transaction
    transaction_hash = w3.eth.send_raw_transaction(signed_transaction.rawTransaction)

    print(f"Transaction sent with hash: {transaction_hash.hex()}")

    return "Receive Apecoin"

def send_ether_token(amount, 
                sender_address, 
                sender_private_key,
                receiver_address):

    INFURA_API_KEY = config("INFURA_API_KEY")
    ETH_SENDER_KEY = config("ETH_SENDER_KEY")
    eth_rpc_url = f"https://goerli.infura.io/v3/06bd8e943c7046b78ee5225573a8f314"

    # Initialize a Web3 instance
    w3 = Web3(HTTPProvider(eth_rpc_url))

    # Define the amount of Goerli ETH to transfer in wei
    amount_to_transfer_wei = w3.to_wei('0.00001', 'ether')
    current_nonce = w3.eth.get_transaction_count(sender_address, "pending")
    print(w3.eth.get_balance(sender_address))
    # Build the transaction
    transaction_params = {
        'to': receiver_address,
        'value': amount_to_transfer_wei,
        'gas': 21000,  # Standard gas limit for a simple Ether transfer
        'gasPrice': w3.to_wei('5000', 'gwei'),  # Replace with an appropriate gas price
        'nonce': current_nonce + 9,
    }

    # Sign and send the transaction
    signed_transaction = w3.eth.account.sign_transaction(transaction_params, ETH_SENDER_KEY)
    transaction_hash = w3.eth.send_raw_transaction(signed_transaction.rawTransaction)

    print(f"Transaction sent with hash: {transaction_hash.hex()}")
    
def swap(from_token, to_token, amount):
    USDC_ADDRESS="0x7EA2be2df7BA6E54B1A9C70676f668455E329d29"  # Token address of usdc
    APECOIN_ADDRESS="0x4d224452801ACEd8B2F0aebE155379bb5D594381" # Token address of apecoin
    walletAddress = config("WALLET_ADDRESS")
    UNI_ADDRESS="0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984"
    ONEINCH_API_KEY = config("ONEINCH_API_KEY")
    
    # Execute a token swap
    from_token_address = USDC_ADDRESS
    to_token_address = UNI_ADDRESS
    amount_to_swap = "1"
    # Replace with the desired amount to swap
    swap_result = execute_swap(USDC_ADDRESS, APECOIN_ADDRESS, amount_to_swap, walletAddress)

def buy(token, amount):
    return "Tokens bought!"

def quick_node_tool(tool_execution_path: str):
    QUICKNODE_API_KEY = config("QUICKNODE_API_KEY")
    ETHEREUM_MAINNET_URL = "https://young-wispy-shape.quiknode.pro/57804466c8ab909a08a2cbf4f72526b69965172c/"
    ETHEREUM_SEPOLIA_URL="https://greatest-lively-asphalt.ethereum-sepolia.discover.quiknode.pro/46192a9dd428a635335c4eb3e7b7d1be6380b05d/"

    _getWalletTokenBalance(walletAddress: str, networkUrl: str)
    _getWalletTokenTransactions(walletAddress: str, tokenAddress: str, networkUrl: str)
    _getTransactionsByAddress(contractAddress: str, networkUrl: str)
    
def execute_swap(self, src: str, dst:str, amount: str, from_add:str, slippage=1.0):
    ONEINCH_API_KEY = config("ONEINCH_API_KEY")
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

    
def _getWalletTokenBalance(walletAddress: str, networkUrl: str):
    w3 = Web3(Web3.HTTPProvider(networkUrl))
    resp = w3.provider.make_request('qn_getWalletTokenBalance', [{ "wallet": walletAddress}])
    print(resp)

    
def _getWalletTokenTransactions(walletAddress: str, tokenAddress: str, networkUrl: str):
    w3 = Web3(Web3.HTTPProvider(networkUrl))
    resp = w3.provider.make_request(
        'qn_getWalletTokenTransactions',
        [{"address": walletAddress,
        "contract": tokenAddress,
        "page":1,
        "perPage":10}]
        )
    print(resp)

def _getTransactionsByAddress(contractAddress: str, networkUrl: str):
    w3 = Web3(HTTPProvider(networkUrl))
    resp = w3.provider.make_request('qn_getTransactionsByAddress', [{
        "address": contractAddress,
        "page": 1,
        "perPage": 10
        }])

    print(resp)


    


if __name__ == "__main__":

    walletAddress1 = config("WALLET1_ADDRESS")
    print(walletAddress1)
    walletAddress1PrivateKey = config("ETH_SENDER_KEY")
    walletAddress2 = config("WALLET2_ADDRESS")
    
    # # Test 1 transfer 0.001 from add1 to add2
    send_ether_token(.001, 
                walletAddress1, 
                walletAddress1PrivateKey,
                walletAddress2)
    
    # Test 2 Swap ETH to ApeCoin
    # This only work on the mainnet 
    # During Demo, go to https://etherscan.io/ and quickly show the
    # transaction is processing 
    # Remember to increment the Nonce

    sender_wallet = "0xcc9309b734C523226210bFac36b3A6fe5Bec66ad"
    transfer_eth_to_apecoin(sender_wallet)



