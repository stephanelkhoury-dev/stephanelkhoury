import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Message {
  _id: string;
  id: string;
  chatId: string;
  sender: {
    _id: string;
    id: string;
    username: string;
    avatar?: string;
  };
  content: string;
  type: 'text' | 'image' | 'file' | 'system';
  file?: {
    url: string;
    filename: string;
    mimetype: string;
    size: number;
  };
  replyTo?: {
    id: string;
    content: string;
    sender: string;
  };
  reactions: Array<{
    emoji: string;
    users: string[];
  }>;
  readBy: Array<{
    user: string;
    readAt: string;
  }>;
  createdAt: string;
  editedAt?: string;
  isDeleted: boolean;
}

export interface Chat {
  _id: string;
  id: string;
  type: 'private' | 'group';
  name?: string;
  description?: string;
  avatar?: string;
  participants: Array<{
    _id: string;
    id: string;
    username: string;
    avatar?: string;
    status: string;
    lastSeen: string;
  }>;
  admins: string[];
  lastMessage?: Message;
  unreadCount?: number;
  lastActivity: string;
  settings: {
    allowMessagesFrom: 'everyone' | 'contacts' | 'admins';
    allowMediaSharing: boolean;
    allowFileSharing: boolean;
    muteNotifications: boolean;
  };
  createdBy: string;
  createdAt: string;
}

interface ChatState {
  chats: Chat[];
  activeChat: Chat | null;
  messages: { [chatId: string]: Message[] };
  isLoading: boolean;
  isLoadingMessages: boolean;
  error: string | null;
  searchResults: Chat[];
  isSearching: boolean;
}

const initialState: ChatState = {
  chats: [],
  activeChat: null,
  messages: {},
  isLoading: false,
  isLoadingMessages: false,
  error: null,
  searchResults: [],
  isSearching: false,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setChats: (state, action: PayloadAction<Chat[]>) => {
      state.chats = action.payload;
      state.isLoading = false;
    },
    addChat: (state, action: PayloadAction<Chat>) => {
      state.chats.unshift(action.payload);
    },
    updateChat: (state, action: PayloadAction<Partial<Chat> & { id: string }>) => {
      const index = state.chats.findIndex(chat => chat.id === action.payload.id);
      if (index !== -1) {
        state.chats[index] = { ...state.chats[index], ...action.payload };
      }
      if (state.activeChat && state.activeChat.id === action.payload.id) {
        state.activeChat = { ...state.activeChat, ...action.payload };
      }
    },
    removeChat: (state, action: PayloadAction<string>) => {
      state.chats = state.chats.filter(chat => chat.id !== action.payload);
      if (state.activeChat && state.activeChat.id === action.payload) {
        state.activeChat = null;
      }
    },
    setActiveChat: (state, action: PayloadAction<Chat | null>) => {
      state.activeChat = action.payload;
    },
    setMessages: (state, action: PayloadAction<{ chatId: string; messages: Message[] }>) => {
      state.messages[action.payload.chatId] = action.payload.messages;
      state.isLoadingMessages = false;
    },
    addMessage: (state, action: PayloadAction<Message>) => {
      const { chatId } = action.payload;
      if (!state.messages[chatId]) {
        state.messages[chatId] = [];
      }
      state.messages[chatId].push(action.payload);
      
      // Update chat's last message and move to top
      const chatIndex = state.chats.findIndex(chat => chat.id === chatId);
      if (chatIndex !== -1) {
        const chat = state.chats[chatIndex];
        chat.lastMessage = action.payload;
        chat.lastActivity = action.payload.createdAt;
        
        // Move chat to top
        state.chats.splice(chatIndex, 1);
        state.chats.unshift(chat);
      }
    },
    updateMessage: (state, action: PayloadAction<Message>) => {
      const { chatId } = action.payload;
      if (state.messages[chatId]) {
        const index = state.messages[chatId].findIndex(msg => msg.id === action.payload.id);
        if (index !== -1) {
          state.messages[chatId][index] = action.payload;
        }
      }
    },
    removeMessage: (state, action: PayloadAction<{ chatId: string; messageId: string }>) => {
      const { chatId, messageId } = action.payload;
      if (state.messages[chatId]) {
        state.messages[chatId] = state.messages[chatId].filter(msg => msg.id !== messageId);
      }
    },
    markMessagesAsRead: (state, action: PayloadAction<{ chatId: string; messageIds: string[]; userId: string }>) => {
      const { chatId, messageIds, userId } = action.payload;
      if (state.messages[chatId]) {
        state.messages[chatId].forEach(message => {
          if (messageIds.includes(message.id)) {
            const existingRead = message.readBy.find(r => r.user === userId);
            if (!existingRead) {
              message.readBy.push({
                user: userId,
                readAt: new Date().toISOString(),
              });
            }
          }
        });
      }
    },
    addMessageReaction: (state, action: PayloadAction<{ messageId: string; emoji: string; userId: string; chatId: string }>) => {
      const { messageId, emoji, userId, chatId } = action.payload;
      if (state.messages[chatId]) {
        const message = state.messages[chatId].find(msg => msg.id === messageId);
        if (message) {
          const existingReaction = message.reactions.find(r => r.emoji === emoji);
          if (existingReaction) {
            if (!existingReaction.users.includes(userId)) {
              existingReaction.users.push(userId);
            }
          } else {
            message.reactions.push({
              emoji,
              users: [userId],
            });
          }
        }
      }
    },
    removeMessageReaction: (state, action: PayloadAction<{ messageId: string; emoji: string; userId: string; chatId: string }>) => {
      const { messageId, emoji, userId, chatId } = action.payload;
      if (state.messages[chatId]) {
        const message = state.messages[chatId].find(msg => msg.id === messageId);
        if (message) {
          const reaction = message.reactions.find(r => r.emoji === emoji);
          if (reaction) {
            reaction.users = reaction.users.filter(u => u !== userId);
            if (reaction.users.length === 0) {
              message.reactions = message.reactions.filter(r => r.emoji !== emoji);
            }
          }
        }
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setLoadingMessages: (state, action: PayloadAction<boolean>) => {
      state.isLoadingMessages = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
      state.isLoadingMessages = false;
    },
    clearError: (state) => {
      state.error = null;
    },
    setSearchResults: (state, action: PayloadAction<Chat[]>) => {
      state.searchResults = action.payload;
      state.isSearching = false;
    },
    setSearching: (state, action: PayloadAction<boolean>) => {
      state.isSearching = action.payload;
    },
    clearSearchResults: (state) => {
      state.searchResults = [];
      state.isSearching = false;
    },
  },
});

export const {
  setChats,
  addChat,
  updateChat,
  removeChat,
  setActiveChat,
  setMessages,
  addMessage,
  updateMessage,
  removeMessage,
  markMessagesAsRead,
  addMessageReaction,
  removeMessageReaction,
  setLoading,
  setLoadingMessages,
  setError,
  clearError,
  setSearchResults,
  setSearching,
  clearSearchResults,
} = chatSlice.actions;

export default chatSlice.reducer;
