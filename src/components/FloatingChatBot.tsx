"use client";

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Loader, Bot, User, X, MessageCircle, Sparkles } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

export default function FloatingChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      text: 'Halo! 👋 Ada yang bisa aku bantu?',
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      setTimeout(() => {
        messagesContainerRef.current?.scrollTo({
          top: messagesContainerRef.current.scrollHeight,
          behavior: 'smooth',
        });
      }, 0);
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      text: input,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: input,
          conversationId: 'floating'
        })
      });

      if (!response.ok) throw new Error('Failed to get response');

      const data = await response.json();
      const aiMessage: Message = {
        id: data.id,
        text: data.message,
        sender: 'ai',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        id: crypto.randomUUID(),
        text: 'Maaf, ada error. Coba lagi?',
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Bubble Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 9999,
        }}
        className="group relative"
        title="Career AI Assistant"
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500 via-blue-600 to-purple-600 rounded-full blur-xl opacity-50 group-hover:opacity-100 transition-all duration-500 animate-pulse"></div>
        <div className="relative p-0 bg-slate-950 rounded-full shadow-2xl transition-all duration-300 transform group-hover:scale-110 group-active:scale-95 border border-white/10 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/20 via-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          <div className="w-14 h-14 flex items-center justify-center relative z-10">
            {isOpen ? (
              <X className="w-6 h-6 text-white animate-in rotate-90 duration-300" />
            ) : (
              <>
                <MessageCircle className="w-7 h-7 text-white fill-cyan-500/10" />
                <span className="absolute top-3 right-3 flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500 box-shadow-glow"></span>
                </span>
              </>
            )}
          </div>
        </div>
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: '100px',
            right: '24px',
            zIndex: 9999,
          }}
          className="w-[380px] h-[600px] max-h-[80vh] flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-500"
        >
          {/* Glass Container */}
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-2xl" />

          {/* Gradient Orbs Background */}
          <div className="absolute top-[-20%] left-[-20%] w-60 h-60 bg-purple-500/30 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-[-20%] right-[-20%] w-60 h-60 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />


          {/* Header */}
          <div className="relative z-10 px-6 py-5 border-b border-white/5 flex items-center justify-between bg-white/5 backdrop-blur-md">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                  <Sparkles className="w-5 h-5 text-white fill-white/20" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-900"></div>
              </div>
              <div>
                <h3 className="font-bold text-base text-white tracking-tight">Career AI</h3>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                  <p className="text-xs font-medium text-cyan-200/70">Online & Ready</p>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-white/10 rounded-full transition-colors duration-200 group"
            >
              <X className="w-5 h-5 text-slate-400 group-hover:text-white" />
            </button>
          </div>

          {/* Messages Container */}
          <div
            ref={messagesContainerRef}
            className="relative z-10 flex-1 overflow-y-auto px-5 py-6 space-y-6 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent"
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 animate-in fade-in slide-in-from-bottom-4 duration-300 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'
                  }`}
              >
                {msg.sender === 'ai' && (
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 flex items-center justify-center shadow-lg">
                      <Bot className="w-4 h-4 text-cyan-400" />
                    </div>
                  </div>
                )}

                <div
                  className={`max-w-[80%] px-5 py-3.5 text-sm leading-relaxed shadow-lg backdrop-blur-sm ${msg.sender === 'user'
                      ? 'bg-gradient-to-br from-cyan-600 to-blue-600 text-white rounded-2xl rounded-tr-sm border border-cyan-400/20'
                      : 'bg-white/5 text-slate-200 rounded-2xl rounded-tl-sm border border-white/10 hover:bg-white/10 transition-colors'
                    }`}
                >
                  {msg.text}
                  <p className={`text-[10px] mt-1.5 opacity-50 ${msg.sender === 'user' ? 'text-right text-cyan-100' : 'text-slate-400'}`}>
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>

                {msg.sender === 'user' && (
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-600/20 to-blue-600/20 border border-cyan-500/30 flex items-center justify-center">
                      <User className="w-4 h-4 text-cyan-400" />
                    </div>
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-3 animate-in fade-in slide-in-from-bottom-4 duration-300">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 flex items-center justify-center shadow-lg">
                    <Loader className="w-4 h-4 animate-spin text-cyan-400" />
                  </div>
                </div>
                <div className="bg-white/5 border border-white/10 px-5 py-4 rounded-2xl rounded-tl-sm backdrop-blur-sm flex gap-2 items-center">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></div>
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="relative z-10 p-5 bg-gradient-to-t from-slate-900/90 to-transparent">
            <form
              onSubmit={handleSendMessage}
              className="relative flex gap-2 items-center bg-slate-900/50 p-1.5 rounded-full border border-white/10 shadow-xl backdrop-blur-xl focus-within:border-cyan-500/50 focus-within:ring-1 focus-within:ring-cyan-500/20 transition-all duration-300"
            >
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                disabled={isLoading}
                className="flex-1 bg-transparent border-none text-white placeholder:text-slate-500 focus-visible:ring-0 focus-visible:ring-offset-0 px-4 h-10 text-sm"
              />
              <Button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="rounded-full w-10 h-10 p-0 bg-gradient-to-tr from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/25 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                <Send className="w-4 h-4 ml-0.5" />
              </Button>
            </form>
            <div className="text-center mt-2">
              <p className="text-[10px] text-slate-500 font-medium">Powered by <span className="text-cyan-400/80">DeepSeek AI</span></p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
