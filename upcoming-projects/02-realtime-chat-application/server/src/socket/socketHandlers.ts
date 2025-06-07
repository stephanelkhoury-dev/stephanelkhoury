import { Socket, Server } from 'socket.io';
import { Chat } from '../models/Chat';
import { Message } from '../models/Message';
import { User } from '../models/User';
import logger from '../utils/logger';

interface SocketUser {
  id: string;
  username: string;
  status: string;
}

// Store active users and their socket connections
const activeUsers = new Map<string, { socketId: string; user: SocketUser }>();
const userSockets = new Map<string, Socket>();

export const handleSocketConnection = (socket: Socket, io: Server) => {
  const user = socket.data.user;
  const userId = socket.data.userId;

  logger.info(`User connected: ${user.username} (${userId})`);

  // Store user connection
  activeUsers.set(userId, {
    socketId: socket.id,
    user: {
      id: userId,
      username: user.username,
      status: user.status
    }
  });
  userSockets.set(userId, socket);

  // Update user status to online
  updateUserStatus(userId, 'online');

  // Join user to their personal room
  socket.join(userId);

  // Join user to all their chat rooms
  joinUserChats(socket, userId);

  // Notify contacts that user is online
  notifyUserStatusChange(socket, userId, 'online');

  // Send active users list to the connected user
  sendActiveUsersList(socket);

  // Handle joining a chat room
  socket.on('join-chat', async (chatId: string) => {
    try {
      const chat = await Chat.findById(chatId);
      if (chat && chat.participants.includes(userId as any)) {
        socket.join(chatId);
        logger.info(`User ${user.username} joined chat ${chatId}`);
        
        // Notify other participants that user joined
        socket.to(chatId).emit('user-joined-chat', {
          userId,
          username: user.username,
          chatId
        });
      }
    } catch (error) {
      logger.error('Error joining chat:', error);
    }
  });

  // Handle leaving a chat room
  socket.on('leave-chat', (chatId: string) => {
    socket.leave(chatId);
    socket.to(chatId).emit('user-left-chat', {
      userId,
      username: user.username,
      chatId
    });
    logger.info(`User ${user.username} left chat ${chatId}`);
  });

  // Handle sending messages
  socket.on('send-message', async (data: {
    chatId: string;
    content: string;
    type?: 'text' | 'image' | 'file';
    replyTo?: string;
  }) => {
    try {
      const { chatId, content, type = 'text', replyTo } = data;

      // Verify user is participant in the chat
      const chat = await Chat.findById(chatId);
      if (!chat || !chat.participants.includes(userId as any)) {
        socket.emit('error', { message: 'Not authorized to send message to this chat' });
        return;
      }

      // Create new message
      const message = new Message({
        chat: chatId,
        sender: userId,
        content,
        type,
        replyTo: replyTo || undefined
      });

      await message.save();

      // Populate sender info
      await message.populate('sender', 'username avatar');
      if (replyTo) {
        await message.populate('replyTo', 'content sender');
      }

      // Send message to all participants in the chat
      io.to(chatId).emit('new-message', {
        id: message._id,
        chatId: message.chat,
        sender: {
          id: message.sender._id,
          username: (message.sender as any).username,
          avatar: (message.sender as any).avatar
        },
        content: message.content,
        type: message.type,
        replyTo: message.replyTo,
        createdAt: message.createdAt,
        reactions: message.reactions,
        readBy: message.readBy
      });

      // Send push notifications to offline users
      await sendNotificationsToOfflineUsers(chat, message, userId);

      logger.info(`Message sent by ${user.username} to chat ${chatId}`);
    } catch (error) {
      logger.error('Error sending message:', error);
      socket.emit('error', { message: 'Failed to send message' });
    }
  });

  // Handle typing indicators
  socket.on('typing-start', ({ chatId }: { chatId: string }) => {
    socket.to(chatId).emit('user-typing', {
      userId,
      username: user.username,
      chatId
    });
  });

  socket.on('typing-stop', ({ chatId }: { chatId: string }) => {
    socket.to(chatId).emit('user-stopped-typing', {
      userId,
      username: user.username,
      chatId
    });
  });

  // Handle message reactions
  socket.on('add-reaction', async (data: {
    messageId: string;
    emoji: string;
  }) => {
    try {
      const { messageId, emoji } = data;
      const message = await Message.findById(messageId);
      
      if (!message) {
        socket.emit('error', { message: 'Message not found' });
        return;
      }

      // Check if user is participant in the chat
      const chat = await Chat.findById(message.chat);
      if (!chat || !chat.participants.includes(userId as any)) {
        socket.emit('error', { message: 'Not authorized' });
        return;
      }

      // Add or update reaction
      const existingReaction = message.reactions.find(r => r.emoji === emoji);
      
      if (existingReaction) {
        if (!existingReaction.users.includes(userId as any)) {
          existingReaction.users.push(userId as any);
        }
      } else {
        message.reactions.push({
          emoji,
          users: [userId as any]
        });
      }

      await message.save();

      // Broadcast reaction update to chat participants
      io.to(message.chat.toString()).emit('reaction-added', {
        messageId,
        emoji,
        userId,
        username: user.username
      });

    } catch (error) {
      logger.error('Error adding reaction:', error);
      socket.emit('error', { message: 'Failed to add reaction' });
    }
  });

  // Handle message read receipts
  socket.on('mark-messages-read', async (data: {
    chatId: string;
    messageIds: string[];
  }) => {
    try {
      const { chatId, messageIds } = data;

      // Update read status for messages
      await Message.updateMany(
        {
          _id: { $in: messageIds },
          chat: chatId,
          'readBy.user': { $ne: userId }
        },
        {
          $push: {
            readBy: {
              user: userId,
              readAt: new Date()
            }
          }
        }
      );

      // Notify other participants about read receipts
      socket.to(chatId).emit('messages-read', {
        userId,
        username: user.username,
        messageIds,
        readAt: new Date()
      });

    } catch (error) {
      logger.error('Error marking messages as read:', error);
    }
  });

  // Handle user status updates
  socket.on('update-status', async (status: 'online' | 'away' | 'busy' | 'offline') => {
    try {
      await updateUserStatus(userId, status);
      notifyUserStatusChange(socket, userId, status);
    } catch (error) {
      logger.error('Error updating user status:', error);
    }
  });

  // Handle disconnection
  socket.on('disconnect', async (reason) => {
    logger.info(`User disconnected: ${user.username} (${reason})`);
    
    // Remove from active users
    activeUsers.delete(userId);
    userSockets.delete(userId);

    // Update user status to offline
    await updateUserStatus(userId, 'offline');

    // Notify contacts that user is offline
    notifyUserStatusChange(socket, userId, 'offline');
  });
};

// Helper functions
async function joinUserChats(socket: Socket, userId: string) {
  try {
    const chats = await Chat.find({ participants: userId });
    chats.forEach(chat => {
      socket.join((chat._id as any).toString());
    });
    logger.info(`User joined ${chats.length} chat rooms`);
  } catch (error) {
    logger.error('Error joining user chats:', error);
  }
}

async function updateUserStatus(userId: string, status: string) {
  try {
    await User.findByIdAndUpdate(userId, {
      status,
      lastSeen: new Date()
    });
    
    // Update in active users map
    const activeUser = activeUsers.get(userId);
    if (activeUser) {
      activeUser.user.status = status;
    }
  } catch (error) {
    logger.error('Error updating user status:', error);
  }
}

function notifyUserStatusChange(socket: Socket, userId: string, status: string) {
  // Notify all contacts about status change
  socket.broadcast.emit('user-status-changed', {
    userId,
    status,
    lastSeen: new Date()
  });
}

function sendActiveUsersList(socket: Socket) {
  const activeUsersList = Array.from(activeUsers.values()).map(({ user }) => user);
  socket.emit('active-users', activeUsersList);
}

async function sendNotificationsToOfflineUsers(chat: any, message: any, senderId: string) {
  try {
    // Get offline participants
    const offlineParticipants = await User.find({
      _id: { $in: chat.participants, $ne: senderId },
      status: 'offline'
    });

    // Here you would implement push notifications, email notifications, etc.
    // For now, we'll just log the offline users
    if (offlineParticipants.length > 0) {
      logger.info(`Sending notifications to ${offlineParticipants.length} offline users`);
    }
  } catch (error) {
    logger.error('Error sending notifications to offline users:', error);
  }
}
