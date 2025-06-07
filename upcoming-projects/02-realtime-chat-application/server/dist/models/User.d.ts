import mongoose, { Document } from 'mongoose';
export interface IUser extends Document {
    username: string;
    email: string;
    password: string;
    avatar?: string;
    status: 'online' | 'offline' | 'away' | 'busy';
    statusMessage?: string;
    lastSeen: Date;
    isEmailVerified: boolean;
    preferences: {
        theme: 'light' | 'dark' | 'auto';
        notifications: {
            sound: boolean;
            desktop: boolean;
            email: boolean;
        };
        privacy: {
            showLastSeen: boolean;
            showOnlineStatus: boolean;
        };
    };
    contacts: mongoose.Types.ObjectId[];
    blockedUsers: mongoose.Types.ObjectId[];
    createdAt: Date;
    updatedAt: Date;
    comparePassword(candidatePassword: string): Promise<boolean>;
    generateJWT(): string;
}
export declare const User: mongoose.Model<IUser, {}, {}, {}, mongoose.Document<unknown, {}, IUser, {}> & IUser & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=User.d.ts.map