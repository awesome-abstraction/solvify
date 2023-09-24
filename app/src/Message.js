import { useState, useEffect } from "react"

export const Message = ({ message }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true)
  }, [])

  return (
    <div className={`${message.isUser ? "right-float" : ""}`}>
      <div className={`message-bubble-container ${isMounted ? "message-bubble-enter": ""}`}>
          {message.content}
        </div>
    </div>

  )
}