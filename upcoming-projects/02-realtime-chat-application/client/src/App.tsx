import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from './store/store';
import { setUser, setLoading } from './store/slices/authSlice';
import { initializeSocket, disconnectSocket } from './store/slices/socketSlice';
import api from './services/api';
import Layout from './components/Layout/Layout';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Chat from './pages/Chat/Chat';
import Profile from './pages/Profile/Profile';
import Settings from './pages/Settings/Settings';
import LoadingSpinner from './components/Common/LoadingSpinner';
import toast from 'react-hot-toast';

const App: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, isLoading } = useSelector((state: RootState) => state.auth);
  const { connected, socket } = useSelector((state: RootState) => state.socket);

  // Check authentication status and initialize socket
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await api.get('/auth/verify');
          dispatch(setUser(response.data.user));
          
          // Initialize socket connection if not already connected
          if (!connected || !socket) {
            dispatch(initializeSocket(token));
          }
        } catch (error) {
          localStorage.removeItem('token');
          if (connected) {
            dispatch(disconnectSocket());
          }
        }
      }
      dispatch(setLoading(false));
    };

    checkAuth();

    // Setup reconnection handling
    window.addEventListener('online', checkAuth);
    window.addEventListener('focus', checkAuth);

    return () => {
      window.removeEventListener('online', checkAuth);
      window.removeEventListener('focus', checkAuth);
      if (connected) {
        dispatch(disconnectSocket());
      }
    };
  }, [dispatch, connected, socket]);

  // Handle socket connection status
  useEffect(() => {
    if (socket) {
      socket.on('connect', () => {
        toast.success('Connected to chat server');
      });

      socket.on('disconnect', () => {
        toast.error('Lost connection to chat server');
      });

      socket.on('connect_error', (error: Error) => {
        toast.error(`Connection error: ${error.message}`);
        // Attempt to reconnect after a delay
        setTimeout(() => {
          if (user && !connected) {
            const token = localStorage.getItem('token');
            if (token) dispatch(initializeSocket(token));
          }
        }, 5000);
      });

      return () => {
        socket.off('connect');
        socket.off('disconnect');
        socket.off('connect_error');
      };
    }
  }, [socket, dispatch, user, connected]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  // If user is not authenticated, show auth routes
  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  // If user is authenticated, show main app
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/chat" replace />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/chat/:chatId" element={<Chat />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/login" element={<Navigate to="/chat" replace />} />
        <Route path="/register" element={<Navigate to="/chat" replace />} />
        <Route path="*" element={<Navigate to="/chat" replace />} />
      </Routes>
    </Layout>
  );
};

export default App;
