"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const UserSchema = new mongoose_1.Schema({
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
        required: function () {
            // Password not required for OAuth users
            return !this.oAuth.google && !this.oAuth.facebook && !this.oAuth.apple;
        },
        minlength: 6
    },
    avatar: {
        type: String,
        default: null
    },
    bio: {
        type: String,
        maxlength: 200,
        default: ''
    },
    status: {
        type: String,
        enum: ['online', 'offline', 'away', 'busy', 'dnd'],
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
    emailVerificationToken: String,
    emailVerificationExpires: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    // OAuth fields
    oAuth: {
        google: {
            id: String,
            email: String
        },
        facebook: {
            id: String,
            email: String
        },
        apple: {
            id: String,
            email: String
        }
    },
    // 2FA fields
    twoFactorAuth: {
        enabled: { type: Boolean, default: false },
        secret: String,
        backupCodes: [String]
    },
    // Device management
    devices: [{
            id: { type: String, required: true },
            name: { type: String, required: true },
            type: {
                type: String,
                enum: ['mobile', 'desktop', 'web'],
                required: true
            },
            lastActive: { type: Date, default: Date.now },
            pushToken: String
        }],
    preferences: {
        theme: {
            type: String,
            enum: ['light', 'dark', 'auto'],
            default: 'light'
        },
        language: { type: String, default: 'en' },
        fontSize: {
            type: String,
            enum: ['small', 'medium', 'large'],
            default: 'medium'
        },
        notifications: {
            sound: { type: Boolean, default: true },
            desktop: { type: Boolean, default: true },
            email: { type: Boolean, default: false },
            push: { type: Boolean, default: true },
            muteUntil: Date
        },
        privacy: {
            showLastSeen: { type: Boolean, default: true },
            showOnlineStatus: { type: Boolean, default: true },
            allowMessagesFrom: {
                type: String,
                enum: ['everyone', 'contacts', 'nobody'],
                default: 'everyone'
            },
            readReceipts: { type: Boolean, default: true }
        }
    },
    contacts: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'User'
        }],
    blockedUsers: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'User'
        }],
    reportedUsers: [{
            user: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' },
            reason: String,
            reportedAt: { type: Date, default: Date.now }
        }]
}, {
    timestamps: true,
    toJSON: {
        transform: function (doc, ret) {
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
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password') || !this.password)
        return next();
    try {
        const saltRounds = 12;
        this.password = await bcryptjs_1.default.hash(this.password, saltRounds);
        next();
    }
    catch (error) {
        next(error);
    }
});
// Compare password method
UserSchema.methods.comparePassword = async function (candidatePassword) {
    if (!this.password)
        return false;
    return bcryptjs_1.default.compare(candidatePassword, this.password);
};
// Generate JWT method
UserSchema.methods.generateJWT = function () {
    const jwt = require('jsonwebtoken');
    return jwt.sign({
        userId: this._id,
        username: this.username,
        email: this.email
    }, process.env.JWT_SECRET || 'your-secret-key', { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
};
// Generate email verification token
UserSchema.methods.generateEmailVerificationToken = function () {
    const crypto = require('crypto');
    const token = crypto.randomBytes(32).toString('hex');
    this.emailVerificationToken = token;
    this.emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    return token;
};
// Generate password reset token
UserSchema.methods.generatePasswordResetToken = function () {
    const crypto = require('crypto');
    const token = crypto.randomBytes(32).toString('hex');
    this.passwordResetToken = token;
    this.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    return token;
};
exports.User = mongoose_1.default.model('User', UserSchema);
//# sourceMappingURL=User.js.map