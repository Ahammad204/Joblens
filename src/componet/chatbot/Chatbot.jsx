import { useState } from "react";
import axiosPublic from "../../utils/axiosPublic";

export default function Chatbot() {
  const [messages, setMessages] = useState([
    { role: "bot", text: "Hey! How can I help you today?" }
  ]);

  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setTyping(true);

    try {
      const res = await axiosPublic.post("/api/chat", { message: input });
      const botMessage = { role: "bot", text: res.data.reply };

      setTimeout(() => {
        setMessages((prev) => [...prev, botMessage]);
        setTyping(false);
      }, 600);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "Something went wrong. Try again." },
        console.log(err)
      ]);
      setTyping(false);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto shadow-xl rounded-2xl border p-4 bg-white/80 backdrop-blur">
      <h2 className="text-xl font-semibold mb-3 text-center">Career Assistant</h2>

      <div className="h-80 overflow-y-auto p-2 border rounded-lg bg-gray-50">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`max-w-[80%] p-3 my-2 rounded-2xl text-sm animate-fadeIn ${
              msg.role === "user"
                ? "ml-auto bg-blue-600 text-white rounded-br-none"
                : "bg-gray-200 text-gray-900 rounded-bl-none"
            }`}
          >
            {msg.text}
          </div>
        ))}

        {typing && (
          <div className="w-16 p-2 bg-gray-200 rounded-xl text-xs animate-pulse">
            Typing...
          </div>
        )}
      </div>

      <div className="flex gap-2 mt-3 bg-white/90 backdrop-blur border rounded-xl p-2">
        <input
          className="flex-1 p-2 outline-none"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your question..."
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition"
        >
          Send
        </button>
      </div>
    </div>
  );
}
