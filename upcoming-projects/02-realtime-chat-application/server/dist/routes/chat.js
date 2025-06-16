"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const joi_1 = __importDefault(require("joi"));
const Chat_1 = require("../models/Chat");
const Message_1 = require("../models/Message");
const User_1 = require("../models/User");
const auth_1 = require("../middleware/auth");
const logger_1 = __importDefault(require("../utils/logger"));
const router = express_1.default.Router();
// Validation schemas
const createChatSchema = joi_1.default.object({
    type: joi_1.default.string().valid('private', 'group').required(),
    name: joi_1.default.string().max(50).when('type', { is: 'group', then: joi_1.default.required() }),
    description: joi_1.default.string().max(200),
    participants: joi_1.default.array().items(joi_1.default.string()).min(1).required()
});
const sendMessageSchema = joi_1.default.object({
    content: joi_1.default.string().max(5000).required(),
    type: joi_1.default.string().valid('text', 'image', 'file').default('text'),
    replyTo: joi_1.default.string()
});
// Get all chats for the authenticated user
router.get('/', auth_1.authenticateToken, async (req, res) => {
    try {
        const authReq = req;
        const userId = authReq.user._id;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;
        const chats = await Chat_1.Chat.find({ participants: userId })
            .populate('participants', 'username avatar status lastSeen')
            .populate('lastMessage')
            .populate('createdBy', 'username')
            .sort({ lastActivity: -1 })
            .skip(skip)
            .limit(limit);
        const totalChats = await Chat_1.Chat.countDocuments({ participants: userId });
        res.json({
            chats,
            pagination: {
                page,
                limit,
                total: totalChats,
                pages: Math.ceil(totalChats / limit)
            }
        });
    }
    catch (error) {
        logger_1.default.error('Error fetching chats:', error);
        res.status(500).json({ error: 'Failed to fetch chats' });
    }
});
// Get a specific chat by ID
router.get('/:chatId', auth_1.authenticateToken, async (req, res) => {
    try {
        const authReq = req;
        const userId = authReq.user._id;
        const { chatId } = req.params;
        const chat = await Chat_1.Chat.findOne({
            _id: chatId,
            participants: userId
        })
            .populate('participants', 'username avatar status lastSeen')
            .populate('admins', 'username')
            .populate('createdBy', 'username')
            .populate('lastMessage');
        if (!chat) {
            return res.status(404).json({ error: 'Chat not found' });
        }
        res.json(chat);
    }
    catch (error) {
        logger_1.default.error('Error fetching chat:', error);
        res.status(500).json({ error: 'Failed to fetch chat' });
    }
});
// Create a new chat
router.post('/', auth_1.authenticateToken, async (req, res) => {
    try {
        const { error, value } = createChatSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }
        const authReq = req;
        const userId = authReq.user._id;
        const { type, name, description, participants } = value;
        // Validate participants exist
        const participantUsers = await User_1.User.find({ _id: { $in: participants } });
        if (participantUsers.length !== participants.length) {
            return res.status(400).json({ error: 'Some participants not found' });
        }
        // For private chats, ensure only 2 participants
        if (type === 'private' && participants.length !== 1) {
            return res.status(400).json({ error: 'Private chat must have exactly 2 participants' });
        }
        // Check if private chat already exists
        if (type === 'private') {
            const existingChat = await Chat_1.Chat.findOne({
                type: 'private',
                participants: { $all: [userId, participants[0]], $size: 2 }
            });
            if (existingChat) {
                return res.status(400).json({ error: 'Private chat already exists' });
            }
        }
        // Create chat
        const chatParticipants = type === 'private'
            ? [userId, participants[0]]
            : [...participants, userId];
        const chat = new Chat_1.Chat({
            type,
            name,
            description,
            participants: chatParticipants,
            createdBy: userId,
            admins: type === 'group' ? [userId] : []
        });
        await chat.save();
        // Populate the chat data
        await chat.populate('participants', 'username avatar status');
        await chat.populate('createdBy', 'username');
        logger_1.default.info(`New ${type} chat created by ${authReq.user.username}: ${chat._id}`);
        res.status(201).json({
            message: 'Chat created successfully',
            chat
        });
    }
    catch (error) {
        logger_1.default.error('Error creating chat:', error);
        res.status(500).json({ error: 'Failed to create chat' });
    }
});
// Get messages for a specific chat
router.get('/:chatId/messages', auth_1.authenticateToken, async (req, res) => {
    try {
        const authReq = req;
        const userId = authReq.user._id;
        const { chatId } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 50;
        const skip = (page - 1) * limit;
        // Verify user is participant in the chat
        const chat = await Chat_1.Chat.findOne({
            _id: chatId,
            participants: userId
        });
        if (!chat) {
            return res.status(404).json({ error: 'Chat not found' });
        }
        const messages = await Message_1.Message.find({
            chat: chatId,
            isDeleted: false
        })
            .populate('sender', 'username avatar')
            .populate('replyTo', 'content sender')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);
        const totalMessages = await Message_1.Message.countDocuments({
            chat: chatId,
            isDeleted: false
        });
        res.json({
            messages: messages.reverse(), // Reverse to show oldest first
            pagination: {
                page,
                limit,
                total: totalMessages,
                pages: Math.ceil(totalMessages / limit)
            }
        });
    }
    catch (error) {
        logger_1.default.error('Error fetching messages:', error);
        res.status(500).json({ error: 'Failed to fetch messages' });
    }
});
// Send a message to a chat
router.post('/:chatId/messages', auth_1.authenticateToken, async (req, res) => {
    try {
        const { error, value } = sendMessageSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }
        const authReq = req;
        const userId = authReq.user._id;
        const { chatId } = req.params;
        const { content, type, replyTo } = value;
        // Verify user is participant in the chat
        const chat = await Chat_1.Chat.findOne({
            _id: chatId,
            participants: userId
        });
        if (!chat) {
            return res.status(404).json({ error: 'Chat not found' });
        }
        // Create message
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
        logger_1.default.info(`Message sent by ${authReq.user.username} to chat ${chatId}`);
        res.status(201).json({
            message: 'Message sent successfully',
            data: message
        });
    }
    catch (error) {
        logger_1.default.error('Error sending message:', error);
        res.status(500).json({ error: 'Failed to send message' });
    }
});
// Update chat information
router.put('/:chatId', auth_1.authenticateToken, async (req, res) => {
    try {
        const authReq = req;
        const userId = authReq.user._id;
        const { chatId } = req.params;
        const { name, description } = req.body;
        // Find chat and verify user is admin (for group chats) or participant (for private chats)
        const chat = await Chat_1.Chat.findById(chatId);
        if (!chat) {
            return res.status(404).json({ error: 'Chat not found' });
        }
        if (!chat.participants.includes(userId)) {
            return res.status(403).json({ error: 'Not a participant in this chat' });
        }
        // For group chats, only admins can update
        if (chat.type === 'group' && !chat.admins.includes(userId)) {
            return res.status(403).json({ error: 'Only admins can update group chat settings' });
        }
        // Update allowed fields
        if (name !== undefined)
            chat.name = name;
        if (description !== undefined)
            chat.description = description;
        await chat.save();
        logger_1.default.info(`Chat ${chatId} updated by ${authReq.user.username}`);
        res.json({
            message: 'Chat updated successfully',
            chat
        });
    }
    catch (error) {
        logger_1.default.error('Error updating chat:', error);
        res.status(500).json({ error: 'Failed to update chat' });
    }
});
// Add participants to a chat
router.post('/:chatId/participants', auth_1.authenticateToken, async (req, res) => {
    try {
        const { participants } = req.body;
        const authReq = req;
        const userId = authReq.user._id;
        const { chatId } = req.params;
        if (!Array.isArray(participants) || participants.length === 0) {
            return res.status(400).json({ error: 'Participants array is required' });
        }
        const chat = await Chat_1.Chat.findById(chatId);
        if (!chat) {
            return res.status(404).json({ error: 'Chat not found' });
        }
        if (chat.type !== 'group') {
            return res.status(400).json({ error: 'Can only add participants to group chats' });
        }
        if (!chat.admins.includes(userId)) {
            return res.status(403).json({ error: 'Only admins can add participants' });
        }
        // Validate new participants exist
        const newParticipants = await User_1.User.find({ _id: { $in: participants } });
        if (newParticipants.length !== participants.length) {
            return res.status(400).json({ error: 'Some participants not found' });
        }
        // Add new participants (avoid duplicates)
        const uniqueParticipants = participants.filter(p => !chat.participants.includes(p));
        chat.participants.push(...uniqueParticipants);
        await chat.save();
        logger_1.default.info(`${uniqueParticipants.length} participants added to chat ${chatId} by ${authReq.user.username}`);
        res.json({
            message: 'Participants added successfully',
            addedCount: uniqueParticipants.length
        });
    }
    catch (error) {
        logger_1.default.error('Error adding participants:', error);
        res.status(500).json({ error: 'Failed to add participants' });
    }
});
// Remove a participant from a chat
router.delete('/:chatId/participants/:participantId', auth_1.authenticateToken, async (req, res) => {
    try {
        const authReq = req;
        const userId = authReq.user._id;
        const { chatId, participantId } = req.params;
        const chat = await Chat_1.Chat.findById(chatId);
        if (!chat) {
            return res.status(404).json({ error: 'Chat not found' });
        }
        if (chat.type !== 'group') {
            return res.status(400).json({ error: 'Can only remove participants from group chats' });
        }
        // Allow users to remove themselves or admins to remove others
        const isAdmin = chat.admins.includes(userId);
        const isSelfRemoval = participantId === userId.toString();
        if (!isAdmin && !isSelfRemoval) {
            return res.status(403).json({ error: 'Only admins can remove other participants' });
        }
        // Remove participant
        chat.participants = chat.participants.filter(p => p.toString() !== participantId);
        chat.admins = chat.admins.filter(a => a.toString() !== participantId);
        await chat.save();
        logger_1.default.info(`Participant ${participantId} removed from chat ${chatId} by ${authReq.user.username}`);
        res.json({
            message: 'Participant removed successfully'
        });
    }
    catch (error) {
        logger_1.default.error('Error removing participant:', error);
        res.status(500).json({ error: 'Failed to remove participant' });
    }
});
// Delete a chat
router.delete('/:chatId', auth_1.authenticateToken, async (req, res) => {
    try {
        const authReq = req;
        const userId = authReq.user._id;
        const { chatId } = req.params;
        const chat = await Chat_1.Chat.findById(chatId);
        if (!chat) {
            return res.status(404).json({ error: 'Chat not found' });
        }
        // Only creator or admin can delete group chats
        // Any participant can delete private chats
        if (chat.type === 'group') {
            if (!chat.admins.includes(userId) && chat.createdBy.toString() !== userId.toString()) {
                return res.status(403).json({ error: 'Only admins can delete group chats' });
            }
        }
        else {
            if (!chat.participants.includes(userId)) {
                return res.status(403).json({ error: 'Not authorized to delete this chat' });
            }
        }
        // Delete all messages in the chat
        await Message_1.Message.deleteMany({ chat: chatId });
        // Delete the chat
        await Chat_1.Chat.findByIdAndDelete(chatId);
        logger_1.default.info(`Chat ${chatId} deleted by ${authReq.user.username}`);
        res.json({
            message: 'Chat deleted successfully'
        });
    }
    catch (error) {
        logger_1.default.error('Error deleting chat:', error);
        res.status(500).json({ error: 'Failed to delete chat' });
    }
});
exports.default = router;
//# sourceMappingURL=chat.js.map