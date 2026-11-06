import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../hooks/useAuth';
import ChatMessage from './ChatMessage';

const LiveChat = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [messages, setMessages] = useState([
    { id: 1, text: 'Hello! How can we help you today?', isOwn: false, created_at: new Date() },
  ]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = { id: Date.now(), text: input.trim(), isOwn: true, created_at: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setSending(true);

    setTimeout(() => {
      const autoReply = {
        id: Date.now() + 1,
        text: t('chatAutoReply') || 'Thanks for your message! Our team will respond within 24 hours.',
        isOwn: false,
        created_at: new Date(),
      };
      setMessages((prev) => [...prev, autoReply]);
      setSending(false);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900">
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} isOwn={msg.isOwn} />
        ))}
        {sending && (
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <Loader2 className="w-3 h-3 animate-spin" />
            {t('typing') || 'Typing...'}
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex-shrink-0">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
            placeholder={t('typeMessage') || 'Type your message...'}
            className="flex-1 px-4 py-2.5 bg-gray-100 dark:bg-gray-700 rounded-full text-sm text-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-purple-500 transition"
            disabled={sending}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || sending}
            className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 text-white rounded-full flex items-center justify-center hover:shadow-lg transition disabled:opacity-50"
            aria-label="Send"
          >
            {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LiveChat;
