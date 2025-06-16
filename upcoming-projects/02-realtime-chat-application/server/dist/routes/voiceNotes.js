"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Voice Notes API Routes
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const auth_1 = require("../middleware/auth");
const logger_1 = __importDefault(require("../utils/logger"));
const router = express_1.default.Router();
// Serve voice note files directly
router.get('/file/:filename', auth_1.authenticateToken, async (req, res) => {
    try {
        const { filename } = req.params;
        const filePath = path_1.default.join(process.cwd(), 'uploads', 'voice-notes', filename);
        // Check if file exists
        if (!fs_1.default.existsSync(filePath)) {
            return res.status(404).json({ error: 'Voice note not found' });
        }
        // Get file stats
        const stats = fs_1.default.statSync(filePath);
        // Set appropriate headers
        const ext = path_1.default.extname(filename).toLowerCase();
        const mimeTypes = {
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
        const fileStream = fs_1.default.createReadStream(filePath);
        fileStream.pipe(res);
    }
    catch (error) {
        logger_1.default.error('Error serving voice note file:', error);
        res.status(500).json({ error: 'Failed to serve voice note' });
    }
});
// Upload voice note via HTTP (alternative to socket)
router.post('/upload', auth_1.authenticateToken, async (req, res) => {
    try {
        const authReq = req;
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
        const uploadDir = path_1.default.join(process.cwd(), 'uploads', 'voice-notes');
        // Ensure upload directory exists
        if (!fs_1.default.existsSync(uploadDir)) {
            fs_1.default.mkdirSync(uploadDir, { recursive: true });
        }
        const filePath = path_1.default.join(uploadDir, filename);
        // Save file
        fs_1.default.writeFileSync(filePath, audioBuffer);
        const result = {
            filename,
            duration,
            size: audioBuffer.length,
            url: `/api/voice-notes/file/${filename}`,
            format
        };
        logger_1.default.info(`Voice note uploaded via HTTP by user ${userId}: ${filename}`);
        res.json(result);
    }
    catch (error) {
        logger_1.default.error('Error uploading voice note via HTTP:', error);
        res.status(500).json({ error: 'Failed to upload voice note' });
    }
});
// Get voice note info
router.get('/info/:filename', auth_1.authenticateToken, async (req, res) => {
    try {
        const authReq = req;
        const { filename } = req.params;
        const filePath = path_1.default.join(process.cwd(), 'uploads', 'voice-notes', filename);
        if (!fs_1.default.existsSync(filePath)) {
            return res.status(404).json({ error: 'Voice note not found' });
        }
        const stats = fs_1.default.statSync(filePath);
        const ext = path_1.default.extname(filename).toLowerCase().substring(1);
        const info = {
            filename,
            size: stats.size,
            format: ext,
            url: `/api/voice-notes/file/${filename}`,
            createdAt: stats.birthtime
        };
        res.json(info);
    }
    catch (error) {
        logger_1.default.error('Error getting voice note info:', error);
        res.status(500).json({ error: 'Failed to get voice note info' });
    }
});
// Delete voice note
router.delete('/:filename', auth_1.authenticateToken, async (req, res) => {
    try {
        const authReq = req;
        const { filename } = req.params;
        const userId = authReq.user?._id;
        const filePath = path_1.default.join(process.cwd(), 'uploads', 'voice-notes', filename);
        if (!fs_1.default.existsSync(filePath)) {
            return res.status(404).json({ error: 'Voice note not found' });
        }
        // Delete the file
        fs_1.default.unlinkSync(filePath);
        logger_1.default.info(`Voice note deleted by user ${userId}: ${filename}`);
        res.json({ message: 'Voice note deleted successfully' });
    }
    catch (error) {
        logger_1.default.error('Error deleting voice note:', error);
        res.status(500).json({ error: 'Failed to delete voice note' });
    }
});
exports.default = router;
//# sourceMappingURL=voiceNotes.js.map