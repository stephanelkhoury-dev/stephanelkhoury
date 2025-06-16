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
exports.Message = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const MessageSchema = new mongoose_1.Schema({
    chat: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Chat',
        required: true
    },
    sender: {
        type: mongoose_1.Schema.Types.ObjectId,
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
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Message'
    },
    reactions: [{
            emoji: {
                type: String,
                required: true
            },
            users: [{
                    type: mongoose_1.Schema.Types.ObjectId,
                    ref: 'User'
                }]
        }],
    readBy: [{
            user: {
                type: mongoose_1.Schema.Types.ObjectId,
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
                type: mongoose_1.Schema.Types.ObjectId,
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
MessageSchema.post('save', async function (doc) {
    try {
        const Chat = mongoose_1.default.model('Chat');
        await Chat.findByIdAndUpdate(doc.chat, {
            lastMessage: doc._id,
            lastActivity: new Date()
        });
    }
    catch (error) {
        console.error('Error updating chat lastMessage:', error);
    }
});
exports.Message = mongoose_1.default.model('Message', MessageSchema);
//# sourceMappingURL=Message.js.map