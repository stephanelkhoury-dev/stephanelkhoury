// GIF API Routes
import express, { Request, Response } from 'express';
import { authenticateToken } from '../middleware/auth';
import GifService from '../services/gifService';
import logger from '../utils/logger';

const router = express.Router();
const gifService = new GifService();

// Search GIFs
router.get('/search', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { q: query, limit = 20, offset = 0 } = req.query;

    if (!query) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    const result = await gifService.searchGifs(query as string, parseInt(limit as string), parseInt(offset as string));
    
    res.json({
      success: true,
      gifs: result.data,
      pagination: {
        limit: parseInt(limit as string),
        offset: parseInt(offset as string),
        total: result.pagination?.total_count || result.data.length
      }
    });

  } catch (error) {
    logger.error('Error searching GIFs:', error);
    res.status(500).json({ error: 'Failed to search GIFs' });
  }
});

// Get trending GIFs
router.get('/trending', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { limit = 20, offset = 0 } = req.query;

    const result = await gifService.getTrendingGifs(parseInt(limit as string), parseInt(offset as string));
    
    res.json({
      success: true,
      gifs: result.data,
      pagination: {
        limit: parseInt(limit as string),
        offset: parseInt(offset as string),
        total: result.pagination?.total_count || result.data.length
      }
    });

  } catch (error) {
    logger.error('Error getting trending GIFs:', error);
    res.status(500).json({ error: 'Failed to get trending GIFs' });
  }
});

// Get GIF by ID
router.get('/:gifId', authenticateToken, async (req: Request, res: Response) => {
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

  } catch (error) {
    logger.error('Error getting GIF by ID:', error);
    res.status(500).json({ error: 'Failed to get GIF' });
  }
});

// Get random GIF
router.get('/random/:tag?', authenticateToken, async (req: Request, res: Response) => {
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

  } catch (error) {
    logger.error('Error getting random GIF:', error);
    res.status(500).json({ error: 'Failed to get random GIF' });
  }
});

// Get GIF categories
router.get('/categories/list', authenticateToken, async (req: Request, res: Response) => {
  try {
    const categories = await gifService.getCategories();
    
    res.json({
      success: true,
      categories
    });

  } catch (error) {
    logger.error('Error getting GIF categories:', error);
    res.status(500).json({ error: 'Failed to get categories' });
  }
});

// Validate GIF URL
router.post('/validate', authenticateToken, async (req: Request, res: Response) => {
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

  } catch (error) {
    logger.error('Error validating GIF URL:', error);
    res.status(500).json({ error: 'Failed to validate GIF URL' });
  }
});

export default router;
