# :jigsaw: Solvify

Born at the [ETHGlobal New York 2023 Hackathon](https://ethglobal.com/showcase/solvify-jq62y), Solvify is web3 solver implementation built using LLMs for an intent-centric future on Etheruem - all with a delightful web2-like UX and powerful AI agents from LangChain to optimally satisfy intents and retain value for users.

## Introduction: What are intents?
An intent represents a desired outcome - often with a given set of constraints to operate within and inputs to use to do so. Transactions are the precise steps needed to be executed to satisfy a given intent. Our project is a solver implementation that takes an intent, alongside its constraints & inputs, and converts it into a series of transactions to be executed on behalf of the user.

## Problems Solvify aims to solve:
Today, the cost of satisfying an intent (e.g. “I have ETH and want 100 USDC on Polygon”) is borne by the user. The user is responsible for deciding on, constructing, paying for, and executing on the path required to achieve the outcome (i.e. a series of transactions). Furthermore, building a path manually requires specialized web3 knowledge and often exposes the user to asymmetrical value extraction (e.g. negative MEV externalities) by third parties.

## Our Solution: Solvify
To address the problems mentioned above, we built a solver implemented using LLMs to lower both the cost and complexities required for satisfying intents while optimizing for gas along the way. Specifically, user intents get outsourced to our solver where we perform the heavy lifting of translating human intents into precise on-chain transactions that are then automatically executed - providing the “how” to deliver a desired outcome expressed by a user.

Our implementation prioritizes 2 specific value propositions:
* A delightful web2-like experience by leveraging recent advancements in Account Abstraction (AA) infrastructure to enable a delightful UX for our solver with sponsored transactions, social login methods, and seamless on-demand wallet generation.
* Support for intents involving multi-chain transactions using Axelar. For this hackathon, we demonstrate a USDC transfer between Ethereum and Arbitrum using only natural language intents.

#### Example Workflow:
1. Upon arriving on our web application, the user can choose to connect their existing wallet using WalletConnect’s Web3Modal V3 or generate a brand new wallet with social login methods using Privy’s embedded wallet infrastructure.
1. A user enters their intent:
    * “Buy $100 USD worth of ApeCoins on Ethereum Mainnet”
    b. “Swap all my ETH for $UNI on Ethereum Mainnet”
    c. “Send vitalik.eth $1 USDC on Ethereum Mainnet”
    d. "Convert my Ethereum USDC to Arbitrum USDC"
1. When a fiat conversion into ETH or BTC is required, UNLIMIT’s on-ramp widget will appear for a user to buy ETH using their credit card
1. The AI Agent will then parse the intent and propose transactions to the user to approve and execute.


## Looking forward and roadmap:
We believe the future of Ethereum will be increasingly intent-centric. Our work today represents a proof-of-concept for whats possible in the next generation of intent-based architectures. Our team acknowledges that there are many unaddressed risks to tackle and many optimizations to be made.

We theorize that a solver marketplace will arise soon, with models and novel designs competing against one another to satisfy intents - similar to how solutions have emerged to mitigate the negative impacts of MEV (e.g. Flashbots). We further hypothesize that a world where solvers compete to satisfy user intents in the most cost efficient way will be a far more equitable landscape than the status quo. This is because the economic incentives of 3rd party solvers will align with users, as opposed to how today’s MEV searchers and block builders are competing to maximally extract value from users.

Finally, we hope that our project inspires others who are working in this space to build towards a more intent-centric future for Ethereum.

## Inspirations:
* [Introducing Essential: We Are Intents](https://blog.essential.builders/introducing-essential/)
* [Intent-Based Architectures and their Risks by Quintus & Georgios from Paradigm](https://www.paradigm.xyz/2023/06/intents)
