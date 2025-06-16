import express, { Request, Response } from 'express';
import multer from 'multer';
import sharp from 'sharp';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import { authenticateToken } from '../middleware/auth';
import logger from '../utils/logger';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow images and common file types
    const allowedMimes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'application/pdf',
      'text/plain',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('File type not allowed'));
    }
  }
});

// Ensure uploads directory exists
const uploadsDir = 'uploads';
const avatarsDir = path.join(uploadsDir, 'avatars');
const filesDir = path.join(uploadsDir, 'files');

[uploadsDir, avatarsDir, filesDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Upload avatar
router.post('/avatar', authenticateToken, upload.single('avatar'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const authReq = req as any;
    const userId = authReq.user._id;
    const filename = `avatar-${userId}-${uuidv4()}.webp`;
    const avatarDir = path.join(__dirname, '../../uploads/avatars');
    const filepath = path.join(avatarDir, filename);

    // Process image with sharp
    await sharp(req.file.buffer)
      .resize(200, 200, {
        fit: 'cover',
        position: 'center'
      })
      .webp({ quality: 90 })
      .toFile(filepath);

    // Update user's avatar in database
    const User = require('../models/User').User;
    const avatarUrl = `/uploads/avatars/${filename}`;
    
    await User.findByIdAndUpdate(userId, { avatar: avatarUrl });

    logger.info(`Avatar uploaded for user: ${authReq.user.username}`);

    res.json({
      message: 'Avatar uploaded successfully',
      avatarUrl
    });
  } catch (error) {
    logger.error('Error uploading avatar:', error);
    res.status(500).json({ error: 'Failed to upload avatar' });
  }
});

// Upload single file
router.post('/file', authenticateToken, upload.single('file'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const authReq = req as any;
    const userId = authReq.user._id;
    const originalName = req.file.originalname;
    const fileExtension = path.extname(originalName);
    const filename = `${uuidv4()}${fileExtension}`;
    const filePath = path.join(__dirname, '../../uploads/files', filename);

    // Save file to disk
    fs.writeFileSync(filePath, req.file.buffer);

    const fileUrl = `/uploads/files/${filename}`;
    const fileData = {
      url: fileUrl,
      filename: originalName,
      mimetype: req.file.mimetype,
      size: req.file.size
    };

    logger.info(`File uploaded by user ${authReq.user.username}: ${originalName}`);

    res.json({
      message: 'File uploaded successfully',
      file: fileData
    });
  } catch (error) {
    logger.error('Error uploading file:', error);
    res.status(500).json({ error: 'Failed to upload file' });
  }
});

// Upload multiple files
router.post('/files', authenticateToken, upload.array('files', 5), async (req: Request, res: Response) => {
  try {
    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    const authReq = req as any;
    const userId = authReq.user._id;
    const uploadedFiles = [];

    for (const file of files) {
      const originalName = file.originalname;
      const extension = path.extname(originalName);
      const filename = `${uuidv4()}${extension}`;
      const filepath = path.join(filesDir, filename);

      // Save file to disk
      fs.writeFileSync(filepath, file.buffer);

      const fileData = {
        url: `/uploads/files/${filename}`,
        filename: originalName,
        mimetype: file.mimetype,
        size: file.size
      };

      uploadedFiles.push(fileData);
    }

    logger.info(`${files.length} files uploaded by user ${authReq.user.username}`);

    res.json({
      message: 'Files uploaded successfully',
      files: uploadedFiles
    });
  } catch (error) {
    logger.error('Error uploading files:', error);
    res.status(500).json({ error: 'Failed to upload files' });
  }
});

// Delete file
router.delete('/file/:filename', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { filename } = req.params;
    const authReq = req as any;
    const userId = authReq.user._id;

    // Check if file exists in files directory
    const filepath = path.join(filesDir, filename);
    
    if (!fs.existsSync(filepath)) {
      return res.status(404).json({ error: 'File not found' });
    }

    // Delete file
    fs.unlinkSync(filepath);

    logger.info(`File deleted by user ${authReq.user.username}: ${filename}`);

    res.json({
      message: 'File deleted successfully'
    });
  } catch (error) {
    logger.error('Error deleting file:', error);
    res.status(500).json({ error: 'Failed to delete file' });
  }
});

export default router;
