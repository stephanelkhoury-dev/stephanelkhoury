// GIF Service - GIPHY API integration for GIF messaging
import axios from 'axios';
import logger from '../utils/logger';

interface GiphyGif {
  id: string;
  title: string;
  url: string;
  images: {
    original: {
      url: string;
      width: string;
      height: string;
      size: string;
    };
    preview_gif: {
      url: string;
      width: string;
      height: string;
      size: string;
    };
    fixed_height: {
      url: string;
      width: string;
      height: string;
      size: string;
    };
    fixed_width: {
      url: string;
      width: string;
      height: string;
      size: string;
    };
  };
}

interface GifSearchResult {
  id: string;
  title: string;
  url: string;
  previewUrl: string;
  thumbnail: {
    url: string;
    width: number;
    height: number;
  };
  original: {
    url: string;
    width: number;
    height: number;
    size: number;
  };
}

interface GifSearchResponse {
  data: GifSearchResult[];
  pagination: {
    total_count: number;
    count: number;
    offset: number;
  };
}

class GifService {
  private apiKey: string;
  private baseUrl: string = 'https://api.giphy.com/v1/gifs';

  constructor() {
    this.apiKey = process.env.GIPHY_API_KEY || '';
    if (!this.apiKey) {
      logger.warn('GIPHY_API_KEY not set - GIF functionality will be limited');
    }
  }

  // Search for GIFs
  async searchGifs(query: string, limit: number = 20, offset: number = 0): Promise<GifSearchResponse> {
    try {
      if (!this.apiKey) {
        throw new Error('GIPHY API key not configured');
      }

      const response = await axios.get(`${this.baseUrl}/search`, {
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

    } catch (error) {
      logger.error('Error searching GIFs:', error);
      throw new Error('Failed to search GIFs');
    }
  }

  // Get trending GIFs
  async getTrendingGifs(limit: number = 20, offset: number = 0): Promise<GifSearchResponse> {
    try {
      if (!this.apiKey) {
        throw new Error('GIPHY API key not configured');
      }

      const response = await axios.get(`${this.baseUrl}/trending`, {
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

    } catch (error) {
      logger.error('Error getting trending GIFs:', error);
      throw new Error('Failed to get trending GIFs');
    }
  }

  // Get GIF by ID
  async getGifById(id: string): Promise<GifSearchResult | null> {
    try {
      if (!this.apiKey) {
        throw new Error('GIPHY API key not configured');
      }

      const response = await axios.get(`${this.baseUrl}/${id}`, {
        params: {
          api_key: this.apiKey
        }
      });

      const formatted = this.formatGifs([response.data.data]);
      return formatted.length > 0 ? formatted[0] : null;

    } catch (error) {
      logger.error('Error getting GIF by ID:', error);
      return null;
    }
  }

  // Get random GIF
  async getRandomGif(tag?: string): Promise<GifSearchResult | null> {
    try {
      if (!this.apiKey) {
        throw new Error('GIPHY API key not configured');
      }

      const params: any = {
        api_key: this.apiKey,
        rating: 'g'
      };

      if (tag) {
        params.tag = tag;
      }

      const response = await axios.get(`${this.baseUrl}/random`, { params });

      const formatted = this.formatGifs([response.data.data]);
      return formatted.length > 0 ? formatted[0] : null;

    } catch (error) {
      logger.error('Error getting random GIF:', error);
      return null;
    }
  }

  // Format GIF data from GIPHY API response
  private formatGifs(gifs: GiphyGif[]): GifSearchResult[] {
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
  async validateGifUrl(url: string): Promise<boolean> {
    try {
      const response = await axios.head(url, { timeout: 5000 });
      return response.status === 200 && response.headers['content-type']?.includes('image');
    } catch (error) {
      logger.error('Error validating GIF URL:', error);
      return false;
    }
  }

  // Get categories for GIF suggestions
  async getCategories(): Promise<string[]> {
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

export default GifService;
