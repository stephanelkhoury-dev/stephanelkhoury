import { Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';

export const socketAuth = async (socket: Socket, next: (err?: Error) => void) => {
  try {
    const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.split(' ')[1];

    if (!token) {
      return next(new Error('Authentication error: No token provided'));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any;
    
    const user = await User.findById(decoded.userId).select('-password');
    if (!user) {
      return next(new Error('Authentication error: User not found'));
    }

    // Attach user data to socket
    socket.data.user = user;
    socket.data.userId = (user._id as any).toString();

    next();
  } catch (error) {
    next(new Error('Authentication error: Invalid token'));
  }
};
