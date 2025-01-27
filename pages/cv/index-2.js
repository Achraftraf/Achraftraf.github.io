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

      setTabs((prevTabs) =>
        prevTabs.map((tab) =>
          tab.id === tabId
            ? {
                ...tab,
                messages: [...tab.messages, { type: "bot-placeholder" }],
              }
            : tab
        )
      );

      const response = await fetch("/api/ai-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: sessionId, message }),
      });

      if (!response.ok) throw new Error("Failed to fetch AI response.");

      const { message: aiMessage } = await response.json();

      let index = 0;
      const typingSpeed = 20;
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
      setText("");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim() && !loading) handleAIResponse(text, activeTab);
    setText("");
  };

  const currentTabMessages =
    tabs.find((tab) => tab.id === activeTab)?.messages || [];

  // Animation Variants
  const pageVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 1, ease: "easeOut" },
    },
  };

  const formVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.6, delay: 0.3 },
    },
  };

  const tabsVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, delay: 0.5, ease: "easeOut" },
    },
  };

  const messageVariants = {
    hidden: { opacity: 0, x: -20, scale: 0.8 },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  const inputVariants = {
    hidden: { opacity: 0, x: -30, scale: 0.8 },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: { duration: 0.5, delay: 0.7, ease: "easeOut" },
    },
  };

  const sendButtonVariants = {
    hidden: { opacity: 0, rotate: -180 },
    visible: {
      opacity: 1,
      rotate: 0,
      transition: { duration: 0.7, delay: 0.9, ease: "easeOut" },
    },
  };

  const glowingEffect = {
    hidden: { boxShadow: "0 0 0 rgba(255, 255, 255, 0)" },
    visible: {
      boxShadow: "0 0 15px 10px rgba(255, 255, 255, 0.7)",
      transition: {
        duration: 1.5,
        ease: "easeInOut",
        repeat: Infinity,
        repeatType: "reverse",
      },
    },
  };

  return (
    <motion.div
      className="h-full bg-gradient-to-r from-teal-500 via-purple-600 to-pink-500 py-8 flex justify-center items-center"
      variants={pageVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="w-[800px] h-[450px] ml-14 mr-40 bg-gray-900 rounded-lg shadow-xl p-4 flex flex-col relative overflow-hidden">
        {/* Tabs */}
        <motion.div
          className="flex justify-between items-center border-b border-gray-700 pb-4 mb-4"
          variants={tabsVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="flex gap-3">
            {tabs.map((tab) => (
              <motion.button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`px-4 py-2 rounded-t-lg text-sm ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-indigo-600 to-purple-700 text-white font-bold"
                    : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {tab.name}
              </motion.button>
            ))}
          </div>
          <motion.button
            onClick={handleNewTab}
            className="px-3 py-2 rounded-lg text-sm text-white bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:opacity-90"
            whileHover={{ scale: 1.1 }}
          >
            New Chat
          </motion.button>
        </motion.div>

        {/* Chat Messages */}
        <motion.div
          className="h-[300px] overflow-y-auto bg-gray-800 rounded-lg p-3 mb-4 flex-1 space-y-3"
          variants={messageVariants}
          initial="hidden"
          animate="visible"
        >
          {currentTabMessages.map((msg, index) => (
            <motion.div
              key={index}
              variants={messageVariants}
              initial="hidden"
              animate="visible"
              className={`${
                msg.type === "user"
                  ? "text-right text-blue-300"
                  : msg.type === "error"
                  ? "text-red-500"
                  : "text-gray-200"
              } text-sm`}
            >
              {msg.text}
            </motion.div>
          ))}
          {loading && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-gray-500 text-sm"
            >
              Typing...
            </motion.div>
          )}
        </motion.div>

        {/* Animated Form */}
        <motion.form
          onSubmit={handleSubmit}
          className="flex items-center justify-between w-full gap-4"
          variants={formVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Input Field */}
          <motion.input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="flex-grow px-6 py-3 text-sm rounded-lg bg-gray-700 text-white outline-none focus:ring-2 focus:ring-teal-500"
            variants={inputVariants}
            initial="hidden"
            animate="visible"
            whileFocus={glowingEffect}
          />

          {/* Send Button */}
          <motion.button
            type="submit"
            className="px-6 py-3 rounded-lg text-lg bg-blue-600 text-white hover:bg-blue-500 focus:outline-none"
            variants={sendButtonVariants}
            initial="hidden"
            animate="visible"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <IoIosSend />
          </motion.button>
        </motion.form>
      </div>
    </motion.div>
  );
};

export default ChatPage;
