import React from 'react';
import { User, Headphones } from 'lucide-react';
import { formatTime } from '../../utils/formatters';

const ChatMessage = ({ message, isOwn }) => {
  if (!message) return null;

  return (
    <div className={`flex items-end gap-2 ${isOwn ? 'flex-row-reverse' : ''}`}>
      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${isOwn ? 'bg-gradient-to-br from-purple-500 to-blue-500' : 'bg-gray-200 dark:bg-gray-700'}`}>
        {isOwn ? (
          <User className="w-4 h-4 text-white" />
        ) : (
          <Headphones className="w-4 h-4 text-gray-600 dark:text-gray-300" />
        )}
      </div>
      <div className={`max-w-[75%] ${isOwn ? 'items-end' : 'items-start'} flex flex-col`}>
        <div className={`px-4 py-2.5 rounded-2xl ${isOwn ? 'bg-gradient-to-br from-purple-600 to-blue-600 text-white rounded-br-sm' : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white rounded-bl-sm'}`}>
          <p className="text-sm break-words whitespace-pre-wrap">{message.text}</p>
        </div>
        <p className="text-[10px] text-gray-400 mt-1 px-1">
          {formatTime(message.created_at || new Date())}
        </p>
      </div>
    </div>
  );
};

export default ChatMessage;
