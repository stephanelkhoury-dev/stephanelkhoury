import mongoose, { Document } from 'mongoose';
export interface IUser extends Document {
    username: string;
    email: string;
    password?: string;
    avatar?: string;
    bio?: string;
    status: 'online' | 'offline' | 'away' | 'busy' | 'dnd';
    statusMessage?: string;
    lastSeen: Date;
    isEmailVerified: boolean;
    emailVerificationToken?: string;
    emailVerificationExpires?: Date;
    passwordResetToken?: string;
    passwordResetExpires?: Date;
    oAuth: {
        google?: {
            id: string;
            email: string;
        };
        facebook?: {
            id: string;
            email: string;
        };
        apple?: {
            id: string;
            email: string;
        };
    };
    twoFactorAuth: {
        enabled: boolean;
        secret?: string;
        backupCodes: string[];
    };
    devices: {
        id: string;
        name: string;
        type: 'mobile' | 'desktop' | 'web';
        lastActive: Date;
        pushToken?: string;
    }[];
    preferences: {
        theme: 'light' | 'dark' | 'auto';
        language: string;
        fontSize: 'small' | 'medium' | 'large';
        notifications: {
            sound: boolean;
            desktop: boolean;
            email: boolean;
            push: boolean;
            muteUntil?: Date;
        };
        privacy: {
            showLastSeen: boolean;
            showOnlineStatus: boolean;
            allowMessagesFrom: 'everyone' | 'contacts' | 'nobody';
            readReceipts: boolean;
        };
    };
    contacts: mongoose.Types.ObjectId[];
    blockedUsers: mongoose.Types.ObjectId[];
    reportedUsers: {
        user: mongoose.Types.ObjectId;
        reason: string;
        reportedAt: Date;
    }[];
    createdAt: Date;
    updatedAt: Date;
    comparePassword(candidatePassword: string): Promise<boolean>;
    generateJWT(): string;
    generateEmailVerificationToken(): string;
    generatePasswordResetToken(): string;
}
export declare const User: mongoose.Model<IUser, {}, {}, {}, mongoose.Document<unknown, {}, IUser, {}> & IUser & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=User.d.ts.map