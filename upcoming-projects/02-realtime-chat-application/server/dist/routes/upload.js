"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const sharp_1 = __importDefault(require("sharp"));
const path_1 = __importDefault(require("path"));
const uuid_1 = require("uuid");
const fs_1 = __importDefault(require("fs"));
const auth_1 = require("../middleware/auth");
const logger_1 = __importDefault(require("../utils/logger"));
const router = express_1.default.Router();
// Configure multer for file uploads
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({
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
        }
        else {
            cb(new Error('File type not allowed'));
        }
    }
});
// Ensure uploads directory exists
const uploadsDir = 'uploads';
const avatarsDir = path_1.default.join(uploadsDir, 'avatars');
const filesDir = path_1.default.join(uploadsDir, 'files');
[uploadsDir, avatarsDir, filesDir].forEach(dir => {
    if (!fs_1.default.existsSync(dir)) {
        fs_1.default.mkdirSync(dir, { recursive: true });
    }
});
// Upload avatar
router.post('/avatar', auth_1.authenticateToken, upload.single('avatar'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }
        const authReq = req;
        const userId = authReq.user._id;
        const filename = `avatar-${userId}-${(0, uuid_1.v4)()}.webp`;
        const avatarDir = path_1.default.join(__dirname, '../../uploads/avatars');
        const filepath = path_1.default.join(avatarDir, filename);
        // Process image with sharp
        await (0, sharp_1.default)(req.file.buffer)
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
        logger_1.default.info(`Avatar uploaded for user: ${authReq.user.username}`);
        res.json({
            message: 'Avatar uploaded successfully',
            avatarUrl
        });
    }
    catch (error) {
        logger_1.default.error('Error uploading avatar:', error);
        res.status(500).json({ error: 'Failed to upload avatar' });
    }
});
// Upload single file
router.post('/file', auth_1.authenticateToken, upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }
        const authReq = req;
        const userId = authReq.user._id;
        const originalName = req.file.originalname;
        const fileExtension = path_1.default.extname(originalName);
        const filename = `${(0, uuid_1.v4)()}${fileExtension}`;
        const filePath = path_1.default.join(__dirname, '../../uploads/files', filename);
        // Save file to disk
        fs_1.default.writeFileSync(filePath, req.file.buffer);
        const fileUrl = `/uploads/files/${filename}`;
        const fileData = {
            url: fileUrl,
            filename: originalName,
            mimetype: req.file.mimetype,
            size: req.file.size
        };
        logger_1.default.info(`File uploaded by user ${authReq.user.username}: ${originalName}`);
        res.json({
            message: 'File uploaded successfully',
            file: fileData
        });
    }
    catch (error) {
        logger_1.default.error('Error uploading file:', error);
        res.status(500).json({ error: 'Failed to upload file' });
    }
});
// Upload multiple files
router.post('/files', auth_1.authenticateToken, upload.array('files', 5), async (req, res) => {
    try {
        const files = req.files;
        if (!files || files.length === 0) {
            return res.status(400).json({ error: 'No files uploaded' });
        }
        const authReq = req;
        const userId = authReq.user._id;
        const uploadedFiles = [];
        for (const file of files) {
            const originalName = file.originalname;
            const extension = path_1.default.extname(originalName);
            const filename = `${(0, uuid_1.v4)()}${extension}`;
            const filepath = path_1.default.join(filesDir, filename);
            // Save file to disk
            fs_1.default.writeFileSync(filepath, file.buffer);
            const fileData = {
                url: `/uploads/files/${filename}`,
                filename: originalName,
                mimetype: file.mimetype,
                size: file.size
            };
            uploadedFiles.push(fileData);
        }
        logger_1.default.info(`${files.length} files uploaded by user ${authReq.user.username}`);
        res.json({
            message: 'Files uploaded successfully',
            files: uploadedFiles
        });
    }
    catch (error) {
        logger_1.default.error('Error uploading files:', error);
        res.status(500).json({ error: 'Failed to upload files' });
    }
});
// Delete file
router.delete('/file/:filename', auth_1.authenticateToken, async (req, res) => {
    try {
        const { filename } = req.params;
        const authReq = req;
        const userId = authReq.user._id;
        // Check if file exists in files directory
        const filepath = path_1.default.join(filesDir, filename);
        if (!fs_1.default.existsSync(filepath)) {
            return res.status(404).json({ error: 'File not found' });
        }
        // Delete file
        fs_1.default.unlinkSync(filepath);
        logger_1.default.info(`File deleted by user ${authReq.user.username}: ${filename}`);
        res.json({
            message: 'File deleted successfully'
        });
    }
    catch (error) {
        logger_1.default.error('Error deleting file:', error);
        res.status(500).json({ error: 'Failed to delete file' });
    }
});
exports.default = router;
//# sourceMappingURL=upload.js.map