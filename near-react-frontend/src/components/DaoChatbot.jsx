import React, { useState, useRef, useEffect } from "react";
import { FaRobot, FaTimes, FaPaperPlane, FaSpinner } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const DaoChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hallo! Ich bin dein THESIS DAO Assistent. Wie kann ich dir helfen?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Standard response without backend call
    const standardResponse = {
      role: "assistant",
      content: `Vielen Dank für Ihre Nachricht! 

Der KI-Chatbot befindet sich aktuell noch in der Konzeptionsphase. Für Ihre Anfragen oder Feedback wenden Sie sich bitte direkt an:

📧 murbalio@students.zhaw.ch

Wir freuen uns über Ihr Interesse und werden uns schnellstmöglich bei Ihnen melden!`
    };

    // Simulate network delay
    setTimeout(() => {
      setMessages((prev) => [...prev, standardResponse]);
      setIsLoading(false);
    }, 500);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="bg-white rounded-2xl shadow-2xl w-96 overflow-hidden border border-gray-100"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#6B46C1] to-[#805AD5] p-4 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <FaRobot className="text-white text-xl" />
                <h3 className="text-white font-semibold">THESIS DAO Assistent</h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <FaTimes />
              </button>
            </div>

            {/* Messages Container */}
            <div 
              ref={chatContainerRef}
              className="h-[400px] overflow-y-auto p-4 space-y-4 bg-gray-50"
            >
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                      message.role === "user"
                        ? "bg-[#6B46C1] text-white"
                        : "bg-white border border-gray-200 text-gray-800"
                    }`}
                  >
                    {message.content}
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-white border border-gray-200 rounded-2xl px-4 py-2">
                    <FaSpinner className="animate-spin text-[#6B46C1]" />
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-gray-100">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Schreibe eine Nachricht..."
                  className="flex-1 p-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#6B46C1] focus:border-transparent transition-all text-gray-800 placeholder-gray-400"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className={`p-2 rounded-xl ${
                    !input.trim() || isLoading
                      ? "bg-gray-200 text-gray-500"
                      : "bg-[#6B46C1] text-white hover:bg-[#805AD5]"
                  } transition-colors`}
                >
                  <FaPaperPlane />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Button */}
      {!isOpen && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(true)}
          className="bg-[#6B46C1] text-white p-4 rounded-full shadow-lg hover:bg-[#805AD5] transition-colors"
        >
          <FaRobot className="text-xl" />
        </motion.button>
      )}
    </div>
  );
};

export default DaoChatbot;
