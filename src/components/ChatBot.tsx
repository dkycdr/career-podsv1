"use client";

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Loader, Bot, User, RotateCcw, Sparkles } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

export default function ChatBot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      text: 'Halo! Saya AI assistant untuk membantu career development kamu. Tanyakan apapun tentang skill, career goals, atau mentorship! 👋',
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto scroll ke bottom saat ada message baru
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    // Add user message
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
      // Call API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: input,
          conversationId: 'default'
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
        text: 'Maaf, ada error. Silakan coba lagi.',
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setMessages([
      {
        id: '0',
        text: 'Halo! Saya AI assistant untuk membantu career development kamu. Tanyakan apapun tentang skill, career goals, atau mentorship! 👋',
        sender: 'ai',
        timestamp: new Date()
      }
    ]);
  };

  return (
    <div className="relative h-[600px] flex flex-col overflow-hidden rounded-3xl border border-white/10 shadow-2xl bg-slate-950/50 backdrop-blur-3xl animate-spring-up">
      {/* Shimmer Border */}
      <div className="absolute inset-0 z-0 pointer-events-none rounded-3xl overflow-hidden">
        <div className="absolute inset-0 opacity-20 animate-shimmer bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" style={{ backgroundSize: '200% 100%' }} />
      </div>

      {/* Background Ambience */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none -translate-y-1/2 translate-x-1/2 animate-pulse" style={{ animationDuration: '4s' }} />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[100px] pointer-events-none translate-y-1/2 -translate-x-1/2 animate-pulse" style={{ animationDuration: '7s' }} />

      {/* Header */}
      <div className="relative z-10 px-6 py-5 border-b border-white/5 flex items-center justify-between bg-white/5 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <div className="relative group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 animate-float-slow">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-500 rounded-full border-[3px] border-slate-900 shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-xl text-white tracking-tight">Career AI Assistant</h2>
              <Badge variant="outline" className="bg-cyan-500/10 text-cyan-400 border-cyan-500/20 px-2 py-0.5 text-xs animate-pulse">
                PRO
              </Badge>
            </div>
            <p className="text-sm text-slate-400 flex items-center gap-1.5 mt-0.5">
              <Sparkles className="w-3 h-3 text-cyan-400" />
              Powered by DeepSeek V3
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-300 hover:rotate-180" onClick={handleClear} title="Reset Chat">
            <RotateCcw className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 relative z-10 pt-6 pb-2 px-6">
        <div className="space-y-6">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-4 animate-slide-up-fade ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'ai' && (
                <div className="flex-shrink-0 mt-1">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 flex items-center justify-center shadow-lg animate-float-slow" style={{ animationDuration: '5s' }}>
                    <Bot className="w-5 h-5 text-cyan-400" />
                  </div>
                </div>
              )}

              <div
                className={`max-w-[75%] px-6 py-4 text-[15px] leading-relaxed shadow-xl backdrop-blur-sm transition-all duration-300 hover:scale-[1.01] ${msg.sender === 'user'
                    ? 'bg-gradient-to-br from-cyan-600 to-blue-600 text-white rounded-3xl rounded-tr-sm border border-cyan-400/20'
                    : 'bg-white/5 text-slate-200 rounded-3xl rounded-tl-sm border border-white/10 hover:bg-white/10 transition-colors'
                  }`}
              >
                {msg.text}
                <p className={`text-[10px] mt-2 opacity-60 ${msg.sender === 'user' ? 'text-right text-cyan-100' : 'text-slate-400'}`}>
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>

              {msg.sender === 'user' && (
                <div className="flex-shrink-0 mt-1">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-600/20 to-blue-600/20 border border-cyan-500/30 flex items-center justify-center">
                    <User className="w-5 h-5 text-cyan-400" />
                  </div>
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-4 animate-slide-up-fade">
              <div className="flex-shrink-0 mt-1">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 flex items-center justify-center shadow-lg animate-pulse">
                  <Bot className="w-5 h-5 text-cyan-400" />
                </div>
              </div>
              <div className="bg-white/5 border border-white/10 px-6 py-5 rounded-3xl rounded-tl-sm backdrop-blur-sm flex gap-2 items-center">
                <div className="w-2.5 h-2.5 bg-cyan-400 rounded-full animate-typing-bounce"></div>
                <div className="w-2.5 h-2.5 bg-purple-400 rounded-full animate-typing-bounce" style={{ animationDelay: '0.15s' }}></div>
                <div className="w-2.5 h-2.5 bg-blue-400 rounded-full animate-typing-bounce" style={{ animationDelay: '0.3s' }}></div>
              </div>
            </div>
          )}
          <div ref={scrollRef} className="h-4" />
        </div>
      </ScrollArea>

      {/* Input Form */}
      <div className="relative z-10 p-6 pt-2">
        <div className="bg-slate-900/50 p-2 rounded-[24px] border border-white/10 shadow-xl backdrop-blur-xl focus-within:border-cyan-500/50 focus-within:ring-1 focus-within:ring-cyan-500/20 focus-within:shadow-[0_0_25px_rgba(6,182,212,0.15)] transition-all duration-300">
          <form onSubmit={handleSendMessage} className="relative flex items-end gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about your career goals..."
              disabled={isLoading}
              className="flex-1 bg-transparent border-none text-white placeholder:text-slate-500 focus-visible:ring-0 focus-visible:ring-offset-0 px-4 py-3 min-h-[50px] text-base resize-none"
            />
            <Button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="rounded-2xl w-12 h-12 p-0 bg-gradient-to-tr from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/25 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shrink-0 mb-0.5 mr-0.5"
            >
              <Send className="w-5 h-5 ml-0.5" />
            </Button>
          </form>
        </div>
        <div className="text-center mt-3">
          <p className="text-[11px] text-slate-500">AI can make mistakes. Consider checking important information.</p>
        </div>
      </div>
    </div>
  );
}
