import { useState } from "react";
import { api } from "../services/api";
import { Send, Sparkles, Loader } from "lucide-react";
import React from "react";

const AIChat = ({ videoId }) => {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!query.trim() || loading) return;

    const userMessage = query;
    setQuery("");
    setMessages((prev) => [...prev, { type: "user", text: userMessage }]);
    setLoading(true);

    try {
      const response = await api.ai.chat(videoId, userMessage);
      setMessages((prev) => [
        ...prev,
        { type: "ai", text: response.data.response },
      ]);
    } catch (error) {
      console.error("AI chat error:", error);
      setMessages((prev) => [
        ...prev,
        { type: "error", text: "Failed to get response. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card p-6">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="h-6 w-6 text-purple-600" />
        <h2 className="text-2xl font-bold">Ask AI About This Video</h2>
      </div>

      <div className="space-y-4 mb-4 max-h-96 overflow-y-auto">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            <p>Ask me anything about the comments on this video!</p>
            <p className="text-sm mt-2">
              Try: "What are viewers saying about...?" or "Show me controversial
              comments"
            </p>
          </div>
        )}
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${
              msg.type === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                msg.type === "user"
                  ? "bg-purple-600 text-white"
                  : msg.type === "error"
                  ? "bg-red-100 text-red-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 p-3 rounded-lg flex items-center gap-2">
              <Loader className="h-4 w-4 animate-spin" />
              Thinking...
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSend()}
          placeholder="Ask about comments, sentiment, trends..."
          className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
          disabled={loading}
        />
        <button
          onClick={handleSend}
          disabled={loading || !query.trim()}
          className="btn btn-primary flex items-center gap-2 disabled:opacity-50"
        >
          <Send className="h-4 w-4" />
          Send
        </button>
      </div>
    </div>
  );
};

export default AIChat;
