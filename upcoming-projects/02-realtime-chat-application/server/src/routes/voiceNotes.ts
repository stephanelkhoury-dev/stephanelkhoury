// Voice Notes API Routes
import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { authenticateToken, AuthUser } from '../middleware/auth';
import logger from '../utils/logger';

// Type-safe request interface
interface AuthenticatedRequest extends Request {
  user?: AuthUser;
}

const router = express.Router();

// Serve voice note files directly
router.get('/file/:filename', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { filename } = req.params;
    const filePath = path.join(process.cwd(), 'uploads', 'voice-notes', filename);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'Voice note not found' });
    }

    // Get file stats
    const stats = fs.statSync(filePath);
    
    // Set appropriate headers
    const ext = path.extname(filename).toLowerCase();
    const mimeTypes: { [key: string]: string } = {
      '.webm': 'audio/webm',
      '.mp3': 'audio/mpeg',
      '.wav': 'audio/wav',
      '.ogg': 'audio/ogg'
    };

    const mimeType = mimeTypes[ext] || 'application/octet-stream';
    res.setHeader('Content-Type', mimeType);
    res.setHeader('Content-Length', stats.size);
    res.setHeader('Cache-Control', 'public, max-age=86400'); // 24 hours

    // Stream the file
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);

  } catch (error) {
    logger.error('Error serving voice note file:', error);
    res.status(500).json({ error: 'Failed to serve voice note' });
  }
});

// Upload voice note via HTTP (alternative to socket)
router.post('/upload', authenticateToken, async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const { audioData, duration, format = 'webm' } = req.body;
    const userId = authReq.user?._id;

    if (!audioData || !duration) {
      return res.status(400).json({ error: 'Audio data and duration are required' });
    }

    // Validate duration (max 5 minutes)
    if (duration > 300) {
      return res.status(400).json({ error: 'Voice note too long (max 5 minutes)' });
    }

    // Convert base64 to buffer
    const audioBuffer = Buffer.from(audioData, 'base64');

    // Validate file size (max 10MB)
    if (audioBuffer.length > 10 * 1024 * 1024) {
      return res.status(400).json({ error: 'File too large (max 10MB)' });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const filename = `voice_${timestamp}_${userId}.${format}`;
    const uploadDir = path.join(process.cwd(), 'uploads', 'voice-notes');
    
    // Ensure upload directory exists
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filePath = path.join(uploadDir, filename);

    // Save file
    fs.writeFileSync(filePath, audioBuffer);

    const result = {
      filename,
      duration,
      size: audioBuffer.length,
      url: `/api/voice-notes/file/${filename}`,
      format
    };
    
    logger.info(`Voice note uploaded via HTTP by user ${userId}: ${filename}`);
    
    res.json(result);

  } catch (error) {
    logger.error('Error uploading voice note via HTTP:', error);
    res.status(500).json({ error: 'Failed to upload voice note' });
  }
});

// Get voice note info
router.get('/info/:filename', authenticateToken, async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const { filename } = req.params;
    const filePath = path.join(process.cwd(), 'uploads', 'voice-notes', filename);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'Voice note not found' });
    }

    const stats = fs.statSync(filePath);
    const ext = path.extname(filename).toLowerCase().substring(1);

    const info = {
      filename,
      size: stats.size,
      format: ext,
      url: `/api/voice-notes/file/${filename}`,
      createdAt: stats.birthtime
    };

    res.json(info);

  } catch (error) {
    logger.error('Error getting voice note info:', error);
    res.status(500).json({ error: 'Failed to get voice note info' });
  }
});

// Delete voice note
router.delete('/:filename', authenticateToken, async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const { filename } = req.params;
    const userId = authReq.user?._id;
    const filePath = path.join(process.cwd(), 'uploads', 'voice-notes', filename);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'Voice note not found' });
    }

    // Delete the file
    fs.unlinkSync(filePath);
    
    logger.info(`Voice note deleted by user ${userId}: ${filename}`);
    res.json({ message: 'Voice note deleted successfully' });

  } catch (error) {
    logger.error('Error deleting voice note:', error);
    res.status(500).json({ error: 'Failed to delete voice note' });
  }
});

export default router;
