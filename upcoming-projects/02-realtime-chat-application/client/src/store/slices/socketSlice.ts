import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Socket } from 'socket.io-client';
import { io } from 'socket.io-client';

interface SocketState {
  socket: Socket | null;
  connected: boolean;
  error: string | null;
  activeUsers: Array<{
    id: string;
    username: string;
    status: string;
  }>;
  typingUsers: Array<{
    userId: string;
    username: string;
    chatId: string;
  }>;
}

const initialState: SocketState = {
  socket: null,
  connected: false,
  error: null,
  activeUsers: [],
  typingUsers: [],
};

const socketSlice = createSlice({
  name: 'socket',
  initialState,
  reducers: {
    setSocket: (state, action: PayloadAction<Socket>) => {
      state.socket = action.payload as any;
    },
    setConnected: (state, action: PayloadAction<boolean>) => {
      state.connected = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    setActiveUsers: (state, action: PayloadAction<SocketState['activeUsers']>) => {
      state.activeUsers = action.payload;
    },
    addTypingUser: (state, action: PayloadAction<{ userId: string; username: string; chatId: string }>) => {
      const existingIndex = state.typingUsers.findIndex(
        user => user.userId === action.payload.userId && user.chatId === action.payload.chatId
      );
      if (existingIndex === -1) {
        state.typingUsers.push(action.payload);
      }
    },
    removeTypingUser: (state, action: PayloadAction<{ userId: string; chatId: string }>) => {
      state.typingUsers = state.typingUsers.filter(
        user => !(user.userId === action.payload.userId && user.chatId === action.payload.chatId)
      );
    },
    clearTypingUsers: (state) => {
      state.typingUsers = [];
    },
    disconnect: (state) => {
      if (state.socket) {
        state.socket.disconnect();
      }
      state.socket = null;
      state.connected = false;
      state.activeUsers = [];
      state.typingUsers = [];
    },
  },
});

export const {
  setSocket,
  setConnected,
  setError,
  clearError,
  setActiveUsers,
  addTypingUser,
  removeTypingUser,
  clearTypingUsers,
  disconnect,
} = socketSlice.actions;

// Thunk for initializing socket connection
export const initializeSocket = (token: string) => (dispatch: any) => {
  try {
    const socket = io(process.env.REACT_APP_SERVER_URL || 'http://localhost:5050', {
      auth: {
        token,
      },
    });

    socket.on('connect', () => {
      setTimeout(() => {
        dispatch(setConnected(true));
        dispatch(clearError());
      }, 0);
    });

    socket.on('disconnect', () => {
      setTimeout(() => {
        dispatch(setConnected(false));
      }, 0);
    });

    socket.on('connect_error', (error) => {
      setTimeout(() => {
        dispatch(setError(error.message));
        dispatch(setConnected(false));
      }, 0);
    });

    socket.on('active-users', (users) => {
      setTimeout(() => {
        dispatch(setActiveUsers(users));
      }, 0);
    });

    socket.on('user-typing', (data) => {
      setTimeout(() => {
        dispatch(addTypingUser(data));
      }, 0);
    });

    socket.on('user-stopped-typing', (data) => {
      setTimeout(() => {
        dispatch(removeTypingUser(data));
      }, 0);
    });

    dispatch(setSocket(socket));
  } catch (error: any) {
    dispatch(setError(error.message));
  }
};

// Thunk for disconnecting socket
export const disconnectSocket = () => (dispatch: any) => {
  dispatch(disconnect());
};

export default socketSlice.reducer;
