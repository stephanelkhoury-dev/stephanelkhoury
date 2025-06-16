"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleSocketConnection = void 0;
const Chat_1 = require("../models/Chat");
const Message_1 = require("../models/Message");
const logger_1 = __importDefault(require("../utils/logger"));
const presenceService_1 = __importDefault(require("../services/presenceService"));
const messageStatusService_1 = __importDefault(require("../services/messageStatusService"));
const voiceNotesService_1 = __importDefault(require("../services/voiceNotesService"));
const gifService_1 = __importDefault(require("../services/gifService"));
// Initialize services
let presenceService;
let messageStatusService;
let voiceNotesService;
let gifService;
// Keep track of user rooms and typing status
const userRooms = new Map();
const typingUsers = new Map();
const handleSocketConnection = (socket, io) => {
    const user = socket.data.user;
    const userId = socket.data.userId;
    logger_1.default.info(`User connected: ${user.username} (${userId})`);
    // Initialize services if not already done
    if (!presenceService)
        presenceService = new presenceService_1.default(io);
    if (!messageStatusService)
        messageStatusService = new messageStatusService_1.default(io);
    if (!voiceNotesService)
        voiceNotesService = new voiceNotesService_1.default(io);
    if (!gifService)
        gifService = new gifService_1.default();
    // Initialize user's room set if not exists
    if (!userRooms.has(userId)) {
        userRooms.set(userId, new Set());
    }
    // Add user to presence service and mark messages as delivered
    presenceService.userConnected(socket, user);
    messageStatusService.markMessageAsSent(userId);
    socket.join(userId);
    // Handle chat room events
    socket.on('join-chat', async (chatId) => {
        try {
            const chat = await Chat_1.Chat.findById(chatId)
                .populate('participants', 'username avatar status');
            if (!chat) {
                socket.emit('error', { message: 'Chat not found' });
                return;
            }
            const chatDoc = chat;
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
            logger_1.default.info(`User ${user.username} joined chat ${chatId}`);
        }
        catch (error) {
            logger_1.default.error('Error joining chat:', error);
            socket.emit('error', { message: 'Failed to join chat' });
        }
    });
    // Handle sending messages
    socket.on('send-message', async (data) => {
        try {
            const { chatId, content, type = 'text' } = data;
            const message = await Message_1.Message.create({
                chat: chatId,
                sender: userId,
                content,
                type,
                sentAt: new Date(),
                deliveredTo: [],
                readBy: []
            });
            const messageDoc = message;
            await Chat_1.Chat.findByIdAndUpdate(chatId, {
                lastMessage: messageDoc._id,
                lastActivity: new Date()
            });
            const populatedMessage = await Message_1.Message.findById(messageDoc._id)
                .populate('sender', 'username avatar');
            io.to(chatId).emit('new-message', populatedMessage);
            messageStatusService.markMessageAsSent(messageDoc._id.toString());
            logger_1.default.info(`New message in chat ${chatId} from ${user.username}`);
        }
        catch (error) {
            logger_1.default.error('Error sending message:', error);
            socket.emit('error', { message: 'Failed to send message' });
        }
    });
    // Handle typing status
    socket.on('typing-start', (chatId) => {
        if (!typingUsers.has(chatId)) {
            typingUsers.set(chatId, new Set());
        }
        typingUsers.get(chatId)?.add(userId);
        socket.to(chatId).emit('typing-update', Array.from(typingUsers.get(chatId) || []));
    });
    socket.on('typing-stop', (chatId) => {
        typingUsers.get(chatId)?.delete(userId);
        socket.to(chatId).emit('typing-update', Array.from(typingUsers.get(chatId) || []));
    });
    // Handle voice notes
    socket.on('voice-note-start', (chatId) => {
        voiceNotesService.handleVoiceNoteStart(socket, chatId, userId);
    });
    socket.on('voice-note-stop', (chatId) => {
        voiceNotesService.handleVoiceNoteStop(socket, chatId, userId);
    });
    // Handle GIF search and sharing
    socket.on('gif-search', async (query) => {
        try {
            const results = await gifService.searchGifs(query);
            socket.emit('gif-results', results);
        }
        catch (error) {
            logger_1.default.error('Error searching GIFs:', error);
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
        logger_1.default.info(`User disconnected: ${user.username} (${userId})`);
    });
    // Join user to all their existing chats
    joinUserChats(socket, userId).catch(error => {
        logger_1.default.error('Error joining user chats:', error);
    });
};
exports.handleSocketConnection = handleSocketConnection;
// Helper function to join user to their chat rooms
async function joinUserChats(socket, userId) {
    try {
        const chats = await Chat_1.Chat.find({ participants: userId });
        chats.forEach(chat => {
            const chatDoc = chat;
            const chatId = chatDoc._id.toString();
            socket.join(chatId);
            userRooms.get(userId)?.add(chatId);
        });
    }
    catch (error) {
        logger_1.default.error('Error joining user chats:', error);
        throw error;
    }
}
//# sourceMappingURL=socketHandlers.js.map