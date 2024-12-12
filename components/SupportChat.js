import React, { useState, useRef } from 'react';
import { FaRobot } from 'react-icons/fa';

const SupportChat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isOpen, setIsOpen] = useState(true); // Chat aç/kapa kontrolü
  const messagesEndRef = useRef(null); // Mesajları en alta kaydırmak için ref

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');

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
        console.error(data.message);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }

    // Yeni mesaj geldiğinde aşağı kaydır
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  if (!isOpen) return null; // Chat kapalıysa hiçbir şey göstermiyoruz

  return (
    <div
      className="fixed bottom-5 right-5 bg-white w-80 h-96 shadow-lg rounded-xl flex flex-col"
      style={{ zIndex: 1000 }}
    >
      {/* Chat Header */}
      <div className="flex justify-between items-center bg-gradient-to-r from-[#2a4d61] to-[#070938] animate-gradient text-white p-3 rounded-t-lg">
        <h1 className="text-lg font-bold">Glamorize Ai(Chat)</h1>
        <button
          onClick={() => setIsOpen(false)}
          className="text-white font-bold"
        >
          ✕
        </button>
      </div>

      {/* Mesajlar */}
      <div className="flex-grow bg-gray-50 overflow-y-auto p-3">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex items-center my-2 ${
              msg.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {msg.role === 'assistant' && (
              <FaRobot className="text-blue-500 mr-2 mt-1" size={20} />
            )}
            <div
              className={`max-w-xs p-3 rounded-lg text-white ${
                msg.role === 'user'
                  ? 'bg-gradient-to-r from-[#66c1f6] to-[#5a5ede] animate-gradient text-right'
                  : 'bg-gray-600 text-left'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input ve Gönder Butonu */}
      <div className="p-3 flex flex-row justify-center items-center border-t border-gray-300">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          className="flex-grow p-2 rounded-l-lg border border-blue-300 focus:outline-none focus:ring focus:ring-blue-300 placeholder-gray-500"
          placeholder="Ask to Glamorize AI..."
        />
        <button
          onClick={sendMessage}
          className="mb-2 bg-gradient-to-r from-[#2a4d61] to-[#070938] animate-gradient text-white px-4 py-2.5 rounded-xl ml-2 hover:bg-blue-700 focus:ring focus:ring-blue-300"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default SupportChat;
