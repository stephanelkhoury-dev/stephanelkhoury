import React from 'react';
import { motion } from 'framer-motion';

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void;
  onClose: () => void;
}

const EmojiPicker: React.FC<EmojiPickerProps> = ({ onEmojiSelect, onClose }) => {
  const emojiCategories = {
    'Smileys': ['😀', '😃', '😄', '😁', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚', '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🤩'],
    'Gestures': ['👍', '👎', '👏', '🙌', '👐', '🤲', '🤝', '🙏', '✍️', '👋', '🤚', '🖐️', '✋', '🖖', '👌', '🤏', '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆', '🖕', '👇', '☝️', '👍', '👎', '👊', '✊', '🤛', '🤜'],
    'Hearts': ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟'],
    'Objects': ['🎉', '🎊', '🎁', '🎈', '🎂', '🍰', '🧁', '🍕', '🍔', '🌭', '🥪', '🌮', '🌯', '🍜', '🍲', '🍛', '🍣', '🍱', '🥟', '🦪', '🍤', '🍙', '🍚', '🍘', '🍥', '🥠', '🥮', '🍢', '🍡'],
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: 10 }}
      className="absolute bottom-full right-0 mb-2 w-80 bg-white rounded-lg shadow-xl border z-50"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b">
        <h3 className="text-sm font-medium text-gray-900">Emojis</h3>
        <button
          onClick={onClose}
          className="p-1 text-gray-400 hover:text-gray-600 rounded transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Emoji grid */}
      <div className="max-h-64 overflow-y-auto p-3">
        {Object.entries(emojiCategories).map(([category, emojis]) => (
          <div key={category} className="mb-4">
            <h4 className="text-xs font-medium text-gray-500 mb-2">{category}</h4>
            <div className="grid grid-cols-8 gap-1">
              {emojis.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => onEmojiSelect(emoji)}
                  className="w-8 h-8 flex items-center justify-center text-lg hover:bg-gray-100 rounded transition-colors"
                  title={emoji}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default EmojiPicker;
