import React, { useState, useRef, useEffect } from 'react';
import { chatbotAPI } from '../utils/api';
import './Chatbot.css';

const WELCOME = {
  id: 'welcome',
  role: 'bot',
  content: "Namaste! Welcome to GLIMMR 💎 I'm your personal jewellery assistant. Ask me anything about our collection, styling tips, or how to use the AR try-on!",
  timestamp: new Date()
};

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([WELCOME]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([
    'How do I use AR try-on?',
    'Show me bridal jewellery',
    'Gold vs Silver tips',
    'Ring sizing guide'
  ]);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 300);
      fetchSuggestions();
    }
  }, [open]);

  const fetchSuggestions = async () => {
    try {
      const res = await chatbotAPI.getSuggestions();
      setSuggestions(res.data.data);
    } catch { /* use defaults */ }
  };

  const sendMessage = async (text) => {
    const userMsg = text || input.trim();
    if (!userMsg) return;

    const userEntry = { id: Date.now(), role: 'user', content: userMsg, timestamp: new Date() };
    setMessages(prev => [...prev, userEntry]);
    setInput('');
    setLoading(true);

    try {
      const history = messages.slice(-10).map(m => ({ role: m.role === 'user' ? 'user' : 'assistant', content: m.content }));
      const res = await chatbotAPI.message(userMsg, history);
      const botEntry = {
        id: Date.now() + 1,
        role: 'bot',
        content: res.data.reply,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botEntry]);
    } catch {
      const errorEntry = {
        id: Date.now() + 1, role: 'bot',
        content: "I'm having trouble connecting right now. Please try again in a moment! 💎",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorEntry]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const clearChat = () => setMessages([WELCOME]);

  return (
    <>
      {/* Toggle Button */}
      <button
        className={`chatbot-toggle ${open ? 'open' : ''}`}
        onClick={() => setOpen(!open)}
        title="Jewellery Assistant"
      >
        {open ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        ) : (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
        )}
        {!open && messages.length > 1 && <span className="chatbot-badge">{messages.filter(m=>m.role==='bot').length}</span>}
      </button>

      {/* Chat Window */}
      <div className={`chatbot-window ${open ? 'visible' : ''}`}>
        {/* Header */}
        <div className="chatbot-header">
          <div className="chatbot-avatar">✦</div>
          <div className="chatbot-info">
            <span className="chatbot-name">Jewellery Assistant</span>
            <span className="chatbot-status"><span className="online-dot"></span> Online</span>
          </div>
          <div className="chatbot-header-actions">
            <button onClick={clearChat} title="Clear chat" className="header-btn">↺</button>
            <button onClick={() => setOpen(false)} title="Close" className="header-btn">✕</button>
          </div>
        </div>

        {/* Messages */}
        <div className="chatbot-messages">
          {messages.map(msg => (
            <div key={msg.id} className={`message message-${msg.role}`}>
              {msg.role === 'bot' && <span className="message-avatar">✦</span>}
              <div className="message-bubble">
                <p>{msg.content}</p>
                <span className="message-time">
                  {msg.timestamp.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))}

          {loading && (
            <div className="message message-bot">
              <span className="message-avatar">✦</span>
              <div className="message-bubble typing">
                <span></span><span></span><span></span>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Quick Suggestions */}
        {messages.length <= 2 && (
          <div className="chatbot-suggestions">
            {suggestions.slice(0, 3).map((s, i) => (
              <button key={i} className="suggestion-chip" onClick={() => sendMessage(s)}>
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="chatbot-input-area">
          <input
            ref={inputRef}
            type="text"
            className="chatbot-input"
            placeholder="Ask about jewellery, styling..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
          />
          <button
            className="chatbot-send"
            onClick={() => sendMessage()}
            disabled={!input.trim() || loading}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z"/>
            </svg>
          </button>
        </div>
        <div className="chatbot-footer">Powered by AI • Responses may vary</div>
      </div>
    </>
  );
}
