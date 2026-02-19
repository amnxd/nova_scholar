"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, Send, X, Loader2, BookOpen, Sparkles } from "lucide-react";

export default function AskManan() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'ai', text: "Ready to assist. Query the Manan intelligence database.", sources: [] }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const toggleChat = () => setIsOpen(!isOpen);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen, loading]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = { role: 'user', text: input, sources: [] };
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
        role: 'ai',
        text: data.answer,
        sources: data.citations || []
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error asking Manan:", error);
      const errorMessage = {
        role: 'ai',
        text: "System error. Rerouting logic...",
        sources: []
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 w-[calc(100vw-3rem)] sm:w-96 bg-white border border-zinc-900 shadow-[8px_8px_0px_0px_rgba(24,24,27,1)] flex flex-col transition-all duration-300 ease-in-out h-[500px] max-h-[70vh] animate-in slide-in-from-bottom-5 fade-in">
          {/* Header */}
          <div className="bg-zinc-900 p-4 flex justify-between items-center text-white border-b border-zinc-900">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 flex items-center justify-center border border-white/20">
                <Sparkles size={16} />
              </div>
              <span className="font-heading font-bold uppercase tracking-widest text-sm">Manan AI</span>
            </div>
            <button
              onClick={toggleChat}
              className="hover:bg-zinc-800 p-1.5 border border-transparent hover:border-zinc-700 transition-colors"
              aria-label="Close chat"
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white scrollbar-thin scrollbar-thumb-zinc-900 scrollbar-track-zinc-100">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex flex-col ${msg.role === 'user' ? "items-end" : "items-start"}`}
              >
                <div
                  className={`max-w-[85%] p-4 text-sm leading-relaxed font-medium ${msg.role === 'user'
                      ? "bg-zinc-900 text-white"
                      : "bg-zinc-50 text-zinc-900 border border-zinc-200"
                    }`}
                >
                  {msg.text}
                </div>

                {/* Citations */}
                {msg.sources && msg.sources.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2 max-w-[85%]">
                    {msg.sources.map((source, idx) => (
                      <span key={idx} className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider font-bold text-zinc-500 bg-zinc-100 px-2 py-1 border border-zinc-200">
                        <BookOpen size={10} />
                        {source}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-zinc-50 text-zinc-500 text-xs px-4 py-3 border border-zinc-200 flex items-center gap-2">
                  <Loader2 size={14} className="animate-spin text-zinc-900" />
                  PROCESSING...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={sendMessage} className="p-3 bg-white border-t border-zinc-900 flex gap-2 items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="ENTER COMMAND OR QUERY..."
              className="flex-1 bg-zinc-50 border border-zinc-300 focus:border-zinc-900 rounded-none px-4 py-3 text-sm transition-all outline-none font-mono placeholder:text-zinc-400 placeholder:text-xs"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="p-3 bg-zinc-900 text-white hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all border border-transparent hover:border-zinc-900"
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      )}

      {/* Floating Action Button */}
      {!isOpen && (
        <button
          onClick={toggleChat}
          className="group flex items-center justify-center w-14 h-14 bg-zinc-900 text-white shadow-[4px_4px_0px_0px_rgba(200,200,200,1)] hover:shadow-[6px_6px_0px_0px_rgba(200,200,200,1)] hover:-translate-y-1 active:translate-y-0 active:shadow-none transition-all duration-200"
        >
          <MessageCircle size={24} />
        </button>
      )}
    </div>
  );
}
