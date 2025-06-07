import mongoose, { Document } from 'mongoose';
export interface IMessage extends Document {
    chat: mongoose.Types.ObjectId;
    sender: mongoose.Types.ObjectId;
    content: string;
    type: 'text' | 'image' | 'file' | 'system';
    file?: {
        url: string;
        filename: string;
        mimetype: string;
        size: number;
    };
    replyTo?: mongoose.Types.ObjectId;
    reactions: {
        emoji: string;
        users: mongoose.Types.ObjectId[];
    }[];
    readBy: {
        user: mongoose.Types.ObjectId;
        readAt: Date;
    }[];
    editedAt?: Date;
    isDeleted: boolean;
    deletedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}
export declare const Message: mongoose.Model<IMessage, {}, {}, {}, mongoose.Document<unknown, {}, IMessage, {}> & IMessage & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=Message.d.ts.map