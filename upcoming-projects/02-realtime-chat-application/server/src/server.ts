import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

import authRoutes from './routes/auth';
import chatRoutes from './routes/chat';
import userRoutes from './routes/user';
import uploadRoutes from './routes/upload';
import voiceNotesRoutes from './routes/voiceNotes';
import gifRoutes from './routes/gif';
import { authenticateToken } from './middleware/auth';
import { socketAuth } from './middleware/socketAuth';
import { handleSocketConnection } from './socket/socketHandlers';
import logger from './utils/logger';

dotenv.config();

class ChatServer {
  private app: express.Application;
  private server: any;
  private io: Server;
  private port: number;

  constructor() {
    this.app = express();
    this.server = createServer(this.app);
    this.io = new Server(this.server, {
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

  private initializeMiddleware(): void {
    // Security middleware
    this.app.use(helmet());
    this.app.use(compression());
    
    // CORS configuration
    this.app.use(cors({
      origin: process.env.CLIENT_URL || "http://localhost:3000",
      credentials: true
    }));

    // Rate limiting
    const limiter = rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // limit each IP to 100 requests per windowMs
      message: 'Too many requests from this IP, please try again later.'
    });
    this.app.use('/api/', limiter);

    // Body parsing middleware
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // Static files
    this.app.use('/uploads', express.static('uploads'));

    // Logging middleware
    this.app.use((req, res, next) => {
      logger.info(`${req.method} ${req.path} - ${req.ip}`);
      next();
    });
  }

  private initializeRoutes(): void {
    // Health check
    this.app.get('/health', (req, res) => {
      res.json({ status: 'OK', timestamp: new Date().toISOString() });
    });

    // API routes
    this.app.use('/api/auth', authRoutes);
    this.app.use('/api/chat', chatRoutes);
    this.app.use('/api/user', userRoutes);
    this.app.use('/api/upload', uploadRoutes);
    this.app.use('/api/voice-notes', voiceNotesRoutes);
    this.app.use('/api/gif', gifRoutes);

    // 404 handler
    this.app.use('*', (req, res) => {
      res.status(404).json({ error: 'Route not found' });
    });

    // Error handling middleware
    this.app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
      logger.error('Unhandled error:', error);
      res.status(500).json({ 
        error: process.env.NODE_ENV === 'production' 
          ? 'Internal server error' 
          : error.message 
      });
    });
  }

  private initializeSocket(): void {
    // Socket authentication middleware
    this.io.use(socketAuth);

    // Handle socket connections
    this.io.on('connection', (socket) => {
      handleSocketConnection(socket, this.io);
    });
  }

  private async connectDatabase(): Promise<void> {
    try {
      const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/chat-app';
      await mongoose.connect(mongoUri);
      logger.info('Connected to MongoDB successfully');
    } catch (error) {
      logger.error('MongoDB connection error:', error);
      process.exit(1);
    }
  }

  public start(): void {
    this.server.listen(this.port, () => {
      logger.info(`Chat server running on port ${this.port}`);
      logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  }
}

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Start the server
const chatServer = new ChatServer();
chatServer.start();

export default ChatServer;
