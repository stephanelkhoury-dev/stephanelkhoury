import express from 'express';
import Joi from 'joi';
import { User } from '../models/User';
import { AuthRequest } from '../middleware/auth';
import logger from '../utils/logger';

const router = express.Router();

// Validation schemas
const updateProfileSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30),
  statusMessage: Joi.string().max(100),
  preferences: Joi.object({
    theme: Joi.string().valid('light', 'dark', 'auto'),
    notifications: Joi.object({
      sound: Joi.boolean(),
      desktop: Joi.boolean(),
      email: Joi.boolean()
    }),
    privacy: Joi.object({
      showLastSeen: Joi.boolean(),
      showOnlineStatus: Joi.boolean()
    })
  })
});

// Get user profile
router.get('/profile', async (req: AuthRequest, res) => {
  try {
    const user = req.user;
    
    res.json({
      id: user._id,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
      status: user.status,
      statusMessage: user.statusMessage,
      lastSeen: user.lastSeen,
      preferences: user.preferences,
      contacts: user.contacts,
      createdAt: user.createdAt
    });
  } catch (error) {
    logger.error('Error fetching user profile:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Update user profile
router.put('/profile', async (req: AuthRequest, res) => {
  try {
    const { error } = updateProfileSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const userId = req.user._id;
    const { username, statusMessage, preferences } = req.body;

    // Check if username is taken (if being updated)
    if (username && username !== req.user.username) {
      const existingUser = await User.findOne({ username });
      if (existingUser && (existingUser._id as any).toString() !== userId.toString()) {
        return res.status(400).json({ error: 'Username already taken' });
      }
    }

    // Build update object
    const updateData: any = {};
    if (username) updateData.username = username;
    if (statusMessage !== undefined) updateData.statusMessage = statusMessage;
    if (preferences) {
      updateData.preferences = { ...req.user.preferences, ...preferences };
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true }
    ).select('-password');

    logger.info(`User profile updated: ${req.user.username}`);

    res.json({
      message: 'Profile updated successfully',
      user: updatedUser
    });
  } catch (error) {
    logger.error('Error updating user profile:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Search users
router.get('/search', async (req: AuthRequest, res) => {
  try {
    const { q, limit = 10 } = req.query;
    
    if (!q || typeof q !== 'string' || q.length < 2) {
      return res.status(400).json({ error: 'Search query must be at least 2 characters' });
    }

    const searchRegex = new RegExp(q, 'i');
    const users = await User.find({
      $and: [
        { _id: { $ne: req.user._id } }, // Exclude current user
        { _id: { $nin: req.user.blockedUsers } }, // Exclude blocked users
        {
          $or: [
            { username: searchRegex },
            { email: searchRegex }
          ]
        }
      ]
    })
    .select('username email avatar status lastSeen')
    .limit(parseInt(limit as string));

    res.json({
      users,
      count: users.length
    });
  } catch (error) {
    logger.error('Error searching users:', error);
    res.status(500).json({ error: 'Failed to search users' });
  }
});

// Get user contacts
router.get('/contacts', async (req: AuthRequest, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('contacts', 'username email avatar status lastSeen')
      .select('contacts');

    res.json({
      contacts: user?.contacts || []
    });
  } catch (error) {
    logger.error('Error fetching contacts:', error);
    res.status(500).json({ error: 'Failed to fetch contacts' });
  }
});

// Add contact
router.post('/contacts/:userId', async (req: AuthRequest, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user._id;

    if (userId === currentUserId.toString()) {
      return res.status(400).json({ error: 'Cannot add yourself as contact' });
    }

    // Check if user exists
    const targetUser = await User.findById(userId);
    if (!targetUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if already in contacts
    if (req.user.contacts.includes(userId as any)) {
      return res.status(400).json({ error: 'User already in contacts' });
    }

    // Add to contacts
    await User.findByIdAndUpdate(currentUserId, {
      $addToSet: { contacts: userId }
    });

    // Optionally add current user to target user's contacts (mutual)
    await User.findByIdAndUpdate(userId, {
      $addToSet: { contacts: currentUserId }
    });

    logger.info(`Contact added: ${req.user.username} added ${targetUser.username}`);

    res.json({
      message: 'Contact added successfully',
      contact: {
        id: targetUser._id,
        username: targetUser.username,
        avatar: targetUser.avatar,
        status: targetUser.status
      }
    });
  } catch (error) {
    logger.error('Error adding contact:', error);
    res.status(500).json({ error: 'Failed to add contact' });
  }
});

// Remove contact
router.delete('/contacts/:userId', async (req: AuthRequest, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user._id;

    // Remove from contacts
    await User.findByIdAndUpdate(currentUserId, {
      $pull: { contacts: userId }
    });

    // Remove current user from target user's contacts
    await User.findByIdAndUpdate(userId, {
      $pull: { contacts: currentUserId }
    });

    logger.info(`Contact removed: ${req.user.username} removed ${userId}`);

    res.json({
      message: 'Contact removed successfully'
    });
  } catch (error) {
    logger.error('Error removing contact:', error);
    res.status(500).json({ error: 'Failed to remove contact' });
  }
});

// Block user
router.post('/block/:userId', async (req: AuthRequest, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user._id;

    if (userId === currentUserId.toString()) {
      return res.status(400).json({ error: 'Cannot block yourself' });
    }

    // Check if user exists
    const targetUser = await User.findById(userId);
    if (!targetUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Add to blocked users
    await User.findByIdAndUpdate(currentUserId, {
      $addToSet: { blockedUsers: userId },
      $pull: { contacts: userId } // Remove from contacts if exists
    });

    logger.info(`User blocked: ${req.user.username} blocked ${targetUser.username}`);

    res.json({
      message: 'User blocked successfully'
    });
  } catch (error) {
    logger.error('Error blocking user:', error);
    res.status(500).json({ error: 'Failed to block user' });
  }
});

// Unblock user
router.delete('/block/:userId', async (req: AuthRequest, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user._id;

    // Remove from blocked users
    await User.findByIdAndUpdate(currentUserId, {
      $pull: { blockedUsers: userId }
    });

    logger.info(`User unblocked: ${req.user.username} unblocked ${userId}`);

    res.json({
      message: 'User unblocked successfully'
    });
  } catch (error) {
    logger.error('Error unblocking user:', error);
    res.status(500).json({ error: 'Failed to unblock user' });
  }
});

// Get blocked users
router.get('/blocked', async (req: AuthRequest, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('blockedUsers', 'username avatar')
      .select('blockedUsers');

    res.json({
      blockedUsers: user?.blockedUsers || []
    });
  } catch (error) {
    logger.error('Error fetching blocked users:', error);
    res.status(500).json({ error: 'Failed to fetch blocked users' });
  }
});

// Update user status
router.put('/status', async (req: AuthRequest, res) => {
  try {
    const { status, statusMessage } = req.body;
    
    if (!['online', 'away', 'busy', 'offline'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const updateData: any = { status, lastSeen: new Date() };
    if (statusMessage !== undefined) {
      updateData.statusMessage = statusMessage;
    }

    await User.findByIdAndUpdate(req.user._id, updateData);

    logger.info(`User status updated: ${req.user.username} set to ${status}`);

    res.json({
      message: 'Status updated successfully',
      status,
      statusMessage: statusMessage || req.user.statusMessage
    });
  } catch (error) {
    logger.error('Error updating user status:', error);
    res.status(500).json({ error: 'Failed to update status' });
  }
});

export default router;
