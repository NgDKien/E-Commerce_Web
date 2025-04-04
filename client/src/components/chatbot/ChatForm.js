import React, { useRef } from 'react'

const ChatForm = ({ chatHistory, setChatHistory, generateBotResponse }) => {
    const inputRef = useRef();

    const handleFormSubmit = (e) => {
        e.preventDefault();

        //getting input value , remove whitespaces
        const userMessage = inputRef.current.value.trim();
        if (!userMessage) return;
        inputRef.current.value = "";

        //Update chat history with the user's message
        setChatHistory((history) => [...history, { role: "user", text: userMessage }]);

        setTimeout(() => {
            //Add "Thinking..." placeholder for the Bot's response
            setChatHistory((history) => [...history, { role: "model", text: "Thinking..." }]);

            //Call the function to generate bot's response
            //Adding prefix so that bot responds based on the provided data
            generateBotResponse([...chatHistory, { role: "user", text: `Using the details provided above, please address this query: ${userMessage}` }]);
        }, 600);
    }

    return (
        <form action="#" className='chat-form' onSubmit={handleFormSubmit}>
            <input ref={inputRef} type='text' placeholder='Message ...' className='message-input' required />
            <button className='material-symbols-rounded'>keyboard_arrow_up</button>
        </form>
    )
}

export default ChatForm
