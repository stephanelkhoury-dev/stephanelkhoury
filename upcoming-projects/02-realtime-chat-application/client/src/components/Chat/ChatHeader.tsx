import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { RootState } from '../../store/store';

const ChatHeader: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const { activeChat } = useSelector((state: RootState) => state.chat);
  const [showInfo, setShowInfo] = useState(false);

  if (!activeChat) return null;

  const getOtherParticipant = () => {
    if (activeChat.type === 'group') return activeChat.name;
    return activeChat.participants.find((p: any) => p._id !== user?._id)?.username || 'Unknown';
  };

  const getParticipantStatus = () => {
    if (activeChat.type === 'group') {
      return `${activeChat.participants.length} members`;
    }
    const otherParticipant = activeChat.participants.find((p: any) => p._id !== user?._id);
    return otherParticipant?.status || 'offline';
  };

  return (
    <div className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between">
        <div 
          className="flex items-center space-x-3 cursor-pointer"
          onClick={() => setShowInfo(!showInfo)}
        >
          <div className="relative">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center text-white font-medium">
              {getOtherParticipant()?.charAt(0)?.toUpperCase() || '?'}
            </div>
            {activeChat.type === 'private' && (
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></div>
            )}
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900">{getOtherParticipant()}</h3>
            <p className="text-sm text-gray-500">{getParticipantStatus()}</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            title="Search in chat"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>

          <button
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            title="More options"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Chat Info Panel */}
      <AnimatePresence>
        {showInfo && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 pt-4 border-t border-gray-200"
          >
            <div className="space-y-3">
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">
                  {activeChat.type === 'group' ? 'Group Members' : 'Participant'}
                </h4>
                <div className="space-y-2">
                  {activeChat.participants.map((participant: any) => (
                    <div key={participant._id} className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                        {participant.username.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {participant.username}
                          {participant._id === user?._id && (
                            <span className="text-gray-500 ml-1">(You)</span>
                          )}
                        </p>
                        <p className="text-xs text-gray-500">{participant.email}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {activeChat.type === 'group' && (
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Actions</h4>
                  <div className="flex space-x-2">
                    <button className="px-3 py-1 text-xs bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200 transition-colors">
                      Add Member
                    </button>
                    <button className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors">
                      Leave Group
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChatHeader;
