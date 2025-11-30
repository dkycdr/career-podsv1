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
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 via-blue-500 to-purple-600 rounded-full blur-lg opacity-0 group-hover:opacity-75 transition-all duration-300 animate-pulse"></div>
        <div className="relative p-4 bg-gradient-to-br from-cyan-500 via-blue-500 to-purple-600 hover:from-cyan-600 hover:via-blue-600 hover:to-purple-700 text-white rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-110 active:scale-95">
          {isOpen ? (
            <X className="w-6 h-6 animate-rotate" />
          ) : (
            <div className="flex items-center justify-center gap-1">
              <MessageCircle className="w-6 h-6" />
              <span className="absolute -top-2 -right-2 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
              </span>
            </div>
          )}
        </div>
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: '120px',
            right: '24px',
            zIndex: 9999,
          }}
          className="w-80 h-96 bg-slate-950 rounded-2xl shadow-2xl border border-slate-700/50 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300 backdrop-blur-xl"
        >
          {/* Header with Gradient */}
          <div className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/20 via-blue-500/10 to-purple-600/20"></div>
            <div className="relative px-4 py-3 border-b border-slate-700/50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-cyan-500/30 to-blue-500/30 rounded-lg border border-cyan-500/30 animate-pulse">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                </div>
                <div>
                  <p className="text-sm font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">Career AI</p>
                  <p className="text-xs text-slate-400">by Groq</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 hover:bg-slate-800/50 rounded-lg transition-all duration-200 hover:scale-110"
              >
                <X className="w-4 h-4 text-slate-400 hover:text-slate-200" />
              </button>
            </div>
          </div>

          {/* Messages Container - Scrollable */}
          <div
            ref={messagesContainerRef}
            className="flex-1 overflow-y-auto px-4 py-3 space-y-3 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-950/50"
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2 animate-in fade-in slide-in-from-bottom-2 duration-200 ${
                  msg.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {msg.sender === 'ai' && (
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/40 flex items-center justify-center shadow-lg">
                      <Bot className="w-3.5 h-3.5 text-cyan-400" />
                    </div>
                  </div>
                )}

                <div
                  className={`max-w-xs px-3.5 py-2 rounded-lg text-sm leading-relaxed transition-all duration-200 ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-br from-cyan-600 to-blue-600 text-white rounded-br-2xl shadow-md hover:shadow-lg'
                      : 'bg-slate-800/60 border border-slate-700/50 text-slate-100 rounded-bl-2xl backdrop-blur-sm hover:bg-slate-800/80'
                  }`}
                >
                  {msg.text}
                </div>

                {msg.sender === 'user' && (
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-7 h-7 rounded-full bg-slate-800/60 border border-slate-700/50 flex items-center justify-center">
                      <User className="w-3.5 h-3.5 text-cyan-400" />
                    </div>
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/40 flex items-center justify-center">
                    <Loader className="w-3.5 h-3.5 animate-spin text-cyan-400" />
                  </div>
                </div>
                <div className="bg-slate-800/60 border border-slate-700/50 px-3.5 py-2 rounded-lg rounded-bl-2xl backdrop-blur-sm flex gap-1.5">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <form
            onSubmit={handleSendMessage}
            className="border-t border-slate-700/50 bg-slate-900/50 backdrop-blur-sm px-3 py-3 space-y-2 rounded-b-xl"
          >
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Tanya sesuatu..."
                disabled={isLoading}
                className="border-slate-600/50 bg-slate-800/60 text-slate-100 placeholder:text-slate-500 text-sm h-8 rounded-lg focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50 transition-all"
              />
              <Button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 disabled:from-slate-600 disabled:to-slate-600 text-white h-8 px-3 rounded-lg transition-all duration-200 hover:shadow-lg disabled:cursor-not-allowed active:scale-95"
                size="sm"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
