import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import {PrivyProvider, SUPPORTED_CHAINS} from '@privy-io/react-auth';
import { WagmiConfig } from 'wagmi'
import { arbitrum, mainnet } from 'wagmi/chains'
import { createWeb3Modal, defaultWagmiConfig } from '@web3modal/wagmi/react'


const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
]);
const root = ReactDOM.createRoot(document.getElementById('root'));

const handleLogin = (user) => {
  console.log(`User ${user.id} logged in!`)
}

// 1. Get projectId
const projectId = '969d1da0e876fe3aae0466b188afffa4'

// 2. Create wagmiConfig
const chains = [mainnet, arbitrum]
const wagmiConfig = defaultWagmiConfig({ chains, projectId, appName: 'Web3Modal' })

createWeb3Modal({ wagmiConfig, projectId, chains})

root.render(
  <React.StrictMode>
    <PrivyProvider
      appId={"clmvewkd2004kla0fgddnc6jj"}
      onSuccess={handleLogin}
      config={{
        loginMethods: ['email', 'google', 'twitter'],
        appearance: {
          theme: 'light',
          accentColor: '#676FFF',
        },
      }}
    >
      <WagmiConfig config={wagmiConfig}>
        <RouterProvider router={router} />
      </WagmiConfig>
    </PrivyProvider>

  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
