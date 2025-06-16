// Voice Notes Service - Handles voice message recording, storage, and playback
import { Server } from 'socket.io';
import { Message } from '../models/Message';
import { Chat } from '../models/Chat';
import { User } from '../models/User';
import logger from '../utils/logger';
import path from 'path';
import fs from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';

interface VoiceNoteData {
  chatId: string;
  duration: number; // in seconds
  waveform?: number[]; // Audio waveform data for visualization
  audioBlob: Buffer;
  format: 'webm' | 'mp3' | 'wav' | 'ogg';
}

interface VoiceNoteMetadata {
  id: string;
  duration: number;
  format: string;
  size: number;
  waveform?: number[];
  url: string;
}

class VoiceNotesService {
  private io: Server;
  private uploadDir: string;
  private maxDuration: number = 300; // 5 minutes max
  private maxFileSize: number = 10 * 1024 * 1024; // 10MB max

  constructor(io: Server) {
    this.io = io;
    this.uploadDir = path.join(process.cwd(), 'uploads', 'voice-notes');
    this.ensureUploadDirectory();
  }

  private async ensureUploadDirectory(): Promise<void> {
    try {
      await fs.access(this.uploadDir);
    } catch {
      await fs.mkdir(this.uploadDir, { recursive: true });
      logger.info('Created voice notes upload directory');
    }
  }

  // Process and save voice note
  async saveVoiceNote(
    senderId: string,
    data: VoiceNoteData
  ): Promise<VoiceNoteMetadata | null> {
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
      const fileId = uuidv4();
      const filename = `${fileId}.${data.format}`;
      const filepath = path.join(this.uploadDir, filename);

      // Save audio file
      await fs.writeFile(filepath, data.audioBlob);

      // Generate URL (this would be your server's file serving endpoint)
      const url = `/api/voice-notes/${filename}`;

      const metadata: VoiceNoteMetadata = {
        id: fileId,
        duration: data.duration,
        format: data.format,
        size: data.audioBlob.length,
        waveform: data.waveform,
        url
      };

      logger.info(`Voice note saved: ${filename} (${data.duration}s, ${data.audioBlob.length} bytes)`);
      return metadata;

    } catch (error) {
      logger.error('Error saving voice note:', error);
      return null;
    }
  }

  // Create voice message in database
  async createVoiceMessage(
    senderId: string,
    chatId: string,
    voiceMetadata: VoiceNoteMetadata,
    replyTo?: string
  ): Promise<any> {
    try {
      // Verify user is participant in the chat
      const chat = await Chat.findById(chatId);
      if (!chat || !chat.participants.includes(senderId as any)) {
        throw new Error('Not authorized to send message to this chat');
      }

      // Create voice message
      const message = new Message({
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

    } catch (error) {
      logger.error('Error creating voice message:', error);
      throw error;
    }
  }

  // Handle voice note upload via socket
  async handleVoiceNoteUpload(
    socket: any,
    userId: string,
    data: {
      chatId: string;
      audioData: string; // Base64 encoded audio
      duration: number;
      format: 'webm' | 'mp3' | 'wav' | 'ogg';
      waveform?: number[];
      replyTo?: string;
    }
  ): Promise<void> {
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
      const message = await this.createVoiceMessage(
        userId,
        data.chatId,
        metadata,
        data.replyTo
      );

      // Populate sender info
      await message.populate('sender', 'username avatar');
      if (data.replyTo) {
        await message.populate('replyTo', 'content sender');
      }

      // Broadcast voice message to chat participants
      this.io.to(data.chatId).emit('new-voice-message', {
        id: (message._id as any).toString(),
        chatId: message.chat,
        sender: {
          id: message.sender._id,
          username: (message.sender as any).username,
          avatar: (message.sender as any).avatar
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
        messageId: (message._id as any).toString(),
        metadata
      });

      logger.info(`Voice note sent by user ${userId} to chat ${data.chatId}`);

    } catch (error) {
      logger.error('Error handling voice note upload:', error);
      socket.emit('voice-note-error', { 
        message: error instanceof Error ? error.message : 'Failed to send voice note' 
      });
    }
  }

  // Generate waveform data from audio buffer (simplified version)
  async generateWaveform(audioBuffer: Buffer, samples: number = 50): Promise<number[]> {
    try {
      // This is a simplified waveform generation
      // In a real implementation, you'd use an audio processing library
      const waveform: number[] = [];
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
    } catch (error) {
      logger.error('Error generating waveform:', error);
      return Array(samples).fill(50); // Return flat waveform as fallback
    }
  }

  // Start voice recording session
  startRecording(socket: any, userId: string, chatId: string): void {
    socket.emit('voice-recording-started', {
      chatId,
      maxDuration: this.maxDuration,
      supportedFormats: ['webm', 'mp3', 'wav', 'ogg']
    });

    logger.debug(`User ${userId} started voice recording in chat ${chatId}`);
  }

  // Cancel voice recording
  cancelRecording(socket: any, userId: string, chatId: string): void {
    socket.emit('voice-recording-cancelled', { chatId });
    logger.debug(`User ${userId} cancelled voice recording in chat ${chatId}`);
  }

  // Get voice note file for serving
  async getVoiceNoteFile(filename: string): Promise<Buffer | null> {
    try {
      const filepath = path.join(this.uploadDir, filename);
      const fileBuffer = await fs.readFile(filepath);
      return fileBuffer;
    } catch (error) {
      logger.error('Error reading voice note file:', error);
      return null;
    }
  }

  // Delete voice note file
  async deleteVoiceNote(filename: string): Promise<boolean> {
    try {
      const filepath = path.join(this.uploadDir, filename);
      await fs.unlink(filepath);
      logger.info(`Deleted voice note: ${filename}`);
      return true;
    } catch (error) {
      logger.error('Error deleting voice note:', error);
      return false;
    }
  }

  // Handle voice note recording start
  handleVoiceNoteStart(socket: any, chatId: string, userId: string) {
    // Notify chat participants that user started recording
    socket.to(chatId).emit('voice-note-recording', {
      userId,
      chatId,
      action: 'start'
    });
    
    logger.info(`User ${userId} started recording voice note in chat ${chatId}`);
  }

  // Handle voice note recording stop
  handleVoiceNoteStop(socket: any, chatId: string, userId: string) {
    // Notify chat participants that user stopped recording
    socket.to(chatId).emit('voice-note-recording', {
      userId,
      chatId,
      action: 'stop'
    });
    
    logger.info(`User ${userId} stopped recording voice note in chat ${chatId}`);
  }

  // Helper methods
  private formatDuration(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  private getMimeType(format: string): string {
    const mimeTypes: { [key: string]: string } = {
      'webm': 'audio/webm',
      'mp3': 'audio/mpeg',
      'wav': 'audio/wav',
      'ogg': 'audio/ogg'
    };
    return mimeTypes[format] || 'audio/webm';
  }

  // Cleanup old voice notes (run periodically)
  async cleanupOldVoiceNotes(daysOld: number = 30): Promise<void> {
    try {
      const files = await fs.readdir(this.uploadDir);
      const now = new Date();
      let deletedCount = 0;

      for (const file of files) {
        const filepath = path.join(this.uploadDir, file);
        const stats = await fs.stat(filepath);
        const daysDiff = (now.getTime() - stats.mtime.getTime()) / (1000 * 60 * 60 * 24);

        if (daysDiff > daysOld) {
          await fs.unlink(filepath);
          deletedCount++;
        }
      }

      if (deletedCount > 0) {
        logger.info(`Cleaned up ${deletedCount} old voice notes`);
      }
    } catch (error) {
      logger.error('Error cleaning up old voice notes:', error);
    }
  }
}

export default VoiceNotesService;
