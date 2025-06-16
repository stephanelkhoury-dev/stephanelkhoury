"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Message_1 = require("../models/Message");
const Chat_1 = require("../models/Chat");
const logger_1 = __importDefault(require("../utils/logger"));
const path_1 = __importDefault(require("path"));
const promises_1 = __importDefault(require("fs/promises"));
const uuid_1 = require("uuid");
class VoiceNotesService {
    constructor(io) {
        this.maxDuration = 300; // 5 minutes max
        this.maxFileSize = 10 * 1024 * 1024; // 10MB max
        this.io = io;
        this.uploadDir = path_1.default.join(process.cwd(), 'uploads', 'voice-notes');
        this.ensureUploadDirectory();
    }
    async ensureUploadDirectory() {
        try {
            await promises_1.default.access(this.uploadDir);
        }
        catch {
            await promises_1.default.mkdir(this.uploadDir, { recursive: true });
            logger_1.default.info('Created voice notes upload directory');
        }
    }
    // Process and save voice note
    async saveVoiceNote(senderId, data) {
        try {
            // Validate duration
            if (data.duration > this.maxDuration) {
                throw new Error(`Voice note too long. Maximum duration is ${this.maxDuration} seconds`);
            }
            // Validate file size
            if (data.audioBlob.length > this.maxFileSize) {
                throw new Error(`Voice note too large. Maximum size is ${this.maxFileSize / (1024 * 1024)}MB`);
            }
            // Generate unique filename
            const fileId = (0, uuid_1.v4)();
            const filename = `${fileId}.${data.format}`;
            const filepath = path_1.default.join(this.uploadDir, filename);
            // Save audio file
            await promises_1.default.writeFile(filepath, data.audioBlob);
            // Generate URL (this would be your server's file serving endpoint)
            const url = `/api/voice-notes/${filename}`;
            const metadata = {
                id: fileId,
                duration: data.duration,
                format: data.format,
                size: data.audioBlob.length,
                waveform: data.waveform,
                url
            };
            logger_1.default.info(`Voice note saved: ${filename} (${data.duration}s, ${data.audioBlob.length} bytes)`);
            return metadata;
        }
        catch (error) {
            logger_1.default.error('Error saving voice note:', error);
            return null;
        }
    }
    // Create voice message in database
    async createVoiceMessage(senderId, chatId, voiceMetadata, replyTo) {
        try {
            // Verify user is participant in the chat
            const chat = await Chat_1.Chat.findById(chatId);
            if (!chat || !chat.participants.includes(senderId)) {
                throw new Error('Not authorized to send message to this chat');
            }
            // Create voice message
            const message = new Message_1.Message({
                chat: chatId,
                sender: senderId,
                content: `🎵 Voice message (${this.formatDuration(voiceMetadata.duration)})`,
                type: 'voice',
                file: {
                    url: voiceMetadata.url,
                    filename: `voice_${voiceMetadata.id}.${voiceMetadata.format}`,
                    mimetype: this.getMimeType(voiceMetadata.format),
                    size: voiceMetadata.size,
                    duration: voiceMetadata.duration
                },
                replyTo: replyTo || undefined,
                status: 'sending'
            });
            await message.save();
            return message;
        }
        catch (error) {
            logger_1.default.error('Error creating voice message:', error);
            throw error;
        }
    }
    // Handle voice note upload via socket
    async handleVoiceNoteUpload(socket, userId, data) {
        try {
            // Convert base64 to buffer
            const audioBuffer = Buffer.from(data.audioData, 'base64');
            // Save voice note
            const metadata = await this.saveVoiceNote(userId, {
                chatId: data.chatId,
                duration: data.duration,
                waveform: data.waveform,
                audioBlob: audioBuffer,
                format: data.format
            });
            if (!metadata) {
                socket.emit('voice-note-error', {
                    message: 'Failed to save voice note'
                });
                return;
            }
            // Create message
            const message = await this.createVoiceMessage(userId, data.chatId, metadata, data.replyTo);
            // Populate sender info
            await message.populate('sender', 'username avatar');
            if (data.replyTo) {
                await message.populate('replyTo', 'content sender');
            }
            // Broadcast voice message to chat participants
            this.io.to(data.chatId).emit('new-voice-message', {
                id: message._id.toString(),
                chatId: message.chat,
                sender: {
                    id: message.sender._id,
                    username: message.sender.username,
                    avatar: message.sender.avatar
                },
                content: message.content,
                type: 'voice',
                file: {
                    url: metadata.url,
                    duration: metadata.duration,
                    waveform: metadata.waveform,
                    size: metadata.size,
                    format: metadata.format
                },
                replyTo: message.replyTo,
                createdAt: message.createdAt,
                status: 'sent'
            });
            // Confirm to sender
            socket.emit('voice-note-sent', {
                messageId: message._id.toString(),
                metadata
            });
            logger_1.default.info(`Voice note sent by user ${userId} to chat ${data.chatId}`);
        }
        catch (error) {
            logger_1.default.error('Error handling voice note upload:', error);
            socket.emit('voice-note-error', {
                message: error instanceof Error ? error.message : 'Failed to send voice note'
            });
        }
    }
    // Generate waveform data from audio buffer (simplified version)
    async generateWaveform(audioBuffer, samples = 50) {
        try {
            // This is a simplified waveform generation
            // In a real implementation, you'd use an audio processing library
            const waveform = [];
            const chunkSize = Math.floor(audioBuffer.length / samples);
            for (let i = 0; i < samples; i++) {
                const start = i * chunkSize;
                const end = Math.min(start + chunkSize, audioBuffer.length);
                // Calculate average amplitude for this chunk
                let sum = 0;
                for (let j = start; j < end; j++) {
                    sum += Math.abs(audioBuffer[j] - 128); // Assuming 8-bit audio
                }
                const average = sum / (end - start);
                waveform.push(Math.round((average / 128) * 100)); // Normalize to 0-100
            }
            return waveform;
        }
        catch (error) {
            logger_1.default.error('Error generating waveform:', error);
            return Array(samples).fill(50); // Return flat waveform as fallback
        }
    }
    // Start voice recording session
    startRecording(socket, userId, chatId) {
        socket.emit('voice-recording-started', {
            chatId,
            maxDuration: this.maxDuration,
            supportedFormats: ['webm', 'mp3', 'wav', 'ogg']
        });
        logger_1.default.debug(`User ${userId} started voice recording in chat ${chatId}`);
    }
    // Cancel voice recording
    cancelRecording(socket, userId, chatId) {
        socket.emit('voice-recording-cancelled', { chatId });
        logger_1.default.debug(`User ${userId} cancelled voice recording in chat ${chatId}`);
    }
    // Get voice note file for serving
    async getVoiceNoteFile(filename) {
        try {
            const filepath = path_1.default.join(this.uploadDir, filename);
            const fileBuffer = await promises_1.default.readFile(filepath);
            return fileBuffer;
        }
        catch (error) {
            logger_1.default.error('Error reading voice note file:', error);
            return null;
        }
    }
    // Delete voice note file
    async deleteVoiceNote(filename) {
        try {
            const filepath = path_1.default.join(this.uploadDir, filename);
            await promises_1.default.unlink(filepath);
            logger_1.default.info(`Deleted voice note: ${filename}`);
            return true;
        }
        catch (error) {
            logger_1.default.error('Error deleting voice note:', error);
            return false;
        }
    }
    // Handle voice note recording start
    handleVoiceNoteStart(socket, chatId, userId) {
        // Notify chat participants that user started recording
        socket.to(chatId).emit('voice-note-recording', {
            userId,
            chatId,
            action: 'start'
        });
        logger_1.default.info(`User ${userId} started recording voice note in chat ${chatId}`);
    }
    // Handle voice note recording stop
    handleVoiceNoteStop(socket, chatId, userId) {
        // Notify chat participants that user stopped recording
        socket.to(chatId).emit('voice-note-recording', {
            userId,
            chatId,
            action: 'stop'
        });
        logger_1.default.info(`User ${userId} stopped recording voice note in chat ${chatId}`);
    }
    // Helper methods
    formatDuration(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
    getMimeType(format) {
        const mimeTypes = {
            'webm': 'audio/webm',
            'mp3': 'audio/mpeg',
            'wav': 'audio/wav',
            'ogg': 'audio/ogg'
        };
        return mimeTypes[format] || 'audio/webm';
    }
    // Cleanup old voice notes (run periodically)
    async cleanupOldVoiceNotes(daysOld = 30) {
        try {
            const files = await promises_1.default.readdir(this.uploadDir);
            const now = new Date();
            let deletedCount = 0;
            for (const file of files) {
                const filepath = path_1.default.join(this.uploadDir, file);
                const stats = await promises_1.default.stat(filepath);
                const daysDiff = (now.getTime() - stats.mtime.getTime()) / (1000 * 60 * 60 * 24);
                if (daysDiff > daysOld) {
                    await promises_1.default.unlink(filepath);
                    deletedCount++;
                }
            }
            if (deletedCount > 0) {
                logger_1.default.info(`Cleaned up ${deletedCount} old voice notes`);
            }
        }
        catch (error) {
            logger_1.default.error('Error cleaning up old voice notes:', error);
        }
    }
}
exports.default = VoiceNotesService;
//# sourceMappingURL=voiceNotesService.js.map