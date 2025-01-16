import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { IoIosSend } from "react-icons/io";
import { motion } from "framer-motion";

const ChatPage = () => {
  const [activeTab, setActiveTab] = useState("chat1");
  const [tabs, setTabs] = useState([
    { id: "chat1", name: "Chat 1", messages: [] },
  ]);
  const [text, setText] = useState("");
  const [sessionId] = useState(uuidv4());
  const [loading, setLoading] = useState(false);

  const handleTabChange = (tabId) => setActiveTab(tabId);

  const handleNewTab = () => {
    const newTabId = `chat${tabs.length + 1}`;
    setTabs([
      ...tabs,
      { id: newTabId, name: `Chat ${tabs.length + 1}`, messages: [] },
    ]);
    setActiveTab(newTabId);
  };

  const handleAIResponse = async (message, tabId) => {
    setLoading(true);

    try {
      // Add user's message to the chat
      setTabs((prevTabs) =>
        prevTabs.map((tab) =>
          tab.id === tabId
            ? {
                ...tab,
                messages: [...tab.messages, { text: message, type: "user" }],
              }
            : tab
        )
      );

      // Remove any existing "Typing..." placeholder before adding a new one
      setTabs((prevTabs) =>
        prevTabs.map((tab) =>
          tab.id === tabId
            ? {
                ...tab,
                messages: tab.messages.filter(
                  (msg) => msg.text !== "Typing..."
                ), // Remove previous "Typing..."
              }
            : tab
        )
      );

      // Add "Typing..." placeholder if not already present
      setTabs((prevTabs) =>
        prevTabs.map((tab) =>
          tab.id === tabId
            ? {
                ...tab,
                messages: [...tab.messages, { type: "bot-placeholder" }], // Add typing only if it's not already there
              }
            : tab
        )
      );

      // Fetch the AI response
      const response = await fetch("/api/ai-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: sessionId, message }),
      });

      if (!response.ok) throw new Error("Failed to fetch AI response.");

      const { message: aiMessage } = await response.json();

      // Typing effect
      let index = 0;
      const typingSpeed = 20; // Adjust for faster/slower typing effect
      const typingEffect = setInterval(() => {
        setTabs((prevTabs) =>
          prevTabs.map((tab) =>
            tab.id === tabId
              ? {
                  ...tab,
                  messages: tab.messages.map((msg) =>
                    msg.type === "bot-placeholder"
                      ? {
                          text: aiMessage.substring(0, index + 1),
                          type: "bot-placeholder",
                        }
                      : msg
                  ),
                }
              : tab
          )
        );

        index++;
        if (index >= aiMessage.length) clearInterval(typingEffect);
      }, typingSpeed);

      // Replace placeholder with full response after typing
      setTimeout(() => {
        setTabs((prevTabs) =>
          prevTabs.map((tab) =>
            tab.id === tabId
              ? {
                  ...tab,
                  messages: tab.messages.map((msg) =>
                    msg.type === "bot-placeholder"
                      ? { text: aiMessage, type: "bot" }
                      : msg
                  ),
                }
              : tab
          )
        );
      }, aiMessage.length * typingSpeed);
    } catch (error) {
      console.error("Error fetching AI response:", error);
      setTabs((prevTabs) =>
        prevTabs.map((tab) =>
          tab.id === tabId
            ? {
                ...tab,
                messages: [
                  ...tab.messages,
                  {
                    text: "Sorry, something went wrong. Please try again.",
                    type: "error",
                  },
                ],
              }
            : tab
        )
      );
    } finally {
      setLoading(false);
      setText(""); // Clear input after sending the message
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim() && !loading) handleAIResponse(text, activeTab);
    setText("");
  };

  const currentTabMessages =
    tabs.find((tab) => tab.id === activeTab)?.messages || [];

  return (
    <div className="h-full bg-primary/30 py-10 flex items-center">
      <div className="container mx-auto bg-gray-900 rounded-lg shadow-md p-6">
        {/* Tabs */}
        <div className="flex justify-between items-center border-b border-gray-700 pb-4 mb-4">
          <div className="flex gap-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`px-4 py-2 rounded-t-lg ${
                  activeTab === tab.id
                    ? "bg-primary text-white font-bold"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
              >
                {tab.name}
              </button>
            ))}
          </div>
          <button
            onClick={handleNewTab}
            className="px-4 py-2 rounded-lg text-white bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 hover:opacity-90"
          >
            New Chat
          </button>
        </div>

        {/* Chat Messages */}
        <div className="h-80 overflow-y-auto bg-gray-800 rounded-lg p-4 mb-4">
          {currentTabMessages.map((msg, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mb-3 ${
                msg.type === "user"
                  ? "text-right text-blue-400"
                  : msg.type === "error"
                  ? "text-red-500"
                  : "text-gray-200"
              }`}
            >
              {msg.text}
            </motion.div>
          ))}
          {loading && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-gray-500"
            >
              Typing...
            </motion.div>
          )}
        </div>

        {/* Input Field */}
        <form onSubmit={handleSubmit} className="flex gap-4">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="flex-grow px-4 py-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Type your message..."
          />
          <button
            type="submit"
            className="px-4 py-2 rounded-lg text-white bg-primary hover:bg-primary/80 flex items-center"
            disabled={loading}
          >
            <IoIosSend size={20} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatPage;
