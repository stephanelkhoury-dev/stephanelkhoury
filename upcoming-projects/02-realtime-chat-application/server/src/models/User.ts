import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

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

const UserSchema = new Schema<IUser>({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30,
    match: /^[a-zA-Z0-9_]+$/
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  avatar: {
    type: String,
    default: null
  },
  status: {
    type: String,
    enum: ['online', 'offline', 'away', 'busy'],
    default: 'offline'
  },
  statusMessage: {
    type: String,
    maxlength: 100,
    default: ''
  },
  lastSeen: {
    type: Date,
    default: Date.now
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  preferences: {
    theme: {
      type: String,
      enum: ['light', 'dark', 'auto'],
      default: 'light'
    },
    notifications: {
      sound: { type: Boolean, default: true },
      desktop: { type: Boolean, default: true },
      email: { type: Boolean, default: false }
    },
    privacy: {
      showLastSeen: { type: Boolean, default: true },
      showOnlineStatus: { type: Boolean, default: true }
    }
  },
  contacts: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  blockedUsers: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      delete ret.password;
      return ret;
    }
  }
});

// Index for performance
UserSchema.index({ username: 1 });
UserSchema.index({ email: 1 });
UserSchema.index({ status: 1 });

// Hash password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const saltRounds = 12;
    this.password = await bcrypt.hash(this.password, saltRounds);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Compare password method
UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Generate JWT method
UserSchema.methods.generateJWT = function(): string {
  const jwt = require('jsonwebtoken');
  return jwt.sign(
    { 
      userId: this._id, 
      username: this.username,
      email: this.email 
    },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

export const User = mongoose.model<IUser>('User', UserSchema);
