import { useEffect } from "react"
import { Message } from "./Message"

export const MessageList = ({ messages, typing }) => {
  return (
    <div className="messages-container">
      {messages.map(message => 
        <Message message={message} key={message.id}/>
      )}
    </div>
  )
}