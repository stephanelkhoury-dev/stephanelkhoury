"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const joi_1 = __importDefault(require("joi"));
const User_1 = require("../models/User");
const auth_1 = require("../middleware/auth");
const logger_1 = __importDefault(require("../utils/logger"));
const router = express_1.default.Router();
// Validation schemas
const updateProfileSchema = joi_1.default.object({
    username: joi_1.default.string().alphanum().min(3).max(30),
    statusMessage: joi_1.default.string().max(100),
    preferences: joi_1.default.object({
        theme: joi_1.default.string().valid('light', 'dark', 'auto'),
        notifications: joi_1.default.object({
            sound: joi_1.default.boolean(),
            desktop: joi_1.default.boolean(),
            email: joi_1.default.boolean()
        }),
        privacy: joi_1.default.object({
            showLastSeen: joi_1.default.boolean(),
            showOnlineStatus: joi_1.default.boolean()
        })
    })
});
// Get user profile
router.get('/profile', auth_1.authenticateToken, async (req, res) => {
    try {
        const authReq = req;
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
    }
    catch (error) {
        logger_1.default.error('Error fetching user profile:', error);
        res.status(500).json({ error: 'Failed to fetch profile' });
    }
});
// Update user profile
router.put('/profile', auth_1.authenticateToken, async (req, res) => {
    try {
        const { error, value } = updateProfileSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }
        const authReq = req;
        const userId = authReq.user._id;
        const { username, statusMessage, preferences } = value;
        // Check if username is already taken (if changing)
        if (username && username !== authReq.user.username) {
            const existingUser = await User_1.User.findOne({ username });
            if (existingUser) {
                return res.status(409).json({ error: 'Username already taken' });
            }
        }
        const updateData = {};
        if (username)
            updateData.username = username;
        if (statusMessage !== undefined)
            updateData.statusMessage = statusMessage;
        if (preferences) {
            updateData.preferences = { ...authReq.user.preferences, ...preferences };
        }
        const updatedUser = await User_1.User.findByIdAndUpdate(userId, updateData, { new: true }).select('-password');
        logger_1.default.info(`User profile updated: ${authReq.user.username}`);
        res.json({
            message: 'Profile updated successfully',
            user: updatedUser
        });
    }
    catch (error) {
        logger_1.default.error('Error updating user profile:', error);
        res.status(500).json({ error: 'Failed to update profile' });
    }
});
// Search users
router.get('/search', auth_1.authenticateToken, async (req, res) => {
    try {
        const { q } = req.query;
        if (!q || typeof q !== 'string' || q.trim().length < 2) {
            return res.status(400).json({ error: 'Query must be at least 2 characters long' });
        }
        const authReq = req;
        const query = q.trim();
        const users = await User_1.User.find({
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
    }
    catch (error) {
        logger_1.default.error('Error searching users:', error);
        res.status(500).json({ error: 'Failed to search users' });
    }
});
// Get user contacts
router.get('/contacts', auth_1.authenticateToken, async (req, res) => {
    try {
        const authReq = req;
        const user = await User_1.User.findById(authReq.user._id)
            .populate('contacts', 'username email avatar status lastSeen')
            .select('contacts');
        res.json({
            contacts: user?.contacts || []
        });
    }
    catch (error) {
        logger_1.default.error('Error fetching contacts:', error);
        res.status(500).json({ error: 'Failed to fetch contacts' });
    }
});
// Add contact
router.post('/contacts/:userId', auth_1.authenticateToken, async (req, res) => {
    try {
        const { userId } = req.params;
        const authReq = req;
        const currentUserId = authReq.user._id;
        if (userId === currentUserId.toString()) {
            return res.status(400).json({ error: 'Cannot add yourself as contact' });
        }
        // Check if user exists
        const targetUser = await User_1.User.findById(userId);
        if (!targetUser) {
            return res.status(404).json({ error: 'User not found' });
        }
        // Check if already in contacts
        if (authReq.user.contacts.includes(userId)) {
            return res.status(409).json({ error: 'User already in contacts' });
        }
        // Add to contacts
        await User_1.User.findByIdAndUpdate(currentUserId, {
            $addToSet: { contacts: userId }
        });
        // Optionally add current user to target user's contacts (mutual)
        await User_1.User.findByIdAndUpdate(userId, {
            $addToSet: { contacts: currentUserId }
        });
        logger_1.default.info(`Contact added: ${authReq.user.username} added ${targetUser.username}`);
        res.json({
            message: 'Contact added successfully',
            contact: {
                id: targetUser._id,
                username: targetUser.username,
                avatar: targetUser.avatar,
                status: targetUser.status
            }
        });
    }
    catch (error) {
        logger_1.default.error('Error adding contact:', error);
        res.status(500).json({ error: 'Failed to add contact' });
    }
});
// Remove contact
router.delete('/contacts/:userId', auth_1.authenticateToken, async (req, res) => {
    try {
        const { userId } = req.params;
        const authReq = req;
        const currentUserId = authReq.user._id;
        // Remove from contacts
        await User_1.User.findByIdAndUpdate(currentUserId, {
            $pull: { contacts: userId }
        });
        // Remove current user from target user's contacts
        await User_1.User.findByIdAndUpdate(userId, {
            $pull: { contacts: currentUserId }
        });
        logger_1.default.info(`Contact removed: ${authReq.user.username} removed ${userId}`);
        res.json({
            message: 'Contact removed successfully'
        });
    }
    catch (error) {
        logger_1.default.error('Error removing contact:', error);
        res.status(500).json({ error: 'Failed to remove contact' });
    }
});
// Block user
router.post('/block/:userId', auth_1.authenticateToken, async (req, res) => {
    try {
        const { userId } = req.params;
        const authReq = req;
        const currentUserId = authReq.user._id;
        if (userId === currentUserId.toString()) {
            return res.status(400).json({ error: 'Cannot block yourself' });
        }
        // Check if user exists
        const targetUser = await User_1.User.findById(userId);
        if (!targetUser) {
            return res.status(404).json({ error: 'User not found' });
        }
        // Add to blocked users
        await User_1.User.findByIdAndUpdate(currentUserId, {
            $addToSet: { blockedUsers: userId },
            $pull: { contacts: userId } // Remove from contacts if exists
        });
        logger_1.default.info(`User blocked: ${authReq.user.username} blocked ${targetUser.username}`);
        res.json({
            message: 'User blocked successfully'
        });
    }
    catch (error) {
        logger_1.default.error('Error blocking user:', error);
        res.status(500).json({ error: 'Failed to block user' });
    }
});
// Unblock user
router.delete('/block/:userId', auth_1.authenticateToken, async (req, res) => {
    try {
        const { userId } = req.params;
        const authReq = req;
        const currentUserId = authReq.user._id;
        // Remove from blocked users
        await User_1.User.findByIdAndUpdate(currentUserId, {
            $pull: { blockedUsers: userId }
        });
        logger_1.default.info(`User unblocked: ${authReq.user.username} unblocked ${userId}`);
        res.json({
            message: 'User unblocked successfully'
        });
    }
    catch (error) {
        logger_1.default.error('Error unblocking user:', error);
        res.status(500).json({ error: 'Failed to unblock user' });
    }
});
// Get blocked users
router.get('/blocked', auth_1.authenticateToken, async (req, res) => {
    try {
        const authReq = req;
        const user = await User_1.User.findById(authReq.user._id)
            .populate('blockedUsers', 'username email avatar')
            .select('blockedUsers');
        res.json({
            blockedUsers: user?.blockedUsers || []
        });
    }
    catch (error) {
        logger_1.default.error('Error fetching blocked users:', error);
        res.status(500).json({ error: 'Failed to fetch blocked users' });
    }
});
// Update user status
router.put('/status', auth_1.authenticateToken, async (req, res) => {
    try {
        const { status, statusMessage } = req.body;
        if (!['online', 'offline', 'away', 'busy', 'dnd'].includes(status)) {
            return res.status(400).json({ error: 'Invalid status' });
        }
        const updateData = { status, lastSeen: new Date() };
        if (statusMessage !== undefined) {
            updateData.statusMessage = statusMessage;
        }
        const authReq = req;
        await User_1.User.findByIdAndUpdate(authReq.user._id, updateData);
        logger_1.default.info(`User status updated: ${authReq.user.username} set to ${status}`);
        res.json({
            status,
            statusMessage: statusMessage || authReq.user.statusMessage
        });
    }
    catch (error) {
        logger_1.default.error('Error updating user status:', error);
        res.status(500).json({ error: 'Failed to update status' });
    }
});
exports.default = router;
//# sourceMappingURL=user.js.map