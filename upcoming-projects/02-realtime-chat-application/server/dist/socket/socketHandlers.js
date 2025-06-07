"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleSocketConnection = void 0;
const Chat_1 = require("../models/Chat");
const Message_1 = require("../models/Message");
const User_1 = require("../models/User");
const logger_1 = __importDefault(require("../utils/logger"));
// Store active users and their socket connections
const activeUsers = new Map();
const userSockets = new Map();
const handleSocketConnection = (socket, io) => {
    const user = socket.data.user;
    const userId = socket.data.userId;
    logger_1.default.info(`User connected: ${user.username} (${userId})`);
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
    socket.on('join-chat', async (chatId) => {
        try {
            const chat = await Chat_1.Chat.findById(chatId);
            if (chat && chat.participants.includes(userId)) {
                socket.join(chatId);
                logger_1.default.info(`User ${user.username} joined chat ${chatId}`);
                // Notify other participants that user joined
                socket.to(chatId).emit('user-joined-chat', {
                    userId,
                    username: user.username,
                    chatId
                });
            }
        }
        catch (error) {
            logger_1.default.error('Error joining chat:', error);
        }
    });
    // Handle leaving a chat room
    socket.on('leave-chat', (chatId) => {
        socket.leave(chatId);
        socket.to(chatId).emit('user-left-chat', {
            userId,
            username: user.username,
            chatId
        });
        logger_1.default.info(`User ${user.username} left chat ${chatId}`);
    });
    // Handle sending messages
    socket.on('send-message', async (data) => {
        try {
            const { chatId, content, type = 'text', replyTo } = data;
            // Verify user is participant in the chat
            const chat = await Chat_1.Chat.findById(chatId);
            if (!chat || !chat.participants.includes(userId)) {
                socket.emit('error', { message: 'Not authorized to send message to this chat' });
                return;
            }
            // Create new message
            const message = new Message_1.Message({
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
                    username: message.sender.username,
                    avatar: message.sender.avatar
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
            logger_1.default.info(`Message sent by ${user.username} to chat ${chatId}`);
        }
        catch (error) {
            logger_1.default.error('Error sending message:', error);
            socket.emit('error', { message: 'Failed to send message' });
        }
    });
    // Handle typing indicators
    socket.on('typing-start', ({ chatId }) => {
        socket.to(chatId).emit('user-typing', {
            userId,
            username: user.username,
            chatId
        });
    });
    socket.on('typing-stop', ({ chatId }) => {
        socket.to(chatId).emit('user-stopped-typing', {
            userId,
            username: user.username,
            chatId
        });
    });
    // Handle message reactions
    socket.on('add-reaction', async (data) => {
        try {
            const { messageId, emoji } = data;
            const message = await Message_1.Message.findById(messageId);
            if (!message) {
                socket.emit('error', { message: 'Message not found' });
                return;
            }
            // Check if user is participant in the chat
            const chat = await Chat_1.Chat.findById(message.chat);
            if (!chat || !chat.participants.includes(userId)) {
                socket.emit('error', { message: 'Not authorized' });
                return;
            }
            // Add or update reaction
            const existingReaction = message.reactions.find(r => r.emoji === emoji);
            if (existingReaction) {
                if (!existingReaction.users.includes(userId)) {
                    existingReaction.users.push(userId);
                }
            }
            else {
                message.reactions.push({
                    emoji,
                    users: [userId]
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
        }
        catch (error) {
            logger_1.default.error('Error adding reaction:', error);
            socket.emit('error', { message: 'Failed to add reaction' });
        }
    });
    // Handle message read receipts
    socket.on('mark-messages-read', async (data) => {
        try {
            const { chatId, messageIds } = data;
            // Update read status for messages
            await Message_1.Message.updateMany({
                _id: { $in: messageIds },
                chat: chatId,
                'readBy.user': { $ne: userId }
            }, {
                $push: {
                    readBy: {
                        user: userId,
                        readAt: new Date()
                    }
                }
            });
            // Notify other participants about read receipts
            socket.to(chatId).emit('messages-read', {
                userId,
                username: user.username,
                messageIds,
                readAt: new Date()
            });
        }
        catch (error) {
            logger_1.default.error('Error marking messages as read:', error);
        }
    });
    // Handle user status updates
    socket.on('update-status', async (status) => {
        try {
            await updateUserStatus(userId, status);
            notifyUserStatusChange(socket, userId, status);
        }
        catch (error) {
            logger_1.default.error('Error updating user status:', error);
        }
    });
    // Handle disconnection
    socket.on('disconnect', async (reason) => {
        logger_1.default.info(`User disconnected: ${user.username} (${reason})`);
        // Remove from active users
        activeUsers.delete(userId);
        userSockets.delete(userId);
        // Update user status to offline
        await updateUserStatus(userId, 'offline');
        // Notify contacts that user is offline
        notifyUserStatusChange(socket, userId, 'offline');
    });
};
exports.handleSocketConnection = handleSocketConnection;
// Helper functions
async function joinUserChats(socket, userId) {
    try {
        const chats = await Chat_1.Chat.find({ participants: userId });
        chats.forEach(chat => {
            socket.join(chat._id.toString());
        });
        logger_1.default.info(`User joined ${chats.length} chat rooms`);
    }
    catch (error) {
        logger_1.default.error('Error joining user chats:', error);
    }
}
async function updateUserStatus(userId, status) {
    try {
        await User_1.User.findByIdAndUpdate(userId, {
            status,
            lastSeen: new Date()
        });
        // Update in active users map
        const activeUser = activeUsers.get(userId);
        if (activeUser) {
            activeUser.user.status = status;
        }
    }
    catch (error) {
        logger_1.default.error('Error updating user status:', error);
    }
}
function notifyUserStatusChange(socket, userId, status) {
    // Notify all contacts about status change
    socket.broadcast.emit('user-status-changed', {
        userId,
        status,
        lastSeen: new Date()
    });
}
function sendActiveUsersList(socket) {
    const activeUsersList = Array.from(activeUsers.values()).map(({ user }) => user);
    socket.emit('active-users', activeUsersList);
}
async function sendNotificationsToOfflineUsers(chat, message, senderId) {
    try {
        // Get offline participants
        const offlineParticipants = await User_1.User.find({
            _id: { $in: chat.participants, $ne: senderId },
            status: 'offline'
        });
        // Here you would implement push notifications, email notifications, etc.
        // For now, we'll just log the offline users
        if (offlineParticipants.length > 0) {
            logger_1.default.info(`Sending notifications to ${offlineParticipants.length} offline users`);
        }
    }
    catch (error) {
        logger_1.default.error('Error sending notifications to offline users:', error);
    }
}
//# sourceMappingURL=socketHandlers.js.map