import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { RootState, useAppDispatch } from '../../store/store';
import { logout } from '../../store/slices/authSlice';
import { disconnectSocket } from '../../store/slices/socketSlice';
import { toggleSidebar } from '../../store/slices/uiSlice';
import toast from 'react-hot-toast';

const Header: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const { activeChat } = useSelector((state: RootState) => state.chat);
  const { connected } = useSelector((state: RootState) => state.socket);

  const handleLogout = () => {
    dispatch(disconnectSocket());
    dispatch(logout());
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const getOtherParticipant = (chat: any) => {
    if (chat.type === 'group') return chat.name;
    return chat.participants.find((p: any) => p._id !== user?._id)?.username || 'Unknown';
  };

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Mobile menu button */}
          <button
            onClick={() => dispatch(toggleSidebar())}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Chat info */}
          {activeChat ? (
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center text-white font-medium">
                {getOtherParticipant(activeChat).charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {getOtherParticipant(activeChat)}
                </h2>
                <p className="text-sm text-gray-500">
                  {activeChat.type === 'group' 
                    ? `${activeChat.participants.length} members`
                    : connected ? 'Online' : 'Offline'
                  }
                </p>
              </div>
            </div>
          ) : (
            <div>
              <h2 className="text-lg font-semibold text-gray-900">ChatApp</h2>
              <p className="text-sm text-gray-500">Select a chat to start messaging</p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2">
          {/* Connection status */}
          <motion.div
            initial={false}
            animate={{ scale: connected ? 1 : 0.8 }}
            className={`w-3 h-3 rounded-full ${connected ? 'bg-green-400' : 'bg-red-400'}`}
            title={connected ? 'Connected' : 'Disconnected'}
          />

          {/* Video call button */}
          {activeChat && (
            <button
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              title="Video call"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </button>
          )}

          {/* Audio call button */}
          {activeChat && (
            <button
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              title="Audio call"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </button>
          )}

          {/* More options dropdown */}
          <div className="relative">
            <button
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              title="More options"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
            </button>
          </div>

          {/* User menu */}
          <div className="relative">
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              title="Logout"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
