import { useEffect, useState } from 'react';
import { useAccount, useBalance } from 'wagmi'
import { SUPPORTED_CHAINS, usePrivy } from '@privy-io/react-auth';
import { Wallet } from './icons/Wallet';
import { useWeb3Modal } from '@web3modal/wagmi/react'
import walletConnectImg from "./imgs/wallet-connect-logo.png"




export const Sidebar = ({ activeWallet, setActiveWallet, wallets }) => {
  const [openPrivyDetails, setOpenPrivyDetails] = useState(false)
  const { open, close } = useWeb3Modal();
  const walletConnectAccount = useAccount();
  const { user, logout, exportWallet } = usePrivy();

  const walletToggle = (wallet) => {
    if (activeWallet.address === wallet.address){
      setActiveWallet({ })
    } else {
      setActiveWallet({ address: wallet.address})
    }
  }

  return (
    <div className="sidebar-container">
      <h1>
        Solver
      </h1>
      <div className='wallets-container'>
        <h3 style={{margin: "2px 0px", textAlign: 'left', display: "flex"}}>
          <Wallet fill={"#D1D5DA"} className={"wallet-styling"}/> Wallets
        </h3>
        <p style={{marginTop: "6px", textAlign: 'left'}}>
          Connect and link wallets to your account.
        </p>
        {
          wallets?.map((wallet) => {
            const isPrivy = wallet?.walletClientType === "privy"
            if(wallets.length === 1 && !isPrivy){
              return null
            }
            if(wallets.length === 2 && !walletConnectAccount?.address && !isPrivy){
              return null 
            }
            const moreDetailsHandler = isPrivy ? () => exportWallet() : () => open()
            return (
              <WalletListItem
                setActive={walletToggle}
                active={activeWallet.address == wallet?.address}
                text={wallet?.walletClientType}
                logout={isPrivy && logout}
                logo={
                  <img style={{
                    width: "24px",
                    borderRadius: "4px",
                    marginRight: "8px"
                  }} 
                  srcSet={isPrivy ? `https://demo.privy.io/_next/image?url=%2Flogos%2Fprivy-logomark.png&w=48&q=75` : walletConnectImg}/>
                }
                wallet={wallet}
                clickHandler={moreDetailsHandler}
                />
            )}
          )
        }
        <div className="connect-wallet-container">
          {wallets.length === 1 && !wallets[0]?.walletClientType === "privy" ? null : <w3m-button />}
        </div>
      </div>
    </div>
  )
}

const WalletListItem = ({ active, wallet, logo, logout, clickHandler, text, setActive }) => (
  <div>
    <div style={{
      display: "flex",
      justifyContent: "space-between",
      marginBottom: "8px"
      }}
    >
      <p className='tiny-text tiny-text-click' onClick={clickHandler}>
        {text}
      </p>
      <p className='tiny-text tiny-text-click' onClick={logout}>
        Disconnect
      </p>
    </div>

    <div className={`wallet-listitem ${active ? "wallet-listitem-active" : null}`}  onClick={() => {
      setActive(wallet)
    }}>
      {logo}
      <p className='address'>
        {wallet?.address}
      </p>
      {<p className="test-net" onClick={(e) => {
        e.stopPropagation()
      }}>
        <span style={{
          margin: 0,
          fontWeight:600,
          textDecoration: "none !important"
        }}>
          ChainID
        </span> {wallet.chainId} 
      </p>}
  </div>


  </div>
)