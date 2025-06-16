import React, { useEffect, useRef, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { RootState } from '../../store/store';
import MessageBubble from './MessageBubble';

interface MessageListProps {
  messages: any[];
}

const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const shouldShowTimestamp = useCallback((currentMessage: any, previousMessage: any) => {
    if (!previousMessage) return true;
    
    const currentTime = new Date(currentMessage.createdAt);
    const previousTime = new Date(previousMessage.createdAt);
    const timeDiff = currentTime.getTime() - previousTime.getTime();
    
    return timeDiff > 15 * 60 * 1000; // Show timestamp if more than 15 minutes between messages
  }, []);

  const shouldShowAvatar = useCallback((currentMessage: any, nextMessage: any) => {
    if (!nextMessage) return true;
    
    return currentMessage.sender._id !== nextMessage.sender._id;
  }, []);

  const formatTimestamp = useCallback((date: string) => {
    const messageDate = new Date(date);
    const now = new Date();
    const diff = now.getTime() - messageDate.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (days === 1) {
      return 'Yesterday';
    } else if (days < 7) {
      return messageDate.toLocaleDateString([], { weekday: 'long' });
    } else {
      return messageDate.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  }, []);

  if (!messages.length) {
    return (
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No messages yet</h3>
          <p className="text-gray-500">Start the conversation by sending a message!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-1">
      <AnimatePresence initial={false}>
        {messages.map((message, index) => {
          const previousMessage = index > 0 ? messages[index - 1] : null;
          const nextMessage = index < messages.length - 1 ? messages[index + 1] : null;
          const showTimestamp = shouldShowTimestamp(message, previousMessage);
          const showAvatar = shouldShowAvatar(message, nextMessage);
          const isOwnMessage = message.sender._id === user?._id;

          return (
            <div key={message._id}>
              {showTimestamp && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-center my-4"
                >
                  <div className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full">
                    {formatTimestamp(message.createdAt)}
                  </div>
                </motion.div>
              )}
              
              <MessageBubble
                message={message}
                isOwnMessage={isOwnMessage}
                showAvatar={showAvatar}
                showSender={!isOwnMessage && showAvatar}
              />
            </div>
          );
        })}
      </AnimatePresence>
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
