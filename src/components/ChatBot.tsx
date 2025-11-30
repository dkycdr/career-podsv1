"use client";

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Loader, Bot, User, RotateCcw } from 'lucide-react';

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
    <Card className="border-slate-700/50 bg-slate-900/40 h-full flex flex-col">
      <CardHeader className="border-b border-slate-700/50 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-cyan-600/20 rounded-lg">
              <Bot className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <CardTitle className="text-slate-100">Career AI Assistant</CardTitle>
              <p className="text-xs text-slate-400 mt-1">Powered by DeepSeek</p>
            </div>
          </div>
          <Badge className="bg-green-600/20 text-green-300 border-green-500/50 border">
            Live
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
        {/* Messages */}
        <ScrollArea className="flex-1 p-4 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 mb-4 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'ai' && (
                <div className="p-2 bg-slate-800/50 rounded-lg h-fit">
                  <Bot className="w-4 h-4 text-cyan-400" />
                </div>
              )}

              <div
                className={`max-w-xs px-4 py-3 rounded-lg ${
                  msg.sender === 'user'
                    ? 'bg-cyan-600/20 border border-cyan-500/50 text-slate-100'
                    : 'bg-slate-800/30 border border-slate-700/50 text-slate-300'
                }`}
              >
                <p className="text-sm">{msg.text}</p>
                <p className="text-xs text-slate-500 mt-1">
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>

              {msg.sender === 'user' && (
                <div className="p-2 bg-slate-800/50 rounded-lg h-fit">
                  <User className="w-4 h-4 text-cyan-400" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3 mb-4">
              <div className="p-2 bg-slate-800/50 rounded-lg">
                <Bot className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="bg-slate-800/30 border border-slate-700/50 px-4 py-3 rounded-lg flex items-center gap-2">
                <Loader className="w-4 h-4 animate-spin text-cyan-400" />
                <span className="text-sm text-slate-400">Mengetik...</span>
              </div>
            </div>
          )}

          <div ref={scrollRef} />
        </ScrollArea>

        {/* Input Form */}
        <form onSubmit={handleSendMessage} className="border-t border-slate-700/50 p-4 space-y-3">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Tanyakan tentang career, skills, atau mentorship..."
              disabled={isLoading}
              className="border-slate-700/50 bg-slate-800/30 text-slate-100 placeholder:text-slate-500"
            />
            <Button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="bg-cyan-600 hover:bg-cyan-700 text-white"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleClear}
              className="flex-1 border-slate-700/50 text-slate-400 hover:bg-slate-800/30"
            >
              <RotateCcw className="w-3 h-3 mr-1" />
              Clear Chat
            </Button>
            <span className="text-xs text-slate-500 flex items-center">
              {messages.length - 1} messages
            </span>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
