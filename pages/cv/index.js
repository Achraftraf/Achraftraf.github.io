import React, { useState, useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import { IoIosSend } from "react-icons/io";
import { motion, AnimatePresence } from "framer-motion";
import { FaRobot, FaUser } from "react-icons/fa";
import { ParticleBackground } from "../../components/particle-background";
import FlyingRocket from "../../components/flying-rocket";
import SpaceAdventureGame from "../../components/space-advanture";


const ChatPage = () => {
  const [activeTab, setActiveTab] = useState("chat1");
  const [tabs, setTabs] = useState([{ id: "chat1", name: "Chat 1", messages: [] }]);
  const [text, setText] = useState("");
  const [sessionId] = useState(uuidv4());
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const [play, setPlay] = useState(false);
  const [showRocket, setShowRocket] = useState(true);

  const handleCloseGame = () => {
    setPlay(false);
    setTimeout(() => {
      setShowRocket(true);
    }, 500);
  };

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

      let index = 0;
      const typingSpeed = 15;
      const typingEffect = setInterval(() => {
        if (index >= aiMessage.length) {
          clearInterval(typingEffect);
          setTabs((prev) =>
            prev.map((t) =>
              t.id === tabId
                ? {
                  ...t,
                  messages: t.messages.map((m) =>
                    m.type === "bot-placeholder"
                      ? { text: aiMessage, type: "bot" }
                      : m
                  ),
                }
                : t
            )
          );
          return;
        }

        const currentText = aiMessage.substring(0, index + 1);
        setTabs((prev) =>
          prev.map((tab) =>
            tab.id === tabId
              ? {
                ...tab,
                messages: [
                  ...tab.messages.filter((m) => m.type !== "bot-placeholder"),
                  {
                    text: currentText,
                    type: "bot-placeholder",
                  },
                ],
              }
              : tab
          )
        );
        index++;
      }, typingSpeed);
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
    for (let i = 0; i < parts.length;) {
      if (parts[i] && /^https?:\/\//.test(parts[i])) {
        formatted.push(
          <a
            key={i}
            href={parts[i]}
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyan-400 hover:text-cyan-300 underline font-semibold"
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
    <div className="h-full min-h-screen bg-site py-8 lg:py-12 px-4 sm:px-6 lg:px-8 xl:pr-32 overflow-hidden flex flex-col justify-center relative">
      <ParticleBackground />

      {showRocket && (
        <FlyingRocket
          onCatch={() => {
            setShowRocket(false);
            setPlay(true);
          }}
        />
      )}
      {play && <SpaceAdventureGame handleClose={handleCloseGame} />}

      {/* Animated gradient orbs */}
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.2, 0.3, 0.2],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-1/4 left-1/4 w-48 h-48 lg:w-64 lg:h-64 bg-purple-500/20 rounded-full blur-3xl pointer-events-none"
      />
      <motion.div
        animate={{
          scale: [1.1, 1, 1.1],
          opacity: [0.15, 0.25, 0.15],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute bottom-1/4 right-1/4 w-48 h-48 lg:w-64 lg:h-64 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none"
      />

      <div className="w-full max-w-5xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-6 lg:mb-8"
        >
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-3xl lg:text-4xl font-bold text-white mb-2"
          >
            AI <span className="text-cyan-400">Assistant</span>
          </motion.h1>


        </motion.div>

        {/* chat container */}
        <motion.div
          className="w-full h-[70vh] sm:h-[75vh] bg-[#20202d]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          {/* header with tabs */}
          <div className="flex flex-wrap justify-between items-center gap-2 px-3 sm:px-4 lg:px-6 py-3 border-b border-white/10 bg-[#1a1a2e]/80">
            <div className="flex flex-wrap gap-2">
              <AnimatePresence>
                {tabs.map((tab) => (
                  <motion.button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    className={`px-3 py-1.5 text-xs sm:text-sm rounded-full font-medium transition-all ${activeTab === tab.id
                      ? "bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-md"
                      : "bg-white/5 text-gray-400 hover:bg-white/10"
                      }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {tab.name}
                  </motion.button>
                ))}
              </AnimatePresence>
            </div>

            <motion.button
              onClick={handleNewTab}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-3 py-1.5 text-xs sm:text-sm text-white rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 shadow-lg transition-all"
            >
              + New
            </motion.button>
          </div>

          {/* chat messages */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-4 lg:p-5 space-y-3 sm:space-y-4">
            <AnimatePresence>
              {currentTabMessages.map((msg, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex gap-2 ${msg.type === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.type !== "user" && (
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center bg-gradient-to-br from-cyan-500/40 to-purple-500/40 flex-shrink-0">
                      <FaRobot className="text-cyan-300 text-xs sm:text-sm" />
                    </div>
                  )}
                  <div
                    className={`px-3 sm:px-4 py-2 sm:py-2.5 rounded-2xl text-xs sm:text-sm max-w-[85%] sm:max-w-[75%] ${msg.type === "user"
                      ? "bg-gradient-to-r from-cyan-500 to-purple-600 text-white"
                      : msg.type === "error"
                        ? "bg-red-500/80 text-white"
                        : "bg-white/10 text-gray-100 border border-white/10"
                      }`}
                  >
                    {formatMessage(msg.text)}
                  </div>
                  {msg.type === "user" && (
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center bg-white/10 flex-shrink-0">
                      <FaUser className="text-gray-300 text-xs sm:text-sm" />
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            {loading && (
              <motion.div
                className="flex items-center gap-2 text-gray-400 text-xs sm:text-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="flex space-x-1">
                  {[0, 0.2, 0.4].map((d, i) => (
                    <motion.span
                      key={i}
                      className="w-1.5 h-1.5 bg-cyan-400 rounded-full"
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
          <form
            onSubmit={handleSubmit}
            className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 border-t border-white/10 bg-[#1a1a2e]/60"
          >
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg bg-white/5 text-gray-200 placeholder-gray-500 text-sm border border-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
              disabled={loading}
            />
            <motion.button
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={loading || !text.trim()}
              className="p-2.5 sm:p-3 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-lg disabled:opacity-50 transition-all flex-shrink-0"
            >
              {loading ? (
                <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-t-transparent border-white rounded-full animate-spin" />
              ) : (
                <IoIosSend size={20} className="w-4 h-4 sm:w-5 sm:h-5" />
              )}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default ChatPage;
