"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// GIF API Routes
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const gifService_1 = __importDefault(require("../services/gifService"));
const logger_1 = __importDefault(require("../utils/logger"));
const router = express_1.default.Router();
const gifService = new gifService_1.default();
// Search GIFs
router.get('/search', auth_1.authenticateToken, async (req, res) => {
    try {
        const { q: query, limit = 20, offset = 0 } = req.query;
        if (!query) {
            return res.status(400).json({ error: 'Search query is required' });
        }
        const result = await gifService.searchGifs(query, parseInt(limit), parseInt(offset));
        res.json({
            success: true,
            gifs: result.data,
            pagination: {
                limit: parseInt(limit),
                offset: parseInt(offset),
                total: result.pagination?.total_count || result.data.length
            }
        });
    }
    catch (error) {
        logger_1.default.error('Error searching GIFs:', error);
        res.status(500).json({ error: 'Failed to search GIFs' });
    }
});
// Get trending GIFs
router.get('/trending', auth_1.authenticateToken, async (req, res) => {
    try {
        const { limit = 20, offset = 0 } = req.query;
        const result = await gifService.getTrendingGifs(parseInt(limit), parseInt(offset));
        res.json({
            success: true,
            gifs: result.data,
            pagination: {
                limit: parseInt(limit),
                offset: parseInt(offset),
                total: result.pagination?.total_count || result.data.length
            }
        });
    }
    catch (error) {
        logger_1.default.error('Error getting trending GIFs:', error);
        res.status(500).json({ error: 'Failed to get trending GIFs' });
    }
});
// Get GIF by ID
router.get('/:gifId', auth_1.authenticateToken, async (req, res) => {
    try {
        const { gifId } = req.params;
        const gif = await gifService.getGifById(gifId);
        if (!gif) {
            return res.status(404).json({ error: 'GIF not found' });
        }
        res.json({
            success: true,
            gif
        });
    }
    catch (error) {
        logger_1.default.error('Error getting GIF by ID:', error);
        res.status(500).json({ error: 'Failed to get GIF' });
    }
});
// Get random GIF
router.get('/random/:tag?', auth_1.authenticateToken, async (req, res) => {
    try {
        const { tag } = req.params;
        const gif = await gifService.getRandomGif(tag);
        if (!gif) {
            return res.status(404).json({ error: 'No random GIF found' });
        }
        res.json({
            success: true,
            gif
        });
    }
    catch (error) {
        logger_1.default.error('Error getting random GIF:', error);
        res.status(500).json({ error: 'Failed to get random GIF' });
    }
});
// Get GIF categories
router.get('/categories/list', auth_1.authenticateToken, async (req, res) => {
    try {
        const categories = await gifService.getCategories();
        res.json({
            success: true,
            categories
        });
    }
    catch (error) {
        logger_1.default.error('Error getting GIF categories:', error);
        res.status(500).json({ error: 'Failed to get categories' });
    }
});
// Validate GIF URL
router.post('/validate', auth_1.authenticateToken, async (req, res) => {
    try {
        const { url } = req.body;
        if (!url) {
            return res.status(400).json({ error: 'URL is required' });
        }
        const isValid = await gifService.validateGifUrl(url);
        res.json({
            success: true,
            isValid,
            url
        });
    }
    catch (error) {
        logger_1.default.error('Error validating GIF URL:', error);
        res.status(500).json({ error: 'Failed to validate GIF URL' });
    }
});
exports.default = router;
//# sourceMappingURL=gif.js.map