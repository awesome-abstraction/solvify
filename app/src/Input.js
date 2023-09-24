import { useCallback, useState } from "react"
import { SendIcon } from "./icons/Send"

export const Input = ({ addMessage }) => {
  const [userInput, setUserInput] = useState("")

  const eventHandler = useCallback((e) => {
    setUserInput(e.target.value)
  }, [])

  const submitHandler = (e) => {
    if(e.keyCode === 13) {
      setUserInput("")
      addMessage({
        id: Math.random(),
        content: <p>{userInput}</p>,
        text: userInput,
        isUser: true
      })
    }
  }

  return (
    <div className="input-container">
      <input 
        placeholder="Try any financial transactions!"
        onChange={eventHandler}
        value={userInput}
        className="user-input"
        onKeyDown={submitHandler}>
      </input>
      <SendIcon fill={"#D1D5DA"} className={"send-icon"}/>
    </div>
  )
}