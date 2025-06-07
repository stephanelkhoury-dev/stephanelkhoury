import express from 'express';
import Joi from 'joi';
import { Chat } from '../models/Chat';
import { Message } from '../models/Message';
import { User } from '../models/User';
import { AuthRequest } from '../middleware/auth';
import logger from '../utils/logger';

const router = express.Router();

// Validation schemas
const createChatSchema = Joi.object({
  type: Joi.string().valid('private', 'group').required(),
  name: Joi.string().max(50).when('type', { is: 'group', then: Joi.required() }),
  description: Joi.string().max(200),
  participants: Joi.array().items(Joi.string()).min(1).required()
});

const sendMessageSchema = Joi.object({
  content: Joi.string().max(5000).required(),
  type: Joi.string().valid('text', 'image', 'file').default('text'),
  replyTo: Joi.string()
});

// Get all chats for the authenticated user
router.get('/', async (req: AuthRequest, res) => {
  try {
    const userId = req.user._id;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    const chats = await Chat.find({ participants: userId })
      .populate('participants', 'username avatar status lastSeen')
      .populate('lastMessage')
      .populate('createdBy', 'username')
      .sort({ lastActivity: -1 })
      .skip(skip)
      .limit(limit);

    const totalChats = await Chat.countDocuments({ participants: userId });

    res.json({
      chats,
      pagination: {
        page,
        limit,
        total: totalChats,
        pages: Math.ceil(totalChats / limit)
      }
    });
  } catch (error) {
    logger.error('Error fetching chats:', error);
    res.status(500).json({ error: 'Failed to fetch chats' });
  }
});

// Get a specific chat
router.get('/:chatId', async (req: AuthRequest, res) => {
  try {
    const { chatId } = req.params;
    const userId = req.user._id;

    const chat = await Chat.findOne({
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
  } catch (error) {
    logger.error('Error fetching chat:', error);
    res.status(500).json({ error: 'Failed to fetch chat' });
  }
});

// Create a new chat
router.post('/', async (req: AuthRequest, res) => {
  try {
    const { error } = createChatSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { type, name, description, participants } = req.body;
    const userId = req.user._id;

    // Validate participants exist
    const participantUsers = await User.find({ _id: { $in: participants } });
    if (participantUsers.length !== participants.length) {
      return res.status(400).json({ error: 'Some participants not found' });
    }

    // For private chats, ensure only 2 participants
    if (type === 'private' && participants.length !== 1) {
      return res.status(400).json({ error: 'Private chat must have exactly 2 participants' });
    }

    // Check if private chat already exists
    if (type === 'private') {
      const existingChat = await Chat.findOne({
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

    const chat = new Chat({
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

    logger.info(`New ${type} chat created by ${req.user.username}: ${chat._id}`);

    res.status(201).json({
      message: 'Chat created successfully',
      chat
    });
  } catch (error) {
    logger.error('Error creating chat:', error);
    res.status(500).json({ error: 'Failed to create chat' });
  }
});

// Get messages for a chat
router.get('/:chatId/messages', async (req: AuthRequest, res) => {
  try {
    const { chatId } = req.params;
    const userId = req.user._id;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;
    const skip = (page - 1) * limit;

    // Verify user is participant in the chat
    const chat = await Chat.findOne({
      _id: chatId,
      participants: userId
    });

    if (!chat) {
      return res.status(404).json({ error: 'Chat not found' });
    }

    const messages = await Message.find({ 
      chat: chatId,
      isDeleted: false
    })
      .populate('sender', 'username avatar')
      .populate('replyTo', 'content sender')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalMessages = await Message.countDocuments({ 
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
  } catch (error) {
    logger.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// Send a message to a chat
router.post('/:chatId/messages', async (req: AuthRequest, res) => {
  try {
    const { error } = sendMessageSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { chatId } = req.params;
    const { content, type, replyTo } = req.body;
    const userId = req.user._id;

    // Verify user is participant in the chat
    const chat = await Chat.findOne({
      _id: chatId,
      participants: userId
    });

    if (!chat) {
      return res.status(404).json({ error: 'Chat not found' });
    }

    // Create message
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

    logger.info(`Message sent by ${req.user.username} to chat ${chatId}`);

    res.status(201).json({
      message: 'Message sent successfully',
      data: message
    });
  } catch (error) {
    logger.error('Error sending message:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// Update chat settings
router.put('/:chatId', async (req: AuthRequest, res) => {
  try {
    const { chatId } = req.params;
    const userId = req.user._id;
    const { name, description, settings } = req.body;

    // Find chat and verify user is admin (for group chats) or participant (for private chats)
    const chat = await Chat.findById(chatId);
    
    if (!chat) {
      return res.status(404).json({ error: 'Chat not found' });
    }

    if (!chat.participants.includes(userId as any)) {
      return res.status(403).json({ error: 'Not a participant in this chat' });
    }

    // For group chats, only admins can update
    if (chat.type === 'group' && !chat.admins.includes(userId as any)) {
      return res.status(403).json({ error: 'Only admins can update group chat settings' });
    }

    // Update allowed fields
    if (name !== undefined) chat.name = name;
    if (description !== undefined) chat.description = description;
    if (settings !== undefined) {
      Object.assign(chat.settings, settings);
    }

    await chat.save();

    logger.info(`Chat ${chatId} updated by ${req.user.username}`);

    res.json({
      message: 'Chat updated successfully',
      chat
    });
  } catch (error) {
    logger.error('Error updating chat:', error);
    res.status(500).json({ error: 'Failed to update chat' });
  }
});

// Add participants to group chat
router.post('/:chatId/participants', async (req: AuthRequest, res) => {
  try {
    const { chatId } = req.params;
    const { participants } = req.body;
    const userId = req.user._id;

    if (!Array.isArray(participants) || participants.length === 0) {
      return res.status(400).json({ error: 'Participants array is required' });
    }

    const chat = await Chat.findById(chatId);
    
    if (!chat) {
      return res.status(404).json({ error: 'Chat not found' });
    }

    if (chat.type !== 'group') {
      return res.status(400).json({ error: 'Can only add participants to group chats' });
    }

    if (!chat.admins.includes(userId as any)) {
      return res.status(403).json({ error: 'Only admins can add participants' });
    }

    // Validate new participants exist
    const newParticipants = await User.find({ _id: { $in: participants } });
    if (newParticipants.length !== participants.length) {
      return res.status(400).json({ error: 'Some participants not found' });
    }

    // Add new participants (avoid duplicates)
    const uniqueParticipants = participants.filter(p => !chat.participants.includes(p));
    chat.participants.push(...uniqueParticipants);
    
    await chat.save();

    logger.info(`${uniqueParticipants.length} participants added to chat ${chatId} by ${req.user.username}`);

    res.json({
      message: 'Participants added successfully',
      addedCount: uniqueParticipants.length
    });
  } catch (error) {
    logger.error('Error adding participants:', error);
    res.status(500).json({ error: 'Failed to add participants' });
  }
});

// Remove participant from group chat
router.delete('/:chatId/participants/:participantId', async (req: AuthRequest, res) => {
  try {
    const { chatId, participantId } = req.params;
    const userId = req.user._id;

    const chat = await Chat.findById(chatId);
    
    if (!chat) {
      return res.status(404).json({ error: 'Chat not found' });
    }

    if (chat.type !== 'group') {
      return res.status(400).json({ error: 'Can only remove participants from group chats' });
    }

    // Allow users to remove themselves or admins to remove others
    const isAdmin = chat.admins.includes(userId as any);
    const isSelfRemoval = participantId === userId.toString();

    if (!isAdmin && !isSelfRemoval) {
      return res.status(403).json({ error: 'Only admins can remove other participants' });
    }

    // Remove participant
    chat.participants = chat.participants.filter(p => p.toString() !== participantId);
    chat.admins = chat.admins.filter(a => a.toString() !== participantId);

    await chat.save();

    logger.info(`Participant ${participantId} removed from chat ${chatId} by ${req.user.username}`);

    res.json({
      message: 'Participant removed successfully'
    });
  } catch (error) {
    logger.error('Error removing participant:', error);
    res.status(500).json({ error: 'Failed to remove participant' });
  }
});

// Delete a chat
router.delete('/:chatId', async (req: AuthRequest, res) => {
  try {
    const { chatId } = req.params;
    const userId = req.user._id;

    const chat = await Chat.findById(chatId);
    
    if (!chat) {
      return res.status(404).json({ error: 'Chat not found' });
    }

    // Only creator or admin can delete group chats
    // Any participant can delete private chats
    if (chat.type === 'group') {
      if (!chat.admins.includes(userId as any) && chat.createdBy.toString() !== userId.toString()) {
        return res.status(403).json({ error: 'Only admins can delete group chats' });
      }
    } else {
      if (!chat.participants.includes(userId as any)) {
        return res.status(403).json({ error: 'Not authorized to delete this chat' });
      }
    }

    // Delete all messages in the chat
    await Message.deleteMany({ chat: chatId });
    
    // Delete the chat
    await Chat.findByIdAndDelete(chatId);

    logger.info(`Chat ${chatId} deleted by ${req.user.username}`);

    res.json({
      message: 'Chat deleted successfully'
    });
  } catch (error) {
    logger.error('Error deleting chat:', error);
    res.status(500).json({ error: 'Failed to delete chat' });
  }
});

export default router;
