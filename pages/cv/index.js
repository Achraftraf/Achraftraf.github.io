import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { RiSendPlaneFill } from "react-icons/ri";
import { motion } from "framer-motion";
import { fadeIn } from "../../variants";

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
    <div className="h-full bg-primary/30 py-36 flex items-center">
      <div className="container mx-auto">
        <div className="flex flex-col xl:flex-row gap-x-8">
          {/* Left Section */}
          <motion.div
            variants={fadeIn("up", 0.2)}
            initial="hidden"
            animate="show"
            exit="hidden"
            className="text-center flex xl:w-[30vm] flex-col lg:text-left mb-4 xl:mb-0"
          >
            <h2 className="h2 xl:mt-8">
              AI Chat<span className="text-accent">.</span>
            </h2>
            <p className="mb-4 max-w-[400px] mx-auto lg:mx-0">
              Your intelligent assistant. Ask anything!
            </p>
          </motion.div>

          {/* Chat Section */}
          <motion.div
            variants={fadeIn("down", 0.6)}
            initial="hidden"
            animate="show"
            exit="hidden"
            className="w-full xl:max-w-[65%] bg-white shadow-md rounded-lg p-6 flex flex-col h-[80vh]"
          >
            {/* Chat Messages */}
            <div className="flex-grow overflow-y-auto p-4 space-y-4">
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

            {/* Input Area */}
            <form
              onSubmit={handleSubmit}
              className="flex items-center gap-2 border-t border-gray-700 pt-4"
            >
              <input
                type="text"
                placeholder="Type your message..."
                className="flex-grow p-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring focus:ring-blue-500"
                value={text}
                onChange={(e) => setText(e.target.value)}
                required
                aria-label="Message Input"
              />
              <button
                type="submit"
                className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-500"
                aria-label="Send Message"
              >
                <RiSendPlaneFill size={20} />
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
