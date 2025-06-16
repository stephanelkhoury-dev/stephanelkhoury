import { Socket, Server } from 'socket.io';
import { IUser } from '../models/User';
interface PresenceUser {
    id: string;
    username: string;
    status: 'online' | 'away' | 'busy' | 'offline';
    lastSeen: Date;
    typing?: {
        chatId: string;
        startedAt: Date;
    };
}
interface TypingIndicator {
    userId: string;
    username: string;
    chatId: string;
    startedAt: Date;
}
declare class PresenceService {
    private io;
    private activeUsers;
    private typingIndicators;
    private userSockets;
    private awayTimeout;
    private typingTimeouts;
    constructor(io: Server);
    userConnected(socket: Socket, user: IUser): Promise<void>;
    userDisconnected(userId: string, username: string): Promise<void>;
    startTyping(userId: string, username: string, chatId: string): void;
    stopTyping(userId: string, chatId: string): void;
    updateStatus(userId: string, status: 'online' | 'away' | 'busy' | 'offline'): Promise<void>;
    private setupActivityTracking;
    private updateActivity;
    private setAwayTimeout;
    private clearAwayTimeout;
    updateUserStatus(userId: string, status: string): Promise<void>;
    private broadcastPresenceUpdate;
    private sendActiveUsers;
    private clearUserTyping;
    private clearTypingTimeouts;
    getActiveUsers(): PresenceUser[];
    getTypingUsers(): TypingIndicator[];
    getUserStatus(userId: string): string | null;
    isUserOnline(userId: string): boolean;
}
export default PresenceService;
//# sourceMappingURL=presenceService.d.ts.map