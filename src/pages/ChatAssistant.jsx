import React, { useState, useEffect, useRef } from 'react';
import './ChatAssistant.css';

const ChatAssistant = () => {
  const [messages, setMessages] = useState([
    { sender: 'assistant', text: 'Hello! How can I assist you today with your farming needs?' },
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null); // For auto-scrolling to the latest message

  // Auto-scroll to the bottom when new messages are added
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle sending a message
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!input.trim()) return; // Ignore empty messages

    // Add user's message to the conversation
    const userMessage = { sender: 'user', text: input };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput(''); // Clear the input field

    // Simulate an assistant response (replace with actual API call if needed)
    setTimeout(() => {
      const assistantResponse = {
        sender: 'assistant',
        text: `I received your message: "${userMessage.text}". How can I help you further?`,
      };
      setMessages((prevMessages) => [...prevMessages, assistantResponse]);
    }, 1000); // Simulate a 1-second delay for the response
  };

  return (
    <div className="chat-assistant-container">
      <h1>Chat Assistant</h1>
      <div className="chat-box">
        <div className="messages">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`message ${
                message.sender === 'user' ? 'user-message' : 'assistant-message'
              }`}
            >
              <div className="message-content">{message.text}</div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <form className="chat-input-form" onSubmit={handleSendMessage}>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message here..."
            className="chat-input"
            rows="1"
          />
          <button type="submit" className="send-button">
            <i className="bi bi-send-fill"></i>
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatAssistant;