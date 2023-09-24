import { createWeb3Modal, defaultWagmiConfig } from '@web3modal/wagmi/react'



import './App.css';
import { MessageList } from "./MessageList";
import { Input } from "./Input";
import { useEffect, useState } from 'react';
import { Sidebar } from "./Sidebar.js"
import { UnlimitComponent } from './UnlimitComponent';
import { usePrivy, useLogin, useCreateWallet, useWallets } from '@privy-io/react-auth';
import { useAccount, useBalance } from 'wagmi'
import { Typing } from './icons/Typing';
import { useSearchParams } from 'react-router-dom';
import { processIntent } from './utils/processIntent';

function App() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [initalStateAdded, setInitalStateAdded] = useState(false);
  const [typing, setTyping] = useState();
  const [activeWallet, setActiveWallet] = useState({
    address: undefined
  });
  const [messages, setMessages] = useState([])
  
  const { ready, authenticated, logout } = usePrivy();
  const { wallets: privyWallets } = useWallets();

  const activeWalletExtendedMetadata = privyWallets.find((wallet) => wallet.address === activeWallet.address)
  const account = useAccount();

  useEffect(() => {
    if(initalStateAdded){
      return
    }
    if(searchParams.get("onramp") === "true"){
      addMessage({
        id: Math.random(),
        content: <p>Great! looks like it was successful</p>,
        isUser: false
      })
    } else {
      addMessage({
        id: 1,
        content: <p>Hi! What can I help you with today?</p>,
        isUser: false
      })
    }
    setInitalStateAdded(true)
  }, [searchParams])


  const { createWallet } = useCreateWallet({
    onSuccess: (wallet) => {
        setActiveWallet({
          address: wallet?.address
        })
        // Any logic you'd like to execute after a user successfully creates their wallet
        addMessage({
          id: Math.random(),
          content: <p>Great! Your wallet has been created and linked to your email, you can view details about it on the left.</p>,
          isUser: false
        })
    },
    onError: (error) => {
        console.log(error);
        // Any logic you'd like to execute after a user exits the creation flow or there is an error
    }
  })


  const { login } = useLogin({
    onComplete: async (user, isNewUser) => {
        if (ready && isNewUser && authenticated && !privyWalletExists() && !account?.address){
          await createWallet();
        } else if(ready) {
          const res = {
            id: Math.random(),
            content: <p>Turns out you have a wallet associated with this email! We just logged you in. You can export this wallet as well to use in other places!</p>,
            isUser: false
          }
          addMessage(res)
        }
        // Any logic you'd like to execute if the user is/becomes authenticated while this
        // component is mounted
    },
    onError: (error) => {
        console.log(error);
        // Any logic you'd like to execute after a user exits the login flow or there is an error
    }
  }, [authenticated, messages])

  const updatesMessages = async () => {
    const latestMessage = messages[messages.length - 1];
    if (latestMessage?.isUser){
      const [response, action] = await processText(latestMessage.text)
      addMessage(response, action)
    }
  }
  

  useEffect(() => {
    updatesMessages()
  }, [messages])

  useEffect(() => {
    const latestMessage = messages[messages.length - 1];
    if (!latestMessage?.isLoading && typing){
      const loadingMessage = {
        id: Math.random(),
        content: <Typing />,
        isUser: false,
        isLoading: true
      }
      setMessages([...messages, loadingMessage])
    }
    else if(latestMessage?.isLoading && !typing){
      messages.pop();
      setMessages([...messages])
    }
  }, [messages, typing])

  const addMessage = (newMessage, callback) => {
    if (!newMessage){
      return
    }
    if (newMessage?.isUser){
      const newMessages = [...messages, newMessage]
      setMessages(newMessages)
    }
    else {
      setTyping(true)
      setTimeout(() => {
        setTyping(false)
        const newMessages = [...messages, newMessage]
        setMessages(newMessages)
        setTimeout(() => {
          callback && callback()
        }, 1000)
      }, newMessage.timeout ? newMessage.timeout : 1000)
    }
  }

  const queueAddMessage = (expectedMessageState, newMessage, callback) => {
    setTyping(true)
    setTimeout(() => {
      setTyping(false)
      const newMessages = [...expectedMessageState, newMessage]
      setMessages(newMessages)
      setTimeout(() => {
        callback && callback()
      }, 1000)
    }, 1000)
  }

  const processText = async (text) => {
    let response;
    let action; 
    setTyping(true)
    const intent = await processIntent(text);
  
    if(intent === "create_wallet"){
      response = {
        id: Math.random(),
        content: <p>Sure let's create a wallet for you.</p>,
        isUser: false
      }
      setTimeout(() => {
        login()
      }, 2500)
    }
    else if (intent === "buy"){
      response = {
        id: Math.random(),
        content: <p>Sure can help you with that!</p>,
        isUser: false
      }

      action = () => {
        const lastUserMessage = messages.findLast(message => message.isUser)
        queueAddMessage([...messages, response], {
          id: Math.random(),
          content: <UnlimitComponent
            initialAmount={lastUserMessage?.text?.match(/\d+(\.\d+)?/g) ? lastUserMessage?.text?.match(/\d+(\.\d+)?/g)[0] : 50}
            walletAddress={activeWallet.address}
            />,
          isUser: false
        })
      }
    }
    else {
      response = {
        id: Math.random(),
        content: <p>"I'm sorry I dont understand"</p>,
        isUser: false
      }
    }
    

    setTyping(false)
    return [response, action]
  }

  const privyWalletExists = () => {
    return privyWallets[0]?.walletClientType == "privy"
  }

  return (
    <div className="App">
      <Sidebar activeWallet={activeWallet} setActiveWallet={setActiveWallet} wallets={privyWallets}/>
      <div className="messages-box">
        <MessageList messages={messages}/>
        <Input addMessage={addMessage}/>
      </div>
    </div>
  );
}

export default App;
