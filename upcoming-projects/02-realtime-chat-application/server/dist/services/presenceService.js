"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = require("../models/User");
const logger_1 = __importDefault(require("../utils/logger"));
class PresenceService {
    constructor(io) {
        this.io = io;
        this.activeUsers = new Map();
        this.typingIndicators = new Map();
        this.userSockets = new Map();
        this.awayTimeout = new Map();
        this.typingTimeouts = new Map();
    }
    // User Connection Management
    async userConnected(socket, user) {
        const userId = user._id.toString();
        // Store user connection
        this.activeUsers.set(userId, {
            id: userId,
            username: user.username,
            status: 'online',
            lastSeen: new Date()
        });
        this.userSockets.set(userId, socket);
        // Update user status in database
        await this.updateUserStatus(userId, 'online');
        // Clear any existing away timeout
        this.clearAwayTimeout(userId);
        // Set up activity tracking
        this.setupActivityTracking(socket, userId);
        // Broadcast user online status
        this.broadcastPresenceUpdate(userId, 'online');
        // Send current active users to the connected user
        this.sendActiveUsers(socket);
        logger_1.default.info(`User ${user.username} connected - online status updated`);
    }
    async userDisconnected(userId, username) {
        // Remove from active users
        this.activeUsers.delete(userId);
        this.userSockets.delete(userId);
        // Clear any typing indicators
        this.clearUserTyping(userId);
        // Clear timeouts
        this.clearAwayTimeout(userId);
        this.clearTypingTimeouts(userId);
        // Update status to offline
        await this.updateUserStatus(userId, 'offline');
        // Broadcast user offline status
        this.broadcastPresenceUpdate(userId, 'offline');
        logger_1.default.info(`User ${username} disconnected - offline status updated`);
    }
    // Typing Indicators
    startTyping(userId, username, chatId) {
        const key = `${userId}-${chatId}`;
        // Clear existing timeout for this user-chat combination
        if (this.typingTimeouts.has(key)) {
            clearTimeout(this.typingTimeouts.get(key));
        }
        // Store typing indicator
        this.typingIndicators.set(key, {
            userId,
            username,
            chatId,
            startedAt: new Date()
        });
        // Broadcast to chat participants (except sender)
        this.io.to(chatId).except(this.userSockets.get(userId)?.id || '').emit('user-typing', {
            userId,
            username,
            chatId,
            startedAt: new Date()
        });
        // Auto-stop typing after 3 seconds of inactivity
        const timeout = setTimeout(() => {
            this.stopTyping(userId, chatId);
        }, 3000);
        this.typingTimeouts.set(key, timeout);
        logger_1.default.debug(`User ${username} started typing in chat ${chatId}`);
    }
    stopTyping(userId, chatId) {
        const key = `${userId}-${chatId}`;
        // Remove typing indicator
        this.typingIndicators.delete(key);
        // Clear timeout
        if (this.typingTimeouts.has(key)) {
            clearTimeout(this.typingTimeouts.get(key));
            this.typingTimeouts.delete(key);
        }
        // Broadcast to chat participants
        this.io.to(chatId).except(this.userSockets.get(userId)?.id || '').emit('user-stopped-typing', {
            userId,
            chatId
        });
        logger_1.default.debug(`User ${userId} stopped typing in chat ${chatId}`);
    }
    // Status Management
    async updateStatus(userId, status) {
        const user = this.activeUsers.get(userId);
        if (user) {
            user.status = status;
            user.lastSeen = new Date();
        }
        // Update in database
        await this.updateUserStatus(userId, status);
        // Broadcast status change
        this.broadcastPresenceUpdate(userId, status);
        // Handle away timeout logic
        if (status === 'online') {
            this.clearAwayTimeout(userId);
            this.setAwayTimeout(userId);
        }
        else if (status === 'away') {
            this.clearAwayTimeout(userId);
        }
        logger_1.default.info(`User ${userId} status updated to ${status}`);
    }
    // Activity Tracking
    setupActivityTracking(socket, userId) {
        // Track various user activities to reset away timer
        const activities = ['send-message', 'join-chat', 'typing-start', 'mark-messages-read'];
        activities.forEach(event => {
            socket.on(event, () => {
                this.updateActivity(userId);
            });
        });
        // Set initial away timeout
        this.setAwayTimeout(userId);
    }
    updateActivity(userId) {
        const user = this.activeUsers.get(userId);
        if (user && user.status === 'online') {
            user.lastSeen = new Date();
            // Reset away timeout
            this.clearAwayTimeout(userId);
            this.setAwayTimeout(userId);
        }
    }
    setAwayTimeout(userId) {
        const timeout = setTimeout(async () => {
            const user = this.activeUsers.get(userId);
            if (user && user.status === 'online') {
                await this.updateStatus(userId, 'away');
            }
        }, 5 * 60 * 1000); // 5 minutes
        this.awayTimeout.set(userId, timeout);
    }
    clearAwayTimeout(userId) {
        if (this.awayTimeout.has(userId)) {
            clearTimeout(this.awayTimeout.get(userId));
            this.awayTimeout.delete(userId);
        }
    }
    // Utility Methods
    async updateUserStatus(userId, status) {
        try {
            await User_1.User.findByIdAndUpdate(userId, {
                status,
                lastSeen: new Date()
            });
        }
        catch (error) {
            logger_1.default.error('Error updating user status in database:', error);
        }
    }
    broadcastPresenceUpdate(userId, status) {
        const user = this.activeUsers.get(userId);
        this.io.emit('user-presence-changed', {
            userId,
            status,
            lastSeen: user?.lastSeen || new Date(),
            username: user?.username
        });
    }
    sendActiveUsers(socket) {
        const activeUsersList = Array.from(this.activeUsers.values()).map(user => ({
            id: user.id,
            username: user.username,
            status: user.status,
            lastSeen: user.lastSeen
        }));
        socket.emit('active-users-list', activeUsersList);
    }
    clearUserTyping(userId) {
        // Find and clear all typing indicators for this user
        const userTypingKeys = Array.from(this.typingIndicators.keys())
            .filter(key => key.startsWith(userId + '-'));
        userTypingKeys.forEach(key => {
            const indicator = this.typingIndicators.get(key);
            if (indicator) {
                this.stopTyping(userId, indicator.chatId);
            }
        });
    }
    clearTypingTimeouts(userId) {
        const userTimeoutKeys = Array.from(this.typingTimeouts.keys())
            .filter(key => key.startsWith(userId + '-'));
        userTimeoutKeys.forEach(key => {
            if (this.typingTimeouts.has(key)) {
                clearTimeout(this.typingTimeouts.get(key));
                this.typingTimeouts.delete(key);
            }
        });
    }
    // Public getters for debugging/monitoring
    getActiveUsers() {
        return Array.from(this.activeUsers.values());
    }
    getTypingUsers() {
        return Array.from(this.typingIndicators.values());
    }
    getUserStatus(userId) {
        return this.activeUsers.get(userId)?.status || null;
    }
    isUserOnline(userId) {
        const user = this.activeUsers.get(userId);
        return user ? user.status !== 'offline' : false;
    }
}
exports.default = PresenceService;
//# sourceMappingURL=presenceService.js.map