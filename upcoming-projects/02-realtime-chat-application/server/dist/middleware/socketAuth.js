"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.socketAuth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = require("../models/User");
const socketAuth = async (socket, next) => {
    try {
        const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.split(' ')[1];
        if (!token) {
            return next(new Error('Authentication error: No token provided'));
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        const user = await User_1.User.findById(decoded.userId).select('-password');
        if (!user) {
            return next(new Error('Authentication error: User not found'));
        }
        // Attach user data to socket
        socket.data.user = user;
        socket.data.userId = user._id.toString();
        next();
    }
    catch (error) {
        next(new Error('Authentication error: Invalid token'));
    }
};
exports.socketAuth = socketAuth;
//# sourceMappingURL=socketAuth.js.map