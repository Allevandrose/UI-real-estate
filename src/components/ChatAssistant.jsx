// src/components/ChatAssistant.jsx
import { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import api from "../services/api";

export default function ChatAssistant() {
  // ALL hooks at the top, in consistent order
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const { isAuthenticated } = useSelector((state) => state.auth);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => scrollToBottom(), [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = { from: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await api.post("/chat", { message: input });
      setMessages((prev) => [
        ...prev,
        { from: "ai", text: res.data.reply, properties: res.data.properties },
      ]);
    } catch (err) {
      const msg =
        err.response?.data?.reply || "Failed to get response. Try again.";
      setMessages((prev) => [...prev, { from: "ai", text: msg }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleViewProperty = (id) => {
    window.open(`/property/${id}`, "_blank");
  };

  // ✅ FIXED: Early return is now AFTER all hooks are declared
  if (!isAuthenticated) return null;

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-full shadow-xl flex items-center justify-center hover:scale-105 transition-transform z-50"
          aria-label="Open AI assistant"
        >
          💬
        </button>
      )}

      {/* Chat Panel */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-full max-w-md h-[600px] bg-white rounded-xl shadow-2xl flex flex-col z-50 border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white p-4 flex justify-between items-center">
            <h3 className="font-bold">🏡 Home254 AI Assistant</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-blue-200"
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-4">
            {messages.length === 0 && (
              <div className="text-center text-gray-500 mt-8">
                <p className="mb-2">👋 Hello! Ask me about properties.</p>
                <p className="text-sm">
                  Examples:
                  <br />
                  • "3-bedroom apartments under 5M in Nairobi"
                  <br />
                  • "Furnished bungalows for rent in Mombasa"
                  <br />• "Land plots in Kiambu"
                </p>
              </div>
            )}

            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${
                  msg.from === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-xl ${
                    msg.from === "user"
                      ? "bg-blue-600 text-white rounded-tr-none"
                      : "bg-white text-gray-800 border border-gray-200 rounded-tl-none"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                  {msg.properties?.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {msg.properties.map((prop) => (
                        <div
                          key={prop._id}
                          onClick={() => handleViewProperty(prop._id)}
                          className="p-2 bg-gray-100 hover:bg-gray-200 rounded cursor-pointer text-sm"
                        >
                          <p className="font-medium">{prop.title}</p>
                          <p className="text-gray-600">
                            {prop.location?.town}, {prop.location?.county} • KES{" "}
                            {prop.price?.toLocaleString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white text-gray-800 border border-gray-200 rounded-xl rounded-tl-none p-3">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t border-gray-200 bg-white">
            <div className="flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Ask about properties..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isLoading}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="bg-blue-600 text-white px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
