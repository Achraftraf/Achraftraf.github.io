import React, { useState, useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import { IoIosSend } from "react-icons/io";
import { motion, AnimatePresence } from "framer-motion";
import { FaRobot, FaUser } from "react-icons/fa";

const ChatPage = () => {
  const [activeTab, setActiveTab] = useState("chat1");
  const [tabs, setTabs] = useState([{ id: "chat1", name: "Chat 1", messages: [] }]);
  const [text, setText] = useState("");
  const [sessionId] = useState(uuidv4());
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [tabs, loading]);

  const handleTabChange = (tabId) => setActiveTab(tabId);

  const handleNewTab = () => {
    const newTabId = `chat${tabs.length + 1}`;
    setTabs([...tabs, { id: newTabId, name: `Chat ${tabs.length + 1}`, messages: [] }]);
    setActiveTab(newTabId);
  };

  const handleAIResponse = async (message, tabId) => {
    setLoading(true);
    setTabs((prev) =>
      prev.map((t) =>
        t.id === tabId ? { ...t, messages: [...t.messages, { text: message, type: "user" }] } : t
      )
    );

    try {
      const response = await fetch("/api/ai-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: sessionId, message }),
      });

      if (!response.ok) throw new Error("AI fetch failed");
      const { message: aiMessage } = await response.json();

      // typing simulation
      let index = 0;
      const typingSpeed = 15;
      const typingEffect = setInterval(() => {
        setTabs((prev) =>
          prev.map((tab) =>
            tab.id === tabId
              ? {
                  ...tab,
                  messages: [
                    ...tab.messages.filter((m) => m.type !== "bot-placeholder"),
                    {
                      text: aiMessage.substring(0, index + 1),
                      type: "bot-placeholder",
                    },
                  ],
                }
              : tab
          )
        );
        index++;
        if (index >= aiMessage.length) clearInterval(typingEffect);
      }, typingSpeed);

      setTimeout(() => {
        setTabs((prev) =>
          prev.map((t) =>
            t.id === tabId
              ? {
                  ...t,
                  messages: t.messages.map((m) =>
                    m.type === "bot-placeholder" ? { text: aiMessage, type: "bot" } : m
                  ),
                }
              : t
          )
        );
      }, aiMessage.length * typingSpeed);
    } catch (error) {
      setTabs((prev) =>
        prev.map((t) =>
          t.id === tabId
            ? {
                ...t,
                messages: [
                  ...t.messages,
                  { text: "⚠️ Something went wrong. Try again later.", type: "error" },
                ],
              }
            : t
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

  const currentTabMessages = tabs.find((tab) => tab.id === activeTab)?.messages || [];

  const formatMessage = (text = "") => {
    const urlRegex = /(https?:\/\/[^\s,]+)([.,;!?]*)/g;
    const parts = text.split(urlRegex);
    const formatted = [];
    for (let i = 0; i < parts.length; ) {
      if (parts[i] && /^https?:\/\//.test(parts[i])) {
        formatted.push(
          <a
            key={i}
            href={parts[i]}
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-400 hover:text-indigo-300 underline font-semibold"
          >
            {parts[i]}
          </a>
        );
        formatted.push(parts[i + 1] || "");
        i += 2;
      } else {
        formatted.push(parts[i]);
        i += 1;
      }
    }
    return formatted;
  };

  return (
    <motion.div
      className="min-h-screen w-full flex justify-center items-center bg-gradient-to-br from-gray-950 via-gray-900 to-black relative overflow-hidden px-2 sm:px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2 }}
    >
      {/* floating background lights */}
      <motion.div
        className="absolute w-72 h-72 sm:w-96 sm:h-96 bg-indigo-600/30 rounded-full blur-3xl top-8 left-8 animate-pulse"
        animate={{ x: [0, 25, -25, 0], y: [0, 15, -15, 0] }}
        transition={{ duration: 12, repeat: Infinity }}
      />
      <motion.div
        className="absolute w-[22rem] h-[22rem] sm:w-[28rem] sm:h-[28rem] bg-purple-600/30 rounded-full blur-3xl bottom-8 right-8 animate-pulse"
        animate={{ x: [0, -20, 20, 0], y: [0, -10, 10, 0] }}
        transition={{ duration: 14, repeat: Infinity }}
      />

      {/* chat container */}
      <motion.div
        layout
        className="w-full max-w-5xl h-[85vh] sm:h-[80vh] bg-white/10 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl flex flex-col overflow-hidden"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        {/* header */}
        <motion.div
          className="flex flex-wrap justify-between items-center gap-2 px-4 sm:px-6 py-3 sm:py-4 border-b border-white/10 bg-gradient-to-r from-gray-900/80 via-gray-800/70 to-gray-900/80"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <div className="flex flex-wrap gap-2">
            <AnimatePresence>
              {tabs.map((tab) => (
                <motion.button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`px-3 sm:px-4 py-1.5 text-xs sm:text-sm rounded-full font-medium transition-all ${
                    activeTab === tab.id
                      ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md"
                      : "bg-gray-700/50 text-gray-400 hover:bg-gray-700/70"
                  }`}
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                  layout
                >
                  {tab.name}
                </motion.button>
              ))}
            </AnimatePresence>
          </div>

          <motion.button
            onClick={handleNewTab}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="px-3 py-1 text-xs sm:text-sm text-white rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 shadow-md hover:opacity-90"
          >
            + New Chat
          </motion.button>
        </motion.div>

        {/* chat messages */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-5 space-y-4 scrollbar-thin scrollbar-thumb-gray-700/70">
          <AnimatePresence>
            {currentTabMessages.map((msg, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.type !== "user" && (
                  <motion.div
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center mr-2 bg-indigo-500/40"
                    initial={{ rotate: -15 }}
                    animate={{ rotate: 0 }}
                  >
                    <FaRobot className="text-indigo-300 text-xs sm:text-sm" />
                  </motion.div>
                )}
                <div
                  className={`px-3 sm:px-4 py-2 rounded-2xl text-xs sm:text-sm max-w-[80%] sm:max-w-[70%] ${
                    msg.type === "user"
                      ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white"
                      : msg.type === "error"
                      ? "bg-red-500/80 text-white"
                      : "bg-gray-800/70 text-gray-100"
                  }`}
                >
                  {formatMessage(msg.text)}
                </div>
                {msg.type === "user" && (
                  <motion.div
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center ml-2 bg-gray-700/40"
                    initial={{ rotate: 15 }}
                    animate={{ rotate: 0 }}
                  >
                    <FaUser className="text-gray-300 text-xs sm:text-sm" />
                  </motion.div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {loading && (
            <motion.div
              className="flex items-center gap-2 text-gray-400 text-xs pl-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="flex space-x-1">
                {[0, 0.2, 0.4].map((d, i) => (
                  <motion.span
                    key={i}
                    className="w-1.5 h-1.5 bg-gray-400 rounded-full"
                    animate={{ y: [0, -4, 0] }}
                    transition={{ repeat: Infinity, duration: 0.6, delay: d }}
                  />
                ))}
              </div>
              <span>AI is typing...</span>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* input */}
        <motion.form
          onSubmit={handleSubmit}
          className="flex items-center gap-2 sm:gap-3 p-2 sm:p-4 border-t border-white/10 bg-gray-900/60 backdrop-blur-xl"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type your message..."
            className="flex-grow px-3 sm:px-4 py-2 rounded-lg bg-gray-800/70 text-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            disabled={loading}
          />
          <motion.button
            type="submit"
            whileHover={{ scale: 1.1, rotate: 10 }}
            whileTap={{ scale: 0.9 }}
            disabled={loading || !text.trim()}
            className="p-2 sm:p-3 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg hover:shadow-indigo-500/30 disabled:opacity-50 transition-all"
          >
            {loading ? (
              <motion.div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-t-transparent border-white rounded-full animate-spin" />
            ) : (
              <IoIosSend size={20} className="sm:size-5" />
            )}
          </motion.button>
        </motion.form>
      </motion.div>
    </motion.div>
  );
};

export default ChatPage;
