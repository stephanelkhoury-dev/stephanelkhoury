import mongoose, { Document } from 'mongoose';
export interface IChat extends Document {
    type: 'private' | 'group';
    name?: string;
    description?: string;
    avatar?: string;
    participants: mongoose.Types.ObjectId[];
    admins: mongoose.Types.ObjectId[];
    lastMessage?: mongoose.Types.ObjectId;
    lastActivity: Date;
    settings: {
        allowMessagesFrom: 'everyone' | 'contacts' | 'admins';
        allowMediaSharing: boolean;
        allowFileSharing: boolean;
        muteNotifications: boolean;
    };
    createdBy: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}
export declare const Chat: mongoose.Model<IChat, {}, {}, {}, mongoose.Document<unknown, {}, IChat, {}> & IChat & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=Chat.d.ts.map