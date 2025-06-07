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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Chat = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const ChatSchema = new mongoose_1.Schema({
    type: {
        type: String,
        enum: ['private', 'group'],
        required: true
    },
    name: {
        type: String,
        required: function () {
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
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }],
    admins: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'User'
        }],
    lastMessage: {
        type: mongoose_1.Schema.Types.ObjectId,
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
        type: mongoose_1.Schema.Types.ObjectId,
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
ChatSchema.pre('save', function (next) {
    if (this.type === 'group' && this.admins.length === 0) {
        this.admins.push(this.createdBy);
    }
    next();
});
exports.Chat = mongoose_1.default.model('Chat', ChatSchema);
//# sourceMappingURL=Chat.js.map