import { Server } from 'socket.io';
declare class MessageStatusService {
    private io;
    constructor(io: Server);
    markMessageAsSent(messageId: string): Promise<void>;
    markMessageAsDelivered(messageId: string, userId: string): Promise<void>;
    markMessageAsRead(messageId: string, userId: string): Promise<void>;
    markMessagesAsRead(messageIds: string[], userId: string, chatId: string): Promise<void>;
    markMessageAsFailed(messageId: string, error?: string): Promise<void>;
    autoDeliverPendingMessages(userId: string): Promise<void>;
    getMessageStatus(messageId: string, userId: string): Promise<{
        status: string;
        delivered: boolean;
        read: boolean;
        deliveredAt?: Date;
        readAt?: Date;
    } | null>;
    getMessageStatusDetails(messageId: string): Promise<{
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
    } | null>;
}
export default MessageStatusService;
//# sourceMappingURL=messageStatusService.d.ts.map