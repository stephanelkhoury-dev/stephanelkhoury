import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  theme: 'light' | 'dark' | 'auto';
  sidebarOpen: boolean;
  settingsOpen: boolean;
  profileOpen: boolean;
  emojiPickerOpen: boolean;
  fileUploadModalOpen: boolean;
  selectedChatId: string | null;
  notifications: Array<{
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message: string;
    timestamp: string;
  }>;
  isOnline: boolean;
}

const initialState: UIState = {
  theme: (localStorage.getItem('theme') as any) || 'light',
  sidebarOpen: true,
  settingsOpen: false,
  profileOpen: false,
  emojiPickerOpen: false,
  fileUploadModalOpen: false,
  selectedChatId: null,
  notifications: [],
  isOnline: navigator.onLine,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<'light' | 'dark' | 'auto'>) => {
      state.theme = action.payload;
      localStorage.setItem('theme', action.payload);
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },
    setSettingsOpen: (state, action: PayloadAction<boolean>) => {
      state.settingsOpen = action.payload;
    },
    setProfileOpen: (state, action: PayloadAction<boolean>) => {
      state.profileOpen = action.payload;
    },
    setEmojiPickerOpen: (state, action: PayloadAction<boolean>) => {
      state.emojiPickerOpen = action.payload;
    },
    setFileUploadModalOpen: (state, action: PayloadAction<boolean>) => {
      state.fileUploadModalOpen = action.payload;
    },
    setSelectedChatId: (state, action: PayloadAction<string | null>) => {
      state.selectedChatId = action.payload;
    },
    addNotification: (state, action: PayloadAction<Omit<UIState['notifications'][0], 'id' | 'timestamp'>>) => {
      const notification = {
        ...action.payload,
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
      };
      state.notifications.unshift(notification);
      
      // Keep only the last 10 notifications
      if (state.notifications.length > 10) {
        state.notifications = state.notifications.slice(0, 10);
      }
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(n => n.id !== action.payload);
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
    setOnlineStatus: (state, action: PayloadAction<boolean>) => {
      state.isOnline = action.payload;
    },
  },
});

export const {
  setTheme,
  toggleSidebar,
  setSidebarOpen,
  setSettingsOpen,
  setProfileOpen,
  setEmojiPickerOpen,
  setFileUploadModalOpen,
  setSelectedChatId,
  addNotification,
  removeNotification,
  clearNotifications,
  setOnlineStatus,
} = uiSlice.actions;

export default uiSlice.reducer;
