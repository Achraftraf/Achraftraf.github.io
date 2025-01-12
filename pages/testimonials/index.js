import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { RiSendPlaneFill } from "react-icons/ri";

const ChatPage = () => {
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);
  const [sessionId] = useState(uuidv4());

  const handleAIResponse = async (message) => {
    try {
      const response = await fetch("/api/ai-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: sessionId,
          message,
        }),
      });

      if (!response.ok) throw new Error("Failed to fetch AI response.");

      const { message: aiMessage } = await response.json();
      setMessages((prev) => [
        ...prev,
        { text: message, type: "user" },
        { text: aiMessage, type: "bot" },
      ]);
      setText("");
    } catch (error) {
      console.error("Error fetching AI response:", error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim()) {
      handleAIResponse(text);
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">AI Chat Assistant</h1>
      <div className="bg-white shadow-md rounded-lg p-4">
        <div className="h-96 overflow-y-auto flex flex-col gap-4 mb-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`max-w-[75%] p-3 rounded-lg ${
                msg.type === "user"
                  ? "bg-blue-500 text-white self-end"
                  : "bg-gray-200 text-gray-800 self-start"
              }`}
            >
              {msg.text}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="gap-1">
          <input
            type="text"
            placeholder="Type your message..."
            className="flex-grow p-1 border border-gray-300 rounded-lg"
            value={text}
            onChange={(e) => setText(e.target.value)}
            required
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            <RiSendPlaneFill />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatPage;
