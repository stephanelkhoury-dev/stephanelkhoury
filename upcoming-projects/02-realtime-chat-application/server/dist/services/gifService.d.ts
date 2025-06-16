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
declare class GifService {
    private apiKey;
    private baseUrl;
    constructor();
    searchGifs(query: string, limit?: number, offset?: number): Promise<GifSearchResponse>;
    getTrendingGifs(limit?: number, offset?: number): Promise<GifSearchResponse>;
    getGifById(id: string): Promise<GifSearchResult | null>;
    getRandomGif(tag?: string): Promise<GifSearchResult | null>;
    private formatGifs;
    validateGifUrl(url: string): Promise<boolean>;
    getCategories(): Promise<string[]>;
}
export default GifService;
//# sourceMappingURL=gifService.d.ts.map