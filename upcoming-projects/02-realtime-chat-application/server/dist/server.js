"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const dotenv_1 = __importDefault(require("dotenv"));
const auth_1 = __importDefault(require("./routes/auth"));
const chat_1 = __importDefault(require("./routes/chat"));
const user_1 = __importDefault(require("./routes/user"));
const upload_1 = __importDefault(require("./routes/upload"));
const voiceNotes_1 = __importDefault(require("./routes/voiceNotes"));
const gif_1 = __importDefault(require("./routes/gif"));
const socketAuth_1 = require("./middleware/socketAuth");
const socketHandlers_1 = require("./socket/socketHandlers");
const logger_1 = __importDefault(require("./utils/logger"));
dotenv_1.default.config();
class ChatServer {
    constructor() {
        this.app = (0, express_1.default)();
        this.server = (0, http_1.createServer)(this.app);
        this.io = new socket_io_1.Server(this.server, {
            cors: {
                origin: process.env.CLIENT_URL || "http://localhost:3000",
                methods: ["GET", "POST"],
                credentials: true
            }
        });
        this.port = parseInt(process.env.PORT || '5000');
        this.initializeMiddleware();
        this.initializeRoutes();
        this.initializeSocket();
        this.connectDatabase();
    }
    initializeMiddleware() {
        // Security middleware
        this.app.use((0, helmet_1.default)());
        this.app.use((0, compression_1.default)());
        // CORS configuration
        this.app.use((0, cors_1.default)({
            origin: process.env.CLIENT_URL || "http://localhost:3000",
            credentials: true
        }));
        // Rate limiting
        const limiter = (0, express_rate_limit_1.default)({
            windowMs: 15 * 60 * 1000, // 15 minutes
            max: 100, // limit each IP to 100 requests per windowMs
            message: 'Too many requests from this IP, please try again later.'
        });
        this.app.use('/api/', limiter);
        // Body parsing middleware
        this.app.use(express_1.default.json({ limit: '10mb' }));
        this.app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
        // Static files
        this.app.use('/uploads', express_1.default.static('uploads'));
        // Logging middleware
        this.app.use((req, res, next) => {
            logger_1.default.info(`${req.method} ${req.path} - ${req.ip}`);
            next();
        });
    }
    initializeRoutes() {
        // Health check
        this.app.get('/health', (req, res) => {
            res.json({ status: 'OK', timestamp: new Date().toISOString() });
        });
        // API routes
        this.app.use('/api/auth', auth_1.default);
        this.app.use('/api/chat', chat_1.default);
        this.app.use('/api/user', user_1.default);
        this.app.use('/api/upload', upload_1.default);
        this.app.use('/api/voice-notes', voiceNotes_1.default);
        this.app.use('/api/gif', gif_1.default);
        // 404 handler
        this.app.use('*', (req, res) => {
            res.status(404).json({ error: 'Route not found' });
        });
        // Error handling middleware
        this.app.use((error, req, res, next) => {
            logger_1.default.error('Unhandled error:', error);
            res.status(500).json({
                error: process.env.NODE_ENV === 'production'
                    ? 'Internal server error'
                    : error.message
            });
        });
    }
    initializeSocket() {
        // Socket authentication middleware
        this.io.use(socketAuth_1.socketAuth);
        // Handle socket connections
        this.io.on('connection', (socket) => {
            (0, socketHandlers_1.handleSocketConnection)(socket, this.io);
        });
    }
    async connectDatabase() {
        try {
            const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/chat-app';
            await mongoose_1.default.connect(mongoUri);
            logger_1.default.info('Connected to MongoDB successfully');
        }
        catch (error) {
            logger_1.default.error('MongoDB connection error:', error);
            process.exit(1);
        }
    }
    start() {
        this.server.listen(this.port, () => {
            logger_1.default.info(`Chat server running on port ${this.port}`);
            logger_1.default.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
        });
    }
}
// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
    logger_1.default.error('Uncaught Exception:', error);
    process.exit(1);
});
process.on('unhandledRejection', (reason, promise) => {
    logger_1.default.error('Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
});
// Start the server
const chatServer = new ChatServer();
chatServer.start();
exports.default = ChatServer;
//# sourceMappingURL=server.js.map