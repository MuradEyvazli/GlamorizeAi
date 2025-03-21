import React, { useState, useRef, useEffect } from 'react';
import { FaRobot, FaUser, FaPaperPlane, FaTimes, FaMinus, FaComments } from 'react-icons/fa';
import { BiSend } from 'react-icons/bi';
import { BsSnow } from 'react-icons/bs';

const ModernChatBot = () => {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Merhaba! Ben Glamorize AI. Size nasıl yardımcı olabilirim?' }
  ]);
  const [input, setInput] = useState('');
  const [isOpen, setIsOpen] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && !isMinimized) {
      inputRef.current?.focus();
    }
  }, [isOpen, isMinimized]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    
    const userMessage = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);
    
    try {
      // Simulate network delay for demo purposes
      setTimeout(async () => {
        try {
          const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: input }),
          });
          
          const data = await response.json();
          
          if (response.ok) {
            const aiMessage = { role: 'assistant', content: data.reply };
            setMessages((prev) => [...prev, aiMessage]);
          } else {
            setMessages((prev) => [...prev, { 
              role: 'assistant', 
              content: 'Üzgünüm, bir hata oluştu. Lütfen tekrar deneyin.' 
            }]);
            console.error(data.message);
          }
        } catch (error) {
          setMessages((prev) => [...prev, { 
            role: 'assistant', 
            content: 'Bağlantı hatası. Lütfen internet bağlantınızı kontrol edin.' 
          }]);
          console.error('Error sending message:', error);
        } finally {
          setIsTyping(false);
        }
      }, 1000);
    } catch (error) {
      console.error('Error in send process:', error);
      setIsTyping(false);
    }
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Floating button when chat is closed
  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-5 right-5 bg-gradient-to-r from-blue-400 to-indigo-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-50 flex items-center justify-center"
      >
        <FaComments size={24} />
      </button>
    );
  }

  // Minimized state
  if (isMinimized) {
    return (
      <div
        className="fixed bottom-5 right-5 bg-gradient-to-r from-blue-400 to-indigo-600 text-white px-5 py-3 rounded-full shadow-lg flex items-center cursor-pointer z-50"
        onClick={toggleMinimize}
      >
        <BsSnow className="mr-2" />
        <span className="font-medium">Glamorize AI</span>
      </div>
    );
  }

  return (
    <div
      className="fixed bottom-5 right-5 w-80 sm:w-96 h-[500px] bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-blue-100"
      style={{ 
        zIndex: 1000,
        backdropFilter: 'blur(10px)',
        boxShadow: '0 10px 25px -5px rgba(59, 130, 246, 0.5), 0 8px 10px -6px rgba(59, 130, 246, 0.3)'
      }}
    >
      {/* Chat Header with Glassmorphism effect */}
      <div 
        className="flex justify-between items-center p-4 border-b border-blue-100"
        style={{
          background: 'linear-gradient(135deg, rgba(219, 234, 254, 0.8), rgba(191, 219, 254, 0.6))',
          backdropFilter: 'blur(8px)'
        }}
      >
        <div className="flex items-center">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-2 rounded-lg mr-3">
            <BsSnow className="text-white" size={18} />
          </div>
          <div>
            <h1 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-800 text-transparent bg-clip-text">
              Glamorize AI
            </h1>
            <p className="text-xs text-blue-500">Modern Assistant</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={toggleMinimize}
            className="text-blue-400 hover:text-blue-600 transition-colors"
            aria-label="Minimize"
          >
            <FaMinus size={16} />
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="text-blue-400 hover:text-blue-600 transition-colors"
            aria-label="Close"
          >
            <FaTimes size={16} />
          </button>
        </div>
      </div>

      {/* Messages Area with Slight Texture */}
      <div 
        className="flex-grow overflow-y-auto p-4 space-y-3"
        style={{
          backgroundImage: 'radial-gradient(circle at 20px 20px, rgba(219, 234, 254, 0.4) 0, rgba(219, 234, 254, 0) 8px)',
          backgroundSize: '40px 40px'
        }}
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}
          >
            <div className="flex max-w-[80%]">
              {msg.role === 'assistant' && (
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mr-2 flex-shrink-0 shadow-md">
                  <FaRobot className="text-white" size={14} />
                </div>
              )}
              
              <div
                className={`p-3 rounded-2xl ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-tr-none shadow-md'
                    : 'bg-white border border-blue-100 text-gray-700 rounded-tl-none shadow-sm'
                } transition-all duration-200`}
              >
                {msg.content}
              </div>
              
              {msg.role === 'user' && (
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center ml-2 flex-shrink-0 shadow-md">
                  <FaUser className="text-white" size={14} />
                </div>
              )}
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="flex max-w-[80%]">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mr-2 flex-shrink-0 shadow-md">
                <FaRobot className="text-white" size={14} />
              </div>
              
              <div className="p-3 rounded-2xl bg-white border border-blue-100 text-gray-700 rounded-tl-none shadow-sm">
                <div className="flex space-x-1">
                  <span className="animate-bounce delay-100 h-2 w-2 bg-blue-400 rounded-full"></span>
                  <span className="animate-bounce delay-200 h-2 w-2 bg-blue-500 rounded-full"></span>
                  <span className="animate-bounce delay-300 h-2 w-2 bg-blue-600 rounded-full"></span>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area with Frost Effect */}
      <div 
        className="p-3 border-t border-blue-100"
        style={{
          background: 'linear-gradient(to bottom, rgba(241, 245, 249, 0.8), rgba(219, 234, 254, 0.6))',
          backdropFilter: 'blur(5px)'
        }}
      >
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            className="flex-grow p-3 rounded-xl border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white/80 placeholder-blue-300 text-gray-700"
            placeholder="Glamorize AI'ya sorunuzu yazın..."
            style={{ transition: 'all 0.2s ease' }}
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className={`h-10 w-10 rounded-full flex items-center justify-center ${
              input.trim() && !isTyping
                ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md hover:shadow-lg transform hover:scale-105'
                : 'bg-gray-200 text-gray-400'
            } transition-all duration-200`}
            aria-label="Send message"
          >
            <BiSend size={20} />
          </button>
        </form>
      </div>
      
      {/* Subtle footer */}
      <div className="py-1 px-3 text-center text-xs text-blue-400 bg-gradient-to-r from-blue-50 to-indigo-50">
        Powered by Glamorize AI • Modern & Intelligent Assistant
      </div>
    </div>
  );
};

export default ModernChatBot;