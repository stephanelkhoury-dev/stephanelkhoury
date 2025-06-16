import express, { Request, Response } from 'express';
import Joi from 'joi';
import { User } from '../models/User';
import { authenticateToken } from '../middleware/auth';
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
router.get('/profile', authenticateToken, async (req: Request, res: Response) => {
  try {
    const authReq = req as any;
    const user = authReq.user;
    
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
router.put('/profile', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { error, value } = updateProfileSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const authReq = req as any;
    const userId = authReq.user._id;
    const { username, statusMessage, preferences } = value;

    // Check if username is already taken (if changing)
    if (username && username !== authReq.user.username) {
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(409).json({ error: 'Username already taken' });
      }
    }

    const updateData: any = {};
    if (username) updateData.username = username;
    if (statusMessage !== undefined) updateData.statusMessage = statusMessage;
    if (preferences) {
      updateData.preferences = { ...authReq.user.preferences, ...preferences };
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true }).select('-password');

    logger.info(`User profile updated: ${authReq.user.username}`);

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
router.get('/search', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { q } = req.query;
    if (!q || typeof q !== 'string' || q.trim().length < 2) {
      return res.status(400).json({ error: 'Query must be at least 2 characters long' });
    }

    const authReq = req as any;
    const query = q.trim();
    const users = await User.find({
      $and: [
        { _id: { $ne: authReq.user._id } }, // Exclude current user
        { _id: { $nin: authReq.user.blockedUsers } }, // Exclude blocked users
        {
          $or: [
            { username: { $regex: query, $options: 'i' } },
            { email: { $regex: query, $options: 'i' } }
          ]
        }
      ]
    })
    .select('username email avatar status lastSeen')
    .limit(20);

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
router.get('/contacts', authenticateToken, async (req: Request, res: Response) => {
  try {
    const authReq = req as any;
    const user = await User.findById(authReq.user._id)
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
router.post('/contacts/:userId', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const authReq = req as any;
    const currentUserId = authReq.user._id;

    if (userId === currentUserId.toString()) {
      return res.status(400).json({ error: 'Cannot add yourself as contact' });
    }

    // Check if user exists
    const targetUser = await User.findById(userId);
    if (!targetUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if already in contacts
    if (authReq.user.contacts.includes(userId as any)) {
      return res.status(409).json({ error: 'User already in contacts' });
    }

    // Add to contacts
    await User.findByIdAndUpdate(currentUserId, {
      $addToSet: { contacts: userId }
    });

    // Optionally add current user to target user's contacts (mutual)
    await User.findByIdAndUpdate(userId, {
      $addToSet: { contacts: currentUserId }
    });

    logger.info(`Contact added: ${authReq.user.username} added ${targetUser.username}`);

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
router.delete('/contacts/:userId', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const authReq = req as any;
    const currentUserId = authReq.user._id;

    // Remove from contacts
    await User.findByIdAndUpdate(currentUserId, {
      $pull: { contacts: userId }
    });

    // Remove current user from target user's contacts
    await User.findByIdAndUpdate(userId, {
      $pull: { contacts: currentUserId }
    });

    logger.info(`Contact removed: ${authReq.user.username} removed ${userId}`);

    res.json({
      message: 'Contact removed successfully'
    });
  } catch (error) {
    logger.error('Error removing contact:', error);
    res.status(500).json({ error: 'Failed to remove contact' });
  }
});

// Block user
router.post('/block/:userId', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const authReq = req as any;
    const currentUserId = authReq.user._id;

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

    logger.info(`User blocked: ${authReq.user.username} blocked ${targetUser.username}`);

    res.json({
      message: 'User blocked successfully'
    });
  } catch (error) {
    logger.error('Error blocking user:', error);
    res.status(500).json({ error: 'Failed to block user' });
  }
});

// Unblock user
router.delete('/block/:userId', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const authReq = req as any;
    const currentUserId = authReq.user._id;

    // Remove from blocked users
    await User.findByIdAndUpdate(currentUserId, {
      $pull: { blockedUsers: userId }
    });

    logger.info(`User unblocked: ${authReq.user.username} unblocked ${userId}`);

    res.json({
      message: 'User unblocked successfully'
    });
  } catch (error) {
    logger.error('Error unblocking user:', error);
    res.status(500).json({ error: 'Failed to unblock user' });
  }
});

// Get blocked users
router.get('/blocked', authenticateToken, async (req: Request, res: Response) => {
  try {
    const authReq = req as any;
    const user = await User.findById(authReq.user._id)
      .populate('blockedUsers', 'username email avatar')
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
router.put('/status', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { status, statusMessage } = req.body;
    
    if (!['online', 'offline', 'away', 'busy', 'dnd'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const updateData: any = { status, lastSeen: new Date() };
    if (statusMessage !== undefined) {
      updateData.statusMessage = statusMessage;
    }

    const authReq = req as any;
    await User.findByIdAndUpdate(authReq.user._id, updateData);

    logger.info(`User status updated: ${authReq.user.username} set to ${status}`);

    res.json({
      status,
      statusMessage: statusMessage || authReq.user.statusMessage
    });
  } catch (error) {
    logger.error('Error updating user status:', error);
    res.status(500).json({ error: 'Failed to update status' });
  }
});

export default router;
