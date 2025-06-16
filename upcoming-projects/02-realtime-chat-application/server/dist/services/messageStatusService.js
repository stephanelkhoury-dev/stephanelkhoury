"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Message_1 = require("../models/Message");
const Chat_1 = require("../models/Chat");
const User_1 = require("../models/User");
const logger_1 = __importDefault(require("../utils/logger"));
class MessageStatusService {
    constructor(io) {
        this.io = io;
    }
    // Mark message as sent after successful save
    async markMessageAsSent(messageId) {
        try {
            await Message_1.Message.findByIdAndUpdate(messageId, {
                status: 'sent'
            });
            // Broadcast status update to sender
            const message = await Message_1.Message.findById(messageId).populate('sender', 'username');
            if (message) {
                this.io.to(message.sender._id.toString()).emit('message-status-updated', {
                    messageId,
                    status: 'sent',
                    timestamp: new Date()
                });
            }
            logger_1.default.debug(`Message ${messageId} marked as sent`);
        }
        catch (error) {
            logger_1.default.error('Error marking message as sent:', error);
        }
    }
    // Mark message as delivered to specific user
    async markMessageAsDelivered(messageId, userId) {
        try {
            const message = await Message_1.Message.findById(messageId);
            if (!message) {
                logger_1.default.warn(`Message ${messageId} not found for delivery confirmation`);
                return;
            }
            // Check if already delivered to this user
            const alreadyDelivered = message.deliveredTo.some(delivery => delivery.user.toString() === userId);
            if (alreadyDelivered)
                return;
            // Add delivery receipt
            message.deliveredTo.push({
                user: userId,
                deliveredAt: new Date()
            });
            // Update overall status if this is the first delivery
            if (message.status === 'sent') {
                message.status = 'delivered';
            }
            await message.save();
            // Broadcast delivery confirmation to sender
            this.io.to(message.sender.toString()).emit('message-delivered', {
                messageId,
                chatId: message.chat.toString(),
                deliveredTo: userId,
                deliveredAt: new Date()
            });
            logger_1.default.debug(`Message ${messageId} delivered to user ${userId}`);
        }
        catch (error) {
            logger_1.default.error('Error marking message as delivered:', error);
        }
    }
    // Mark message as read by specific user
    async markMessageAsRead(messageId, userId) {
        try {
            const message = await Message_1.Message.findById(messageId);
            if (!message) {
                logger_1.default.warn(`Message ${messageId} not found for read confirmation`);
                return;
            }
            // Check if already read by this user
            const alreadyRead = message.readBy.some(read => read.user.toString() === userId);
            if (alreadyRead)
                return;
            // Add read receipt
            message.readBy.push({
                user: userId,
                readAt: new Date()
            });
            // Update overall status
            message.status = 'read';
            await message.save();
            // Broadcast read confirmation to sender
            this.io.to(message.sender.toString()).emit('message-read', {
                messageId,
                chatId: message.chat.toString(),
                readBy: userId,
                readAt: new Date()
            });
            // Broadcast to chat participants (for read receipt indicators)
            this.io.to(message.chat.toString()).emit('message-read-receipt', {
                messageId,
                userId,
                readAt: new Date()
            });
            logger_1.default.debug(`Message ${messageId} read by user ${userId}`);
        }
        catch (error) {
            logger_1.default.error('Error marking message as read:', error);
        }
    }
    // Mark multiple messages as read (bulk operation)
    async markMessagesAsRead(messageIds, userId, chatId) {
        try {
            // Update messages that haven't been read by this user yet
            const result = await Message_1.Message.updateMany({
                _id: { $in: messageIds },
                chat: chatId,
                sender: { $ne: userId }, // Don't mark own messages as read
                'readBy.user': { $ne: userId }
            }, {
                $push: {
                    readBy: {
                        user: userId,
                        readAt: new Date()
                    }
                },
                $set: {
                    status: 'read'
                }
            });
            if (result.modifiedCount > 0) {
                // Get the updated messages to notify senders
                const updatedMessages = await Message_1.Message.find({
                    _id: { $in: messageIds },
                    chat: chatId
                }).populate('sender', 'username');
                // Group messages by sender to batch notifications
                const messagesBySender = new Map();
                updatedMessages.forEach(message => {
                    const senderId = message.sender._id.toString();
                    if (!messagesBySender.has(senderId)) {
                        messagesBySender.set(senderId, []);
                    }
                    messagesBySender.get(senderId).push(message);
                });
                // Send notifications to each sender
                messagesBySender.forEach((messages, senderId) => {
                    this.io.to(senderId).emit('messages-read-bulk', {
                        messageIds: messages.map(m => m._id.toString()),
                        chatId,
                        readBy: userId,
                        readAt: new Date()
                    });
                });
                // Broadcast to chat participants
                this.io.to(chatId).emit('messages-read-receipt-bulk', {
                    messageIds,
                    userId,
                    readAt: new Date(),
                    count: result.modifiedCount
                });
                logger_1.default.debug(`${result.modifiedCount} messages marked as read by user ${userId} in chat ${chatId}`);
            }
        }
        catch (error) {
            logger_1.default.error('Error marking messages as read:', error);
        }
    }
    // Mark message as failed
    async markMessageAsFailed(messageId, error) {
        try {
            const message = await Message_1.Message.findByIdAndUpdate(messageId, {
                status: 'failed'
            });
            if (message) {
                // Notify sender of failure
                this.io.to(message.sender.toString()).emit('message-failed', {
                    messageId,
                    error: error || 'Message delivery failed',
                    timestamp: new Date()
                });
                logger_1.default.warn(`Message ${messageId} marked as failed: ${error}`);
            }
        }
        catch (err) {
            logger_1.default.error('Error marking message as failed:', err);
        }
    }
    // Auto-deliver messages when user comes online
    async autoDeliverPendingMessages(userId) {
        try {
            // Find user's chats
            const userChats = await Chat_1.Chat.find({ participants: userId }).select('_id');
            const chatIds = userChats.map(chat => chat._id);
            // Find undelivered messages in user's chats
            const undeliveredMessages = await Message_1.Message.find({
                chat: { $in: chatIds },
                sender: { $ne: userId }, // Don't deliver own messages
                'deliveredTo.user': { $ne: userId }, // Not already delivered to this user
                status: { $in: ['sent', 'delivered'] } // Only sent or partially delivered messages
            });
            // Mark messages as delivered
            for (const message of undeliveredMessages) {
                await this.markMessageAsDelivered(message._id.toString(), userId);
            }
            if (undeliveredMessages.length > 0) {
                logger_1.default.info(`Auto-delivered ${undeliveredMessages.length} pending messages to user ${userId}`);
            }
        }
        catch (error) {
            logger_1.default.error('Error auto-delivering pending messages:', error);
        }
    }
    // Get message status for a specific user
    async getMessageStatus(messageId, userId) {
        try {
            const message = await Message_1.Message.findById(messageId);
            if (!message)
                return null;
            const delivery = message.deliveredTo.find(d => d.user.toString() === userId);
            const read = message.readBy.find(r => r.user.toString() === userId);
            return {
                status: message.status,
                delivered: !!delivery,
                read: !!read,
                deliveredAt: delivery?.deliveredAt,
                readAt: read?.readAt
            };
        }
        catch (error) {
            logger_1.default.error('Error getting message status:', error);
            return null;
        }
    }
    // Get detailed status for all recipients of a message
    async getMessageStatusDetails(messageId) {
        try {
            const message = await Message_1.Message.findById(messageId)
                .populate('chat', 'participants')
                .populate('deliveredTo.user', 'username')
                .populate('readBy.user', 'username');
            if (!message)
                return null;
            const chat = message.chat;
            const recipients = [];
            // Get all participants except sender
            for (const participantId of chat.participants) {
                if (participantId.toString() === message.sender.toString())
                    continue;
                const participant = await User_1.User.findById(participantId).select('username');
                if (!participant)
                    continue;
                const delivery = message.deliveredTo.find(d => d.user._id.toString() === participantId.toString());
                const read = message.readBy.find(r => r.user._id.toString() === participantId.toString());
                recipients.push({
                    userId: participantId.toString(),
                    username: participant.username,
                    delivered: !!delivery,
                    read: !!read,
                    deliveredAt: delivery?.deliveredAt,
                    readAt: read?.readAt
                });
            }
            return {
                messageId,
                status: message.status,
                recipients
            };
        }
        catch (error) {
            logger_1.default.error('Error getting message status details:', error);
            return null;
        }
    }
}
exports.default = MessageStatusService;
//# sourceMappingURL=messageStatusService.js.map