import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { RootState, useAppDispatch } from '../../store/store';
import { setChats, setActiveChat, addMessage } from '../../store/slices/chatSlice';
import { toggleSidebar } from '../../store/slices/uiSlice';
import UserSearchModal from '../Chat/UserSearchModal';
import api from '../../services/api';
import toast from 'react-hot-toast';

const Sidebar: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state: RootState) => state.auth);
  const { chats = [], activeChat } = useSelector((state: RootState) => state.chat);
  const { socket } = useSelector((state: RootState) => state.socket);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showUserSearch, setShowUserSearch] = useState(false);

  useEffect(() => {
    fetchChats();
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on('new-message', (message: any) => {
        dispatch(addMessage(message));
      });

      socket.on('chat-created', () => {
        fetchChats();
      });

      return () => {
        socket.off('new-message');
        socket.off('chat-created');
      };
    }
  }, [socket, dispatch]);

  const fetchChats = async () => {
    try {
      const response = await api.get('/chat');
      dispatch(setChats(response.data.chats || []));
    } catch (error) {
      toast.error('Failed to load chats');
    } finally {
      setLoading(false);
    }
  };

  const handleChatSelect = (chat: any) => {
    dispatch(setActiveChat(chat));
    dispatch(toggleSidebar());
  };

  const handleUserSelect = async (user: any) => {
    // Find existing chat with this user
    const existingChat = chats.find((chat: any) => 
      chat.type === 'private' && 
      chat.participants.some((p: any) => p._id === user._id)
    );

    if (existingChat) {
      // Navigate to existing chat
      dispatch(setActiveChat(existingChat));
      navigate(`/chat/${existingChat._id}`);
    } else {
      // Refresh chats to get the newly created one
      await fetchChats();
      // Navigate to new chat (it should be at the top of the list now)
      const response = await api.get('/chat');
      const newChat = response.data.chats?.find((chat: any) => 
        chat.type === 'private' && 
        chat.participants.some((p: any) => p._id === user._id)
      );
      
      if (newChat) {
        dispatch(setActiveChat(newChat));
        navigate(`/chat/${newChat._id}`);
      }
    }
  };

  const getLastMessage = (chat: any) => {
    if (!chat.lastMessage) return 'No messages yet';
    return chat.lastMessage.content.length > 30 
      ? chat.lastMessage.content.substring(0, 30) + '...'
      : chat.lastMessage.content;
  };

  const formatTime = (date: string) => {
    const messageDate = new Date(date);
    const now = new Date();
    const diff = now.getTime() - messageDate.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (days === 1) {
      return 'Yesterday';
    } else if (days < 7) {
      return messageDate.toLocaleDateString([], { weekday: 'short' });
    } else {
      return messageDate.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  const getOtherParticipant = (chat: any) => {
    if (chat.type === 'group') return chat.name;
    return chat.participants.find((p: any) => p._id !== user?._id)?.username || 'Unknown';
  };

  const filteredChats = (Array.isArray(chats) ? chats : []).filter(chat =>
    getOtherParticipant(chat).toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col bg-white border-r border-gray-200">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-gray-900">Chats</h1>
          <div className="flex items-center space-x-2">
            {/* New Chat Button */}
            <button
              onClick={() => setShowUserSearch(true)}
              className="hidden sm:flex items-center space-x-2 px-3 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
              title="Start new chat"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>New Chat</span>
            </button>
            
            {/* Mobile New Chat Button */}
            <button
              onClick={() => setShowUserSearch(true)}
              className="sm:hidden p-2 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition-colors"
              title="Start new chat"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </button>
            
            {/* Mobile Menu Toggle */}
            <button
              onClick={() => dispatch(toggleSidebar())}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search chats..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
          <svg
            className="absolute left-3 top-2.5 w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        ) : filteredChats.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 text-gray-500">
            <svg className="w-12 h-12 mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <p className="text-sm">No chats found</p>
          </div>
        ) : (
          <AnimatePresence>
            {filteredChats.map((chat) => (
              <motion.div
                key={chat._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                whileHover={{ backgroundColor: '#f9fafb' }}
                className={`p-4 border-b border-gray-100 cursor-pointer transition-colors ${
                  activeChat?._id === chat._id ? 'bg-indigo-50 border-indigo-200' : ''
                }`}
                onClick={() => handleChatSelect(chat)}
              >
                <div className="flex items-center space-x-3">
                  {/* Avatar */}
                  <div className="relative">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center text-white font-medium">
                      {getOtherParticipant(chat).charAt(0).toUpperCase()}
                    </div>
                    {chat.type === 'private' && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 border-2 border-white rounded-full"></div>
                    )}
                  </div>

                  {/* Chat Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-gray-900 truncate">
                        {getOtherParticipant(chat)}
                      </h3>
                      {chat.lastMessage && (
                        <span className="text-xs text-gray-500">
                          {formatTime(chat.lastMessage.createdAt)}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 truncate">
                      {getLastMessage(chat)}
                    </p>
                  </div>

                  {/* Unread indicator */}
                  {(chat.unreadCount ?? 0) > 0 && (
                    <div className="w-5 h-5 bg-indigo-600 text-white text-xs rounded-full flex items-center justify-center">
                      {(chat.unreadCount ?? 0) > 9 ? '9+' : chat.unreadCount}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center text-white font-medium">
            {user?.username?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{user?.username}</p>
            <p className="text-xs text-gray-500">Online</p>
          </div>
          <Link
            to="/profile"
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </Link>
        </div>
      </div>

      {/* User Search Modal */}
      <UserSearchModal
        isOpen={showUserSearch}
        onClose={() => setShowUserSearch(false)}
        onUserSelect={handleUserSelect}
      />
    </div>
  );
};

export default Sidebar;
