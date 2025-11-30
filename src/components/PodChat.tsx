"use client";

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Loader, MessageSquare } from 'lucide-react';

interface Message {
  id: string;
  userId: string;
  userName: string;
  message: string;
  role: string;
  createdAt: string;
}

interface PodChatProps {
  podId: string;
  userId: string;
  userName: string;
  userRole: string;
}

export default function PodChat({ podId, userId, userName, userRole }: PodChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
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

  // Fetch messages
  useEffect(() => {
    fetchMessages();
    // Polling untuk new messages setiap 3 detik
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [podId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = async () => {
    try {
      const response = await fetch(`/api/pod-messages?podId=${podId}&limit=100`);
      const data = await response.json();
      if (data.success) {
        setMessages(data.messages);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isSending) return;

    setIsSending(true);
    try {
      const response = await fetch('/api/pod-messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          podId,
          userId,
          userName,
          message: input,
          role: userRole,
        }),
      });

      if (response.ok) {
        setInput('');
        await fetchMessages();
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-900/50 rounded-xl border border-slate-700/50 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-600/20 to-blue-600/20 border-b border-slate-700/50 px-4 py-3 flex items-center gap-2">
        <MessageSquare className="w-5 h-5 text-cyan-400" />
        <div>
          <p className="text-sm font-bold text-slate-100">Pod Discussion</p>
          <p className="text-xs text-slate-400">{messages.length} messages</p>
        </div>
      </div>

      {/* Messages Container */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto px-4 py-4 space-y-3 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-800"
      >
        {isLoading ? (
          <div className="flex items-center justify-center h-full text-slate-400">
            <Loader className="w-5 h-5 animate-spin mr-2" />
            Loading messages...
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-slate-400 text-sm">
            Belum ada pesan. Mulai percakapan! 👋
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-2 animate-in fade-in slide-in-from-bottom-2 duration-200 ${
                msg.userId === userId ? 'justify-end' : 'justify-start'
              }`}
            >
              {msg.userId !== userId && (
                <div className="flex-shrink-0 w-7 h-7 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-cyan-400">
                  {msg.userName.charAt(0).toUpperCase()}
                </div>
              )}

              <div
                className={`max-w-xs px-3.5 py-2 rounded-lg text-sm leading-relaxed transition-all duration-200 ${
                  msg.userId === userId
                    ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-br-2xl shadow-md'
                    : 'bg-slate-800/80 text-slate-100 rounded-bl-2xl border border-slate-700/50 backdrop-blur-sm'
                }`}
              >
                {msg.userId !== userId && (
                  <p className="text-xs font-bold text-cyan-300 mb-1">
                    {msg.userName} {msg.role === 'MENTOR' && '👨‍🏫'}
                  </p>
                )}
                <p className="break-words">{msg.message}</p>
                <p className="text-xs mt-1 opacity-70">
                  {new Date(msg.createdAt).toLocaleTimeString('id-ID', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>

              {msg.userId === userId && (
                <div className="flex-shrink-0 w-7 h-7 rounded-full bg-gradient-to-br from-cyan-600 to-blue-600 flex items-center justify-center text-xs font-bold text-white">
                  {userName.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Input Area */}
      <form
        onSubmit={handleSendMessage}
        className="border-t border-slate-700/50 bg-slate-900/80 backdrop-blur-sm px-4 py-3"
      >
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Tulis pesan..."
            disabled={isSending}
            className="border-slate-600/50 bg-slate-800/60 text-slate-100 placeholder:text-slate-500 text-sm h-8 rounded-lg focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50 transition-all"
          />
          <Button
            type="submit"
            disabled={isSending || !input.trim()}
            className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 disabled:from-slate-600 disabled:to-slate-600 text-white h-8 px-3 rounded-lg transition-all duration-200 hover:shadow-lg disabled:cursor-not-allowed active:scale-95"
            size="sm"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </form>
    </div>
  );
}
