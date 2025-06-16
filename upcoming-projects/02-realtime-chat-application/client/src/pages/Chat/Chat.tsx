import React, { useEffect, useRef, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store/store';
import { setActiveChat, setMessages, addMessage } from '../../store/slices/chatSlice';
import MessageList from '../../components/Chat/MessageList';
import MessageInput from '../../components/Chat/MessageInput';
import ChatHeader from '../../components/Chat/ChatHeader';
import EmptyState from '../../components/Chat/EmptyState';
import api from '../../services/api';
import toast from 'react-hot-toast';

const Chat: React.FC = () => {
  const { chatId } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const { activeChat, messages: allMessages } = useSelector((state: RootState) => state.chat);
  const { socket } = useSelector((state: RootState) => state.socket);
  const { user } = useSelector((state: RootState) => state.auth);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Get messages for the current chat
  const messages = activeChat ? allMessages[activeChat._id] || [] : [];

  const loadChat = useCallback(async (id: string) => {
    try {
      const response = await api.get(`/chat/${id}`);
      dispatch(setActiveChat(response.data));
    } catch (error) {
      toast.error('Failed to load chat');
    }
  }, [dispatch]);

  const loadMessages = useCallback(async () => {
    if (!activeChat) return;

    try {
      const response = await api.get(`/chat/${activeChat._id}/messages`);
      dispatch(setMessages(response.data));
    } catch (error) {
      toast.error('Failed to load messages');
    }
  }, [activeChat, dispatch]);

  const joinChatRoom = useCallback(() => {
    if (socket && activeChat) {
      socket.emit('join-chat', activeChat._id);
    }
  }, [socket, activeChat]);

  const handleNewMessage = useCallback((message: any) => {
    if (message.chat === activeChat?._id) {
      dispatch(addMessage(message));
    }
  }, [dispatch, activeChat?._id]);

  const handleMessageDeleted = useCallback((messageId: string) => {
    // Handle message deletion
    console.log('Message deleted:', messageId);
  }, []);

  const handleMessageEdited = useCallback((message: any) => {
    // Handle message editing
    console.log('Message edited:', message);
  }, []);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  // Effect for loading chat
  useEffect(() => {
    if (chatId && chatId !== activeChat?._id) {
      loadChat(chatId);
    }
  }, [chatId, activeChat?._id, loadChat]);

  // Effect for loading messages and joining chat room
  useEffect(() => {
    if (activeChat) {
      loadMessages();
      joinChatRoom();
    }
  }, [activeChat, loadMessages, joinChatRoom]);

  // Effect for scrolling to bottom
  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Effect for socket event listeners
  useEffect(() => {
    if (socket) {
      socket.on('new-message', handleNewMessage);
      socket.on('message-deleted', handleMessageDeleted);
      socket.on('message-edited', handleMessageEdited);

      return () => {
        socket.off('new-message');
        socket.off('message-deleted');
        socket.off('message-edited');
      };
    }
  }, [socket, handleNewMessage, handleMessageDeleted, handleMessageEdited]);

  const handleSendMessage = async (content: string, files?: File[]) => {
    if (!socket || !activeChat || !user) return;

    try {
      let attachments = [];
      if (files && files.length > 0) {
        const formData = new FormData();
        files.forEach(file => formData.append('files', file));

        const uploadResponse = await api.post('/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        attachments = uploadResponse.data.files;
      }

      const messageData = {
        chat: activeChat._id,
        content,
        attachments,
        sender: user._id,
      };

      socket.emit('send-message', messageData);
    } catch (error) {
      toast.error('Failed to send message');
    }
  };

  if (!activeChat) {
    return <EmptyState />;
  }

  return (
    <div className="h-full flex flex-col bg-white">
      <ChatHeader />
      <div className="flex-1 overflow-hidden">
        <MessageList messages={messages} />
        <div ref={messagesEndRef} />
      </div>
      <MessageInput onSendMessage={handleSendMessage} />
    </div>
  );
};

export default Chat;
