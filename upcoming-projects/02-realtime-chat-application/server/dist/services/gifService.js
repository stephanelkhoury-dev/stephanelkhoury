"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// GIF Service - GIPHY API integration for GIF messaging
const axios_1 = __importDefault(require("axios"));
const logger_1 = __importDefault(require("../utils/logger"));
class GifService {
    constructor() {
        this.baseUrl = 'https://api.giphy.com/v1/gifs';
        this.apiKey = process.env.GIPHY_API_KEY || '';
        if (!this.apiKey) {
            logger_1.default.warn('GIPHY_API_KEY not set - GIF functionality will be limited');
        }
    }
    // Search for GIFs
    async searchGifs(query, limit = 20, offset = 0) {
        try {
            if (!this.apiKey) {
                throw new Error('GIPHY API key not configured');
            }
            const response = await axios_1.default.get(`${this.baseUrl}/search`, {
                params: {
                    api_key: this.apiKey,
                    q: query,
                    limit,
                    offset,
                    rating: 'g', // Keep it family-friendly
                    lang: 'en'
                }
            });
            return {
                data: this.formatGifs(response.data.data),
                pagination: response.data.pagination
            };
        }
        catch (error) {
            logger_1.default.error('Error searching GIFs:', error);
            throw new Error('Failed to search GIFs');
        }
    }
    // Get trending GIFs
    async getTrendingGifs(limit = 20, offset = 0) {
        try {
            if (!this.apiKey) {
                throw new Error('GIPHY API key not configured');
            }
            const response = await axios_1.default.get(`${this.baseUrl}/trending`, {
                params: {
                    api_key: this.apiKey,
                    limit,
                    offset,
                    rating: 'g'
                }
            });
            return {
                data: this.formatGifs(response.data.data),
                pagination: response.data.pagination
            };
        }
        catch (error) {
            logger_1.default.error('Error getting trending GIFs:', error);
            throw new Error('Failed to get trending GIFs');
        }
    }
    // Get GIF by ID
    async getGifById(id) {
        try {
            if (!this.apiKey) {
                throw new Error('GIPHY API key not configured');
            }
            const response = await axios_1.default.get(`${this.baseUrl}/${id}`, {
                params: {
                    api_key: this.apiKey
                }
            });
            const formatted = this.formatGifs([response.data.data]);
            return formatted.length > 0 ? formatted[0] : null;
        }
        catch (error) {
            logger_1.default.error('Error getting GIF by ID:', error);
            return null;
        }
    }
    // Get random GIF
    async getRandomGif(tag) {
        try {
            if (!this.apiKey) {
                throw new Error('GIPHY API key not configured');
            }
            const params = {
                api_key: this.apiKey,
                rating: 'g'
            };
            if (tag) {
                params.tag = tag;
            }
            const response = await axios_1.default.get(`${this.baseUrl}/random`, { params });
            const formatted = this.formatGifs([response.data.data]);
            return formatted.length > 0 ? formatted[0] : null;
        }
        catch (error) {
            logger_1.default.error('Error getting random GIF:', error);
            return null;
        }
    }
    // Format GIF data from GIPHY API response
    formatGifs(gifs) {
        return gifs.map(gif => ({
            id: gif.id,
            title: gif.title,
            url: gif.url,
            previewUrl: gif.images.preview_gif?.url || gif.images.fixed_height.url,
            thumbnail: {
                url: gif.images.fixed_height.url,
                width: parseInt(gif.images.fixed_height.width),
                height: parseInt(gif.images.fixed_height.height)
            },
            original: {
                url: gif.images.original.url,
                width: parseInt(gif.images.original.width),
                height: parseInt(gif.images.original.height),
                size: parseInt(gif.images.original.size)
            }
        }));
    }
    // Validate GIF URL
    async validateGifUrl(url) {
        try {
            const response = await axios_1.default.head(url, { timeout: 5000 });
            return response.status === 200 && response.headers['content-type']?.includes('image');
        }
        catch (error) {
            logger_1.default.error('Error validating GIF URL:', error);
            return false;
        }
    }
    // Get categories for GIF suggestions
    async getCategories() {
        // Return popular GIF categories
        return [
            'funny',
            'happy',
            'sad',
            'angry',
            'love',
            'excited',
            'surprised',
            'confused',
            'thumbs up',
            'applause',
            'dance',
            'celebration',
            'good morning',
            'good night',
            'thank you',
            'hello',
            'goodbye',
            'yes',
            'no',
            'maybe'
        ];
    }
}
exports.default = GifService;
//# sourceMappingURL=gifService.js.map