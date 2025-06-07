import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';

interface MessageBubbleProps {
  message: any;
  isOwnMessage: boolean;
  showAvatar: boolean;
  showSender: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isOwnMessage,
  showAvatar,
  showSender,
}) => {
  const [showReactions, setShowReactions] = useState(false);
  const { socket } = useSelector((state: RootState) => state.socket);

  const formatTime = (date: string) => {
    return new Date(date).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const handleReaction = (emoji: string) => {
    if (socket) {
      socket.emit('react-to-message', {
        messageId: message._id,
        emoji,
      });
    }
    setShowReactions(false);
  };

  const renderAttachments = () => {
    if (!message.attachments || message.attachments.length === 0) return null;

    return (
      <div className="mt-2 space-y-2">
        {message.attachments.map((attachment: any, index: number) => (
          <div key={index} className="relative">
            {attachment.type === 'image' ? (
              <img
                src={attachment.url}
                alt={attachment.filename}
                className="max-w-xs rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                onClick={() => window.open(attachment.url, '_blank')}
              />
            ) : (
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg max-w-xs">
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {attachment.filename}
                  </p>
                  <p className="text-xs text-gray-500">
                    {Math.round(attachment.size / 1024)} KB
                  </p>
                </div>
                <button
                  onClick={() => window.open(attachment.url, '_blank')}
                  className="p-1 text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderReactions = () => {
    if (!message.reactions || message.reactions.length === 0) return null;

    const reactionCounts = message.reactions.reduce((acc: any, reaction: any) => {
      acc[reaction.emoji] = (acc[reaction.emoji] || 0) + 1;
      return acc;
    }, {});

    return (
      <div className="flex flex-wrap gap-1 mt-1">
        {Object.entries(reactionCounts).map(([emoji, count]) => (
          <button
            key={emoji}
            className="inline-flex items-center space-x-1 px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-xs transition-colors"
            onClick={() => handleReaction(emoji)}
          >
            <span>{emoji}</span>
            <span className="text-gray-600">{count as number}</span>
          </button>
        ))}
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-2`}
    >
      <div className={`flex ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'} items-end space-x-2 max-w-xs lg:max-w-md`}>
        {/* Avatar */}
        {showAvatar && !isOwnMessage && (
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-medium flex-shrink-0">
            {message.sender.username.charAt(0).toUpperCase()}
          </div>
        )}

        {/* Message content */}
        <div className={`relative group ${isOwnMessage ? 'ml-2' : 'mr-2'}`}>
          {showSender && (
            <p className="text-xs text-gray-500 mb-1 px-1">
              {message.sender.username}
            </p>
          )}
          
          <div
            className={`relative px-4 py-2 rounded-2xl ${
              isOwnMessage
                ? 'bg-indigo-600 text-white rounded-br-md'
                : 'bg-gray-100 text-gray-900 rounded-bl-md'
            }`}
            onMouseEnter={() => setShowReactions(false)}
          >
            {/* Message text */}
            {message.content && (
              <p className="text-sm whitespace-pre-wrap break-words">
                {message.content}
              </p>
            )}

            {/* Attachments */}
            {renderAttachments()}

            {/* Message time */}
            <p className={`text-xs mt-1 ${
              isOwnMessage ? 'text-indigo-200' : 'text-gray-500'
            }`}>
              {formatTime(message.createdAt)}
              {isOwnMessage && message.readBy && message.readBy.length > 1 && (
                <span className="ml-1">✓✓</span>
              )}
            </p>

            {/* Reaction button */}
            <button
              className={`absolute top-1 ${isOwnMessage ? 'left-1' : 'right-1'} 
                opacity-0 group-hover:opacity-100 transition-opacity
                w-6 h-6 bg-white shadow-md rounded-full flex items-center justify-center
                hover:bg-gray-50 text-gray-400 hover:text-gray-600`}
              onClick={() => setShowReactions(!showReactions)}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>

            {/* Reaction picker */}
            {showReactions && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`absolute ${isOwnMessage ? 'right-0' : 'left-0'} 
                  -top-12 bg-white shadow-lg rounded-lg p-2 flex space-x-1 z-10 border`}
              >
                {['👍', '❤️', '😂', '😮', '😢', '😡'].map((emoji) => (
                  <button
                    key={emoji}
                    className="w-8 h-8 hover:bg-gray-100 rounded-md flex items-center justify-center transition-colors"
                    onClick={() => handleReaction(emoji)}
                  >
                    {emoji}
                  </button>
                ))}
              </motion.div>
            )}
          </div>

          {/* Reactions */}
          {renderReactions()}
        </div>
      </div>
    </motion.div>
  );
};

export default MessageBubble;
