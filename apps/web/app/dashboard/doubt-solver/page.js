"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Loader2, BookOpen, MessageCircle, Sparkles, User, Bot, HelpCircle } from "lucide-react";

export default function DoubtSolverPage() {
  const [messages, setMessages] = useState([
    {
      role: "ai",
      text: "Hi! I'm Manan, your AI academic assistant. Ask me any question about your courses, concepts, or assignments — I'm here to help!",
      sources: [],
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = { role: "user", text: input, sources: [] };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/solve-doubt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          student_id: "demo_user",
          question_text: userMessage.text,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch response");
      }

      const data = await response.json();

      const aiMessage = {
        role: "ai",
        text: data.answer,
        sources: data.citations || [],
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error asking Manan:", error);
      const errorMessage = {
        role: "ai",
        text: "Sorry, I encountered an error while processing your request. Please try again.",
        sources: [],
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const suggestions = [
    "Explain quantum computing in simple terms",
    "Help me understand recursion",
    "What is the difference between TCP and UDP?",
    "Explain Big O notation with examples",
  ];

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col max-w-7xl mx-auto w-full animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="mb-6 pb-6 border-b border-zinc-200">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-zinc-900 border border-zinc-900 flex items-center justify-center text-white shadow-sm">
            <MessageCircle size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-heading font-bold text-zinc-900 uppercase tracking-tighter">
              Doubt Solver
            </h1>
            <p className="text-sm font-medium text-zinc-500 uppercase tracking-wide">
              Ask Manan anything — get instant, AI-powered answers
            </p>
          </div>
        </div>
      </div>

      {/* Chat Container */}
      <div className="flex-1 flex flex-col bg-white border border-zinc-200 shadow-none overflow-hidden relative group">
        
        {/* Decorative corner */}
        <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-zinc-900 opacity-50"></div>
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-zinc-900 opacity-50"></div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-zinc-50/30">
          {messages.length === 1 && (
            <div className="flex flex-col items-center justify-center py-12 h-full">
              <div className="w-16 h-16 bg-zinc-900 text-white flex items-center justify-center mb-6 shadow-sm">
                <Sparkles size={32} />
              </div>
              <h3 className="text-xl font-heading font-bold text-zinc-900 mb-2 uppercase tracking-tight">
                What can I help you with?
              </h3>
              <p className="text-sm font-medium text-zinc-500 mb-8 text-center max-w-md">
                ASK ME ABOUT ANY ACADEMIC TOPIC, CONCEPT, OR PROBLEM. I'LL PROVIDE DETAILED EXPLANATIONS WITH REFERENCES.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl">
                {suggestions.map((suggestion, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setInput(suggestion);
                    }}
                    className="text-left px-5 py-4 bg-white hover:bg-zinc-900 hover:text-white border border-zinc-200 hover:border-zinc-900 text-xs font-bold text-zinc-600 uppercase tracking-wider transition-all duration-200 flex items-center gap-3 group/btn"
                  >
                    <HelpCircle size={16} className="text-zinc-400 group-hover/btn:text-white transition-colors" />
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div className={`flex gap-4 max-w-[85%] ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                {/* Avatar */}
                <div
                  className={`w-8 h-8 flex-shrink-0 flex items-center justify-center text-xs font-bold border ${
                    msg.role === "user"
                      ? "bg-zinc-900 text-white border-zinc-900"
                      : "bg-white text-zinc-900 border-zinc-200"
                  }`}
                >
                  {msg.role === "user" ? <User size={14} /> : <Bot size={14} />}
                </div>

                <div className="flex flex-col gap-2 min-w-0">
                  {/* Message Bubble */}
                  <div
                    className={`p-5 text-sm leading-relaxed border ${
                      msg.role === "user"
                        ? "bg-zinc-900 text-white border-zinc-900"
                        : "bg-white text-zinc-800 border-zinc-200 shadow-sm"
                    }`}
                  >
                    <div className="whitespace-pre-wrap font-medium">{msg.text}</div>
                  </div>

                  {/* Citations */}
                  {msg.sources && msg.sources.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-1">
                      {msg.sources.map((source, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-bold text-zinc-500 bg-zinc-100 px-3 py-1 border border-zinc-200"
                        >
                          <BookOpen size={10} />
                          {source}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="flex gap-4">
                <div className="w-8 h-8 bg-white border border-zinc-200 flex-shrink-0 flex items-center justify-center text-zinc-900 text-xs font-bold">
                  <Bot size={14} />
                </div>
                <div className="bg-white text-zinc-500 text-sm px-5 py-4 border border-zinc-200 flex items-center gap-3">
                  <Loader2
                    size={16}
                    className="animate-spin text-zinc-900"
                  />
                  <span className="font-bold uppercase tracking-widest text-xs">Manan is thinking...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-6 bg-white border-t border-zinc-200">
          <form
            onSubmit={sendMessage}
            className="flex gap-4 items-center"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="TYPE YOUR QUESTION HERE..."
              className="flex-1 bg-zinc-50 border border-zinc-200 focus:border-zinc-900 focus:bg-white px-5 py-4 text-sm font-medium transition-all outline-none placeholder:text-zinc-400 placeholder:font-bold placeholder:uppercase placeholder:tracking-wider focus:ring-0"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="px-6 py-4 bg-zinc-900 text-white hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-bold uppercase tracking-widest text-xs flex items-center gap-2"
            >
              <span>Send</span>
              <Send size={16} />
            </button>
          </form>
          <div className="bg-zinc-50 border-t border-zinc-100 mt-0 pt-2 pb-0">
             <p className="text-center text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                Manan AI can make mistakes. Verify important information.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
