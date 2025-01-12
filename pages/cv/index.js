import React, { useState } from "react";

import { v4 as uuidv4 } from "uuid";

import { RiSendPlaneFill } from "react-icons/ri";

import { motion } from "framer-motion";

import { fadeIn } from "../../variants";

const ChatPage = () => {
  const [activeTab, setActiveTab] = useState("chat1");

  const [tabs, setTabs] = useState([
    { id: "chat1", name: "Chat 1", messages: [] },
  ]);

  const [text, setText] = useState("");

  const [sessionId] = useState(uuidv4());

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
  };

  const handleNewTab = () => {
    const newTabId = `chat${tabs.length + 1}`;

    setTabs([
      ...tabs,

      { id: newTabId, name: `Chat ${tabs.length + 1}`, messages: [] },
    ]);

    setActiveTab(newTabId);
  };

  const handleAIResponse = async (message, tabId) => {
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

      setTabs((prevTabs) =>
        prevTabs.map((tab) =>
          tab.id === tabId
            ? {
                ...tab,

                messages: [
                  ...tab.messages,

                  { text: message, type: "user" },

                  { text: aiMessage, type: "bot" },
                ],
              }
            : tab
        )
      );

      setText("");
    } catch (error) {
      console.error("Error fetching AI response:", error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (text.trim()) {
      handleAIResponse(text, activeTab);
    }
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
            className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-dark"
          >
            + New Tab
          </button>
        </div>

        {/* Chat Section */}

        <motion.div
          variants={fadeIn("down", 0.3)}
          initial="hidden"
          animate="show"
          exit="hidden"
          className="bg-gray-800 rounded-lg p-4 flex flex-col h-[60vh]"
        >
          {/* Chat Messages */}

          <div className="flex-grow overflow-y-auto space-y-4 p-3">
            {currentTabMessages.map((msg, index) => (
              <div
                key={index}
                className={`max-w-[75%] p-4 rounded-lg shadow-md ${
                  msg.type === "user"
                    ? "bg-blue-500 text-white self-end"
                    : "bg-gray-700 text-gray-200 self-start"
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
              className="flex-grow p-3 rounded-lg bg-gray-900 text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring focus:ring-blue-500"
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
  );
};

export default ChatPage;
