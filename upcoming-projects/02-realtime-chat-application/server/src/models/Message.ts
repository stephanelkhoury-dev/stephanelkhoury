import mongoose, { Document, Schema } from 'mongoose';

export interface IMessage extends Document {
  chat: mongoose.Types.ObjectId;
  sender: mongoose.Types.ObjectId;
  content: string;
  type: 'text' | 'image' | 'file' | 'system' | 'voice' | 'video' | 'gif';
  file?: {
    url: string;
    filename: string;
    mimetype: string;
    size: number;
    duration?: number; // for voice/video messages
  };
  gif?: {
    url: string;
    id?: string;
    title?: string;
    width?: number;
    height?: number;
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
  deliveredTo: {
    user: mongoose.Types.ObjectId;
    deliveredAt: Date;
  }[];
  status: 'sending' | 'sent' | 'delivered' | 'read' | 'failed';
  editedAt?: Date;
  isDeleted: boolean;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema = new Schema<IMessage>({
  chat: {
    type: Schema.Types.ObjectId,
    ref: 'Chat',
    required: true
  },
  sender: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true,
    maxlength: 5000
  },
  type: {
    type: String,
    enum: ['text', 'image', 'file', 'system', 'voice', 'video', 'gif'],
    default: 'text'
  },
  file: {
    url: String,
    filename: String,
    mimetype: String,
    size: Number,
    duration: Number // for voice/video messages
  },
  gif: {
    url: String,
    id: String,
    title: String,
    width: Number,
    height: Number
  },
  replyTo: {
    type: Schema.Types.ObjectId,
    ref: 'Message'
  },
  reactions: [{
    emoji: {
      type: String,
      required: true
    },
    users: [{
      type: Schema.Types.ObjectId,
      ref: 'User'
    }]
  }],
  readBy: [{
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    readAt: {
      type: Date,
      default: Date.now
    }
  }],
  deliveredTo: [{
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    deliveredAt: {
      type: Date,
      default: Date.now
    }
  }],
  status: {
    type: String,
    enum: ['sending', 'sent', 'delivered', 'read', 'failed'],
    default: 'sending'
  },
  editedAt: {
    type: Date
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  deletedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Indexes for performance
MessageSchema.index({ chat: 1, createdAt: -1 });
MessageSchema.index({ sender: 1 });
MessageSchema.index({ createdAt: -1 });

// Middleware to update chat's lastMessage and lastActivity
MessageSchema.post('save', async function(doc) {
  try {
    const Chat = mongoose.model('Chat');
    await Chat.findByIdAndUpdate(doc.chat, {
      lastMessage: doc._id,
      lastActivity: new Date()
    });
  } catch (error) {
    console.error('Error updating chat lastMessage:', error);
  }
});

export const Message = mongoose.model<IMessage>('Message', MessageSchema);
