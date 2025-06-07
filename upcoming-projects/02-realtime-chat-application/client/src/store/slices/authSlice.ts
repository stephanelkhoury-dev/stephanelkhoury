import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface User {
  _id: string;
  id: string;
  username: string;
  email: string;
  bio?: string;
  avatar?: string;
  status: 'online' | 'offline' | 'away' | 'busy';
  statusMessage?: string;
  lastSeen: string;
  chatsCount?: number;
  messagesCount?: number;
  preferences: {
    theme: 'light' | 'dark' | 'auto';
    notifications: {
      sound: boolean;
      desktop: boolean;
      email: boolean;
    };
    privacy: {
      showLastSeen: boolean;
      showOnlineStatus: boolean;
    };
  };
  contacts: string[];
  createdAt: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  isLoading: true,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.error = null;
    },
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
      localStorage.setItem('token', action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
    updateUserStatus: (state, action: PayloadAction<{ status: string; lastSeen: string }>) => {
      if (state.user) {
        state.user.status = action.payload.status as any;
        state.user.lastSeen = action.payload.lastSeen;
      }
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.error = null;
      localStorage.removeItem('token');
    },
  },
});

export const {
  setUser,
  setToken,
  setLoading,
  setError,
  clearError,
  updateUser,
  updateUserStatus,
  logout,
} = authSlice.actions;

export default authSlice.reducer;
