async function send_token(token, amount, toENS) {
    const provider = getDefaultProvider(process.env.GOERLI_URL)
    const toAddress = await provider.resolveName(toENS);
    // const tokenAddress = token === "ETH" ? "0x71C7656EC7ab88b098defB751B7401B5f6d8976F" : "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
    // const contract = new ethers.Contract(tokenAddress, contractABI, provider);
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
    // const amountToSend = ethers.utils.parseUnits("1.0", 18);
    const amountToSend = ethers.utils.parseEther('1.0');

    try {
        const transactionResponse = await wallet.sendTransaction({
            to: toAddress,
            value: amountToSend,
        });
        console.log(`Transaction sent! Transaction hash: ${transactionResponse.hash}`);
    } catch (error) {
        console.error('Error:', error);
    }
}

module.exports = send_token;