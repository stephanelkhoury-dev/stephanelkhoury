// Message Status Service - Handles message delivery status, read receipts, and status updates
import { Server } from 'socket.io';
import { Message, IMessage } from '../models/Message';
import { Chat } from '../models/Chat';
import { User } from '../models/User';
import logger from '../utils/logger';
import mongoose from 'mongoose';

interface MessageStatusUpdate {
  messageId: string;
  userId: string;
  status: 'sent' | 'delivered' | 'read';
  timestamp: Date;
}

interface DeliveryReceipt {
  messageId: string;
  chatId: string;
  userId: string;
  deliveredAt: Date;
}

interface ReadReceipt {
  messageId: string;
  chatId: string;
  userId: string;
  readAt: Date;
}

class MessageStatusService {
  private io: Server;

  constructor(io: Server) {
    this.io = io;
  }

  // Mark message as sent after successful save
  async markMessageAsSent(messageId: string): Promise<void> {
    try {
      await Message.findByIdAndUpdate(messageId, {
        status: 'sent'
      });

      // Broadcast status update to sender
      const message = await Message.findById(messageId).populate('sender', 'username');
      if (message) {
        this.io.to(message.sender._id.toString()).emit('message-status-updated', {
          messageId,
          status: 'sent',
          timestamp: new Date()
        });
      }

      logger.debug(`Message ${messageId} marked as sent`);
    } catch (error) {
      logger.error('Error marking message as sent:', error);
    }
  }

  // Mark message as delivered to specific user
  async markMessageAsDelivered(messageId: string, userId: string): Promise<void> {
    try {
      const message = await Message.findById(messageId);
      if (!message) {
        logger.warn(`Message ${messageId} not found for delivery confirmation`);
        return;
      }

      // Check if already delivered to this user
      const alreadyDelivered = message.deliveredTo.some(
        delivery => delivery.user.toString() === userId
      );

      if (alreadyDelivered) return;

      // Add delivery receipt
      message.deliveredTo.push({
        user: userId as any,
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

      logger.debug(`Message ${messageId} delivered to user ${userId}`);
    } catch (error) {
      logger.error('Error marking message as delivered:', error);
    }
  }

  // Mark message as read by specific user
  async markMessageAsRead(messageId: string, userId: string): Promise<void> {
    try {
      const message = await Message.findById(messageId);
      if (!message) {
        logger.warn(`Message ${messageId} not found for read confirmation`);
        return;
      }

      // Check if already read by this user
      const alreadyRead = message.readBy.some(
        read => read.user.toString() === userId
      );

      if (alreadyRead) return;

      // Add read receipt
      message.readBy.push({
        user: userId as any,
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

      logger.debug(`Message ${messageId} read by user ${userId}`);
    } catch (error) {
      logger.error('Error marking message as read:', error);
    }
  }

  // Mark multiple messages as read (bulk operation)
  async markMessagesAsRead(messageIds: string[], userId: string, chatId: string): Promise<void> {
    try {
      // Update messages that haven't been read by this user yet
      const result = await Message.updateMany(
        {
          _id: { $in: messageIds },
          chat: chatId,
          sender: { $ne: userId }, // Don't mark own messages as read
          'readBy.user': { $ne: userId }
        },
        {
          $push: {
            readBy: {
              user: userId,
              readAt: new Date()
            }
          },
          $set: {
            status: 'read'
          }
        }
      );

      if (result.modifiedCount > 0) {
        // Get the updated messages to notify senders
        const updatedMessages = await Message.find({
          _id: { $in: messageIds },
          chat: chatId
        }).populate('sender', 'username');

        // Group messages by sender to batch notifications
        const messagesBySender = new Map<string, IMessage[]>();
        
        updatedMessages.forEach(message => {
          const senderId = message.sender._id.toString();
          if (!messagesBySender.has(senderId)) {
            messagesBySender.set(senderId, []);
          }
          messagesBySender.get(senderId)!.push(message);
        });

        // Send notifications to each sender
        messagesBySender.forEach((messages, senderId) => {
          this.io.to(senderId).emit('messages-read-bulk', {
            messageIds: messages.map(m => (m._id as any).toString()),
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

        logger.debug(`${result.modifiedCount} messages marked as read by user ${userId} in chat ${chatId}`);
      }
    } catch (error) {
      logger.error('Error marking messages as read:', error);
    }
  }

  // Mark message as failed
  async markMessageAsFailed(messageId: string, error?: string): Promise<void> {
    try {
      const message = await Message.findByIdAndUpdate(messageId, {
        status: 'failed'
      });

      if (message) {
        // Notify sender of failure
        this.io.to(message.sender.toString()).emit('message-failed', {
          messageId,
          error: error || 'Message delivery failed',
          timestamp: new Date()
        });

        logger.warn(`Message ${messageId} marked as failed: ${error}`);
      }
    } catch (err) {
      logger.error('Error marking message as failed:', err);
    }
  }

  // Auto-deliver messages when user comes online
  async autoDeliverPendingMessages(userId: string): Promise<void> {
    try {
      // Find user's chats
      const userChats = await Chat.find({ participants: userId }).select('_id');
      const chatIds = userChats.map(chat => chat._id);

      // Find undelivered messages in user's chats
      const undeliveredMessages = await Message.find({
        chat: { $in: chatIds },
        sender: { $ne: userId }, // Don't deliver own messages
        'deliveredTo.user': { $ne: userId }, // Not already delivered to this user
        status: { $in: ['sent', 'delivered'] } // Only sent or partially delivered messages
      });

      // Mark messages as delivered
      for (const message of undeliveredMessages) {
        await this.markMessageAsDelivered((message._id as any).toString(), userId);
      }

      if (undeliveredMessages.length > 0) {
        logger.info(`Auto-delivered ${undeliveredMessages.length} pending messages to user ${userId}`);
      }
    } catch (error) {
      logger.error('Error auto-delivering pending messages:', error);
    }
  }

  // Get message status for a specific user
  async getMessageStatus(messageId: string, userId: string): Promise<{
    status: string;
    delivered: boolean;
    read: boolean;
    deliveredAt?: Date;
    readAt?: Date;
  } | null> {
    try {
      const message = await Message.findById(messageId);
      if (!message) return null;

      const delivery = message.deliveredTo.find(d => d.user.toString() === userId);
      const read = message.readBy.find(r => r.user.toString() === userId);

      return {
        status: message.status,
        delivered: !!delivery,
        read: !!read,
        deliveredAt: delivery?.deliveredAt,
        readAt: read?.readAt
      };
    } catch (error) {
      logger.error('Error getting message status:', error);
      return null;
    }
  }

  // Get detailed status for all recipients of a message
  async getMessageStatusDetails(messageId: string): Promise<{
    messageId: string;
    status: string;
    recipients: Array<{
      userId: string;
      username: string;
      delivered: boolean;
      read: boolean;
      deliveredAt?: Date;
      readAt?: Date;
    }>;
  } | null> {
    try {
      const message = await Message.findById(messageId)
        .populate('chat', 'participants')
        .populate('deliveredTo.user', 'username')
        .populate('readBy.user', 'username');

      if (!message) return null;

      const chat = message.chat as any;
      const recipients = [];

      // Get all participants except sender
      for (const participantId of chat.participants) {
        if (participantId.toString() === message.sender.toString()) continue;

        const participant = await User.findById(participantId).select('username');
        if (!participant) continue;

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
    } catch (error) {
      logger.error('Error getting message status details:', error);
      return null;
    }
  }
}

export default MessageStatusService;
