import React, { useState, useRef, useEffect } from "react";
import axiosPublic from "../../utils/axiosPublic";

// SVG Icons
const CommentsIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.477 2 2 6.477 2 12c0 1.96.55 3.89 1.58 5.56l-.07.15c-.23.5-.34.75-.48 1.11-.14.36-.26.68-.37 1.05-.12.38.07.65.3.65.34 0 .86-.27 1.56-.63 1.06-.55 1.74-.9 2.53-1.28.31-.15.65-.29 1.03-.42C9.8 20.91 10.96 21 12 21c5.523 0 10-4.477 10-10C22 6.477 17.523 2 12 2zm1 14h-2v-2h2v2zm0-4h-2V7h2v5z" />
  </svg>
);

const TimesIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 10.586l4.95-4.95a1 1 0 111.414 1.414L13.414 12l4.95 4.95a1 1 0 01-1.414 1.414L12 13.414l-4.95 4.95a1 1 0 01-1.414-1.414L10.586 12 5.636 7.05a1 1 0 011.414-1.414L12 10.586z" />
  </svg>
);

const FloatingChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const chatEndRef = useRef(null);

  const toggleChat = () => setIsOpen(!isOpen);

  const scrollToBottom = () => chatEndRef.current?.scrollIntoView({ behavior: "smooth" });

  useEffect(() => { scrollToBottom(); }, [messages, isOpen]);

  const handleSend = async (e) => {
    e?.preventDefault();
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setTyping(true);

    try {
      const response = await axiosPublic.post("/api/chat", { message: userMessage.text });
      const botMessage = { sender: "bot", text: response.data.reply };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error("Chat API Error:", err);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Something went wrong. Please try again." }
      ]);
    } finally {
      setTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <div className="w-96 h-[520px] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-gray-200 animate-fadeIn">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white flex justify-between items-center p-4 shadow-md">
            <span className="font-semibold text-lg">Career Chat</span>
            <button onClick={toggleChat} className="p-1 hover:bg-blue-700 rounded-full transition">
              <TimesIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50">
          {/* Messages */}
<div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50">
  {messages.map((msg, idx) => (
    <div
      key={idx}
      className={`max-w-[75%] p-3 rounded-xl shadow-sm text-sm transition duration-300 ${
        msg.sender === "user"
          ? "ml-auto bg-blue-600 text-white rounded-br-none"
          : "bg-white border border-gray-200 rounded-bl-none text-gray-800"
      }`}
    >
      {msg.text.split("\n").map((line, i) => {
        // Convert **bold** text to <strong>
        const parts = line.split(/(\*\*.*?\*\*)/g);
        return (
          <p key={i} className="break-words">
            {parts.map((part, j) => 
              /^\*\*(.*)\*\*$/.test(part) ? (
                <strong key={j}>{part.replace(/\*\*/g, "")}</strong>
              ) : (
                part
              )
            )}
          </p>
        );
      })}
    </div>
  ))}

  {typing && (
    <div className="w-20 p-2 bg-gray-200 rounded-xl text-xs font-medium animate-pulse">
      Typing...
    </div>
  )}
  <div ref={chatEndRef} />
</div>


            {typing && (
              <div className="w-20 p-2 bg-gray-200 rounded-xl text-xs font-medium animate-pulse">
                Typing...
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSend} className="flex border-t border-gray-200">
            <input
              type="text"
              className="flex-1 px-4 py-3 outline-none rounded-l-2xl border-r border-gray-200 focus:ring-1 focus:ring-blue-400"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-3 rounded-r-2xl hover:bg-blue-700 transition font-medium"
            >
              Send
            </button>
          </form>
        </div>
      ) : (
        <button
          onClick={toggleChat}
          className="bg-blue-600 text-white p-5 rounded-full shadow-xl hover:bg-blue-700 transition transform hover:scale-110"
        >
          <CommentsIcon className="w-6 h-6" />
        </button>
      )}
    </div>
  );
};

export default FloatingChat;
