import React, { useEffect, useRef } from 'react';
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

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const shouldShowTimestamp = (currentMessage: any, previousMessage: any) => {
    if (!previousMessage) return true;
    
    const currentTime = new Date(currentMessage.createdAt);
    const previousTime = new Date(previousMessage.createdAt);
    const timeDiff = currentTime.getTime() - previousTime.getTime();
    
    // Show timestamp if messages are more than 5 minutes apart
    return timeDiff > 5 * 60 * 1000;
  };

  const shouldShowAvatar = (currentMessage: any, nextMessage: any) => {
    if (!nextMessage) return true;
    if (currentMessage.sender._id !== nextMessage.sender._id) return true;
    
    const currentTime = new Date(currentMessage.createdAt);
    const nextTime = new Date(nextMessage.createdAt);
    const timeDiff = nextTime.getTime() - currentTime.getTime();
    
    // Show avatar if next message is from different sender or more than 2 minutes apart
    return timeDiff > 2 * 60 * 1000;
  };

  const formatTimestamp = (date: string) => {
    const messageDate = new Date(date);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
    const messageDay = new Date(messageDate.getFullYear(), messageDate.getMonth(), messageDate.getDate());

    let dateString = '';
    if (messageDay.getTime() === today.getTime()) {
      dateString = 'Today';
    } else if (messageDay.getTime() === yesterday.getTime()) {
      dateString = 'Yesterday';
    } else {
      dateString = messageDate.toLocaleDateString();
    }

    const timeString = messageDate.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });

    return `${dateString} at ${timeString}`;
  };

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
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
