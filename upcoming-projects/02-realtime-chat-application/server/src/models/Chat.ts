import mongoose, { Document, Schema } from 'mongoose';

export interface IChat extends Document {
  type: 'private' | 'group';
  name?: string; // For group chats
  description?: string; // For group chats
  avatar?: string; // For group chats
  participants: mongoose.Types.ObjectId[];
  admins: mongoose.Types.ObjectId[]; // For group chats
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

const ChatSchema = new Schema<IChat>({
  type: {
    type: String,
    enum: ['private', 'group'],
    required: true
  },
  name: {
    type: String,
    required: function(this: IChat) {
      return this.type === 'group';
    },
    maxlength: 50,
    trim: true
  },
  description: {
    type: String,
    maxlength: 200,
    trim: true
  },
  avatar: {
    type: String,
    default: null
  },
  participants: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }],
  admins: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  lastMessage: {
    type: Schema.Types.ObjectId,
    ref: 'Message'
  },
  lastActivity: {
    type: Date,
    default: Date.now
  },
  settings: {
    allowMessagesFrom: {
      type: String,
      enum: ['everyone', 'contacts', 'admins'],
      default: 'everyone'
    },
    allowMediaSharing: {
      type: Boolean,
      default: true
    },
    allowFileSharing: {
      type: Boolean,
      default: true
    },
    muteNotifications: {
      type: Boolean,
      default: false
    }
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Indexes for performance
ChatSchema.index({ participants: 1 });
ChatSchema.index({ lastActivity: -1 });
ChatSchema.index({ type: 1 });

// Middleware to ensure group chats have admins
ChatSchema.pre('save', function(next) {
  if (this.type === 'group' && this.admins.length === 0) {
    this.admins.push(this.createdBy);
  }
  next();
});

export const Chat = mongoose.model<IChat>('Chat', ChatSchema);
