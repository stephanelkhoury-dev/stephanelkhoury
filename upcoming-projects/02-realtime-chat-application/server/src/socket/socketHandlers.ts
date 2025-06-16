import { Socket, Server } from 'socket.io';
import { Chat, IChat } from '../models/Chat';
import { Message, IMessage } from '../models/Message';
import { User, IUser } from '../models/User';
import logger from '../utils/logger';
import PresenceService from '../services/presenceService';
import MessageStatusService from '../services/messageStatusService';
import VoiceNotesService from '../services/voiceNotesService';
import GifService from '../services/gifService';
import mongoose from 'mongoose';

// Initialize services
let presenceService: PresenceService;
let messageStatusService: MessageStatusService;
let voiceNotesService: VoiceNotesService;
let gifService: GifService;

// Keep track of user rooms and typing status
const userRooms = new Map<string, Set<string>>();
const typingUsers = new Map<string, Set<string>>();

interface AuthenticatedSocket extends Socket {
  data: {
    user: IUser;
    userId: string;
  };
}

export const handleSocketConnection = (socket: AuthenticatedSocket, io: Server) => {
  const user = socket.data.user;
  const userId = socket.data.userId;

  logger.info(`User connected: ${user.username} (${userId})`);

  // Initialize services if not already done
  if (!presenceService) presenceService = new PresenceService(io);
  if (!messageStatusService) messageStatusService = new MessageStatusService(io);
  if (!voiceNotesService) voiceNotesService = new VoiceNotesService(io);
  if (!gifService) gifService = new GifService();

  // Initialize user's room set if not exists
  if (!userRooms.has(userId)) {
    userRooms.set(userId, new Set());
  }

  // Add user to presence service and mark messages as delivered
  presenceService.userConnected(socket, user);
  messageStatusService.markMessageAsSent(userId);
  socket.join(userId);

  // Handle chat room events
  socket.on('join-chat', async (chatId: string) => {
    try {
      const chat = await Chat.findById(chatId)
        .populate('participants', 'username avatar status');
      
      if (!chat) {
        socket.emit('error', { message: 'Chat not found' });
        return;
      }

      const chatDoc = chat as IChat & { _id: mongoose.Types.ObjectId };
      if (!chatDoc.participants.some(p => p._id.toString() === userId)) {
        socket.emit('error', { message: 'Not authorized to join this chat' });
        return;
      }

      socket.join(chatId);
      userRooms.get(userId)?.add(chatId);
      
      // Notify others that user joined
      socket.to(chatId).emit('user-joined', {
        chatId,
        user: { _id: userId, username: user.username }
      });

      logger.info(`User ${user.username} joined chat ${chatId}`);
    } catch (error) {
      logger.error('Error joining chat:', error);
      socket.emit('error', { message: 'Failed to join chat' });
    }
  });

  // Handle sending messages
  socket.on('send-message', async (data: { chatId: string; content: string; type?: string }) => {
    try {
      const { chatId, content, type = 'text' } = data;

      const message = await Message.create({
        chat: chatId,
        sender: userId,
        content,
        type,
        sentAt: new Date(),
        deliveredTo: [],
        readBy: []
      });

      const messageDoc = message as IMessage & { _id: mongoose.Types.ObjectId };

      await Chat.findByIdAndUpdate(chatId, {
        lastMessage: messageDoc._id,
        lastActivity: new Date()
      });

      const populatedMessage = await Message.findById(messageDoc._id)
        .populate('sender', 'username avatar');

      io.to(chatId).emit('new-message', populatedMessage);
      messageStatusService.markMessageAsSent(messageDoc._id.toString());

      logger.info(`New message in chat ${chatId} from ${user.username}`);
    } catch (error) {
      logger.error('Error sending message:', error);
      socket.emit('error', { message: 'Failed to send message' });
    }
  });

  // Handle typing status
  socket.on('typing-start', (chatId: string) => {
    if (!typingUsers.has(chatId)) {
      typingUsers.set(chatId, new Set());
    }
    typingUsers.get(chatId)?.add(userId);
    socket.to(chatId).emit('typing-update', Array.from(typingUsers.get(chatId) || []));
  });

  socket.on('typing-stop', (chatId: string) => {
    typingUsers.get(chatId)?.delete(userId);
    socket.to(chatId).emit('typing-update', Array.from(typingUsers.get(chatId) || []));
  });

  // Handle voice notes
  socket.on('voice-note-start', (chatId: string) => {
    voiceNotesService.handleVoiceNoteStart(socket, chatId, userId);
  });

  socket.on('voice-note-stop', (chatId: string) => {
    voiceNotesService.handleVoiceNoteStop(socket, chatId, userId);
  });

  // Handle GIF search and sharing
  socket.on('gif-search', async (query: string) => {
    try {
      const results = await gifService.searchGifs(query);
      socket.emit('gif-results', results);
    } catch (error) {
      logger.error('Error searching GIFs:', error);
      socket.emit('error', { message: 'Failed to search GIFs' });
    }
  });

  // Handle disconnection
  socket.on('disconnect', async () => {
    await presenceService.updateUserStatus(userId, 'offline');
    
    // Clear user from typing indicators
    userRooms.get(userId)?.forEach(chatId => {
      typingUsers.get(chatId)?.delete(userId);
      socket.to(chatId).emit('typing-update', Array.from(typingUsers.get(chatId) || []));
    });
    
    userRooms.delete(userId);
    logger.info(`User disconnected: ${user.username} (${userId})`);
  });

  // Join user to all their existing chats
  joinUserChats(socket, userId).catch(error => {
    logger.error('Error joining user chats:', error);
  });
};

// Helper function to join user to their chat rooms
async function joinUserChats(socket: Socket, userId: string): Promise<void> {
  try {
    const chats = await Chat.find({ participants: userId });
    chats.forEach(chat => {
      const chatDoc = chat as IChat & { _id: mongoose.Types.ObjectId };
      const chatId = chatDoc._id.toString();
      socket.join(chatId);
      userRooms.get(userId)?.add(chatId);
    });
  } catch (error) {
    logger.error('Error joining user chats:', error);
    throw error;
  }
}
