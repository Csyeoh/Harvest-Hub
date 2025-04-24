import React, { useState, useEffect, useRef } from 'react';
import './ChatAssistant.css';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';

const ChatAssistant = () => {
  const MAX_INPUT_LENGTH = 500;
  const [messages, setMessages] = useState([
    {
      sender: 'assistant',
      text: 'Hello! I’m AgriBot, your agriculture expert. How can I assist you with farming, crops, or soil management today?',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
  const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent';

  // Agriculture-specific keywords for filtering
  const agricultureKeywords = ['crop', 'soil', 'pest', 'irrigation', 'farming', 'harvest', 'fertilizer', 'plant', 'agriculture', 'farm', 'weather'];

  // Check if the query is agriculture-related
  const isAgricultureRelated = (query) => {
    return agricultureKeywords.some(keyword => query.toLowerCase().includes(keyword));
  };

  // Load messages from localStorage on mount
  useEffect(() => {
    const savedMessages = localStorage.getItem('chatMessages');
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    }
  }, []);

  // Auto-scroll to the bottom when new messages are added
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [input]);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('chatMessages', JSON.stringify(messages));
  }, [messages]);

  // Handle sending a message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || input.length > MAX_INPUT_LENGTH) {
      if (input.length > MAX_INPUT_LENGTH) {
        alert(`Message must be less than ${MAX_INPUT_LENGTH} characters.`);
      }
      return;
    }

    // Check if the input is agriculture-related
    if (!isAgricultureRelated(input)) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: 'user', text: input, timestamp: new Date() },
        { sender: 'assistant', text: "I'm specialized in agriculture. Please ask about farming, crops, or related topics!", timestamp: new Date() },
      ]);
      setInput('');
      return;
    }

    // Add user's message with timestamp
    const userMessage = { sender: 'user', text: input, timestamp: new Date() };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const conversationHistory = [
        {
          role: 'user',
          parts: [{ text: 'You are AgriBot, an expert agriculture assistant. Provide accurate, concise, and practical advice on agriculture topics such as crop management, soil health, pest control, irrigation, and weather impacts. Only respond to agriculture-related queries. For unrelated questions, respond with: "I\'m specialized in agriculture. Please ask about farming, crops, or related topics!"' }],
        },
        ...messages.map((msg) => ({
          role: msg.sender === 'user' ? 'user' : 'model',
          parts: [{ text: msg.text }],
        })),
        {
          role: 'user',
          parts: [{ text: input }],
        },
      ];

      const response = await axios.post(
        `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
        {
          contents: conversationHistory,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const assistantResponse = response.data.candidates[0].content.parts[0].text;
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: 'assistant', text: assistantResponse, timestamp: new Date() },
      ]);
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: 'assistant', text: 'Sorry, I encountered an error. Please try again.', timestamp: new Date() },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-assistant-container">
      <h1>AgriBot - Agriculture Assistant</h1>
      <div className="chat-box">
        <div className="messages">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`message ${
                message.sender === 'user' ? 'user-message' : 'assistant-message'
              }`}
            >
              <div className="message-content">
                <ReactMarkdown>{message.text}</ReactMarkdown>
              </div>
            </div>
          ))}
          {loading && (
            <div className="message assistant-message">
              <div className="message-content">Typing...</div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        <form className="chat-input-form" onSubmit={handleSendMessage}>
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about crops, soil, pests, irrigation..."
            className="chat-input"
            rows="1"
            disabled={loading}
          />
          <button type="submit" className="send-button" disabled={loading}>
            <i className="bi bi-send-fill"></i>
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatAssistant;