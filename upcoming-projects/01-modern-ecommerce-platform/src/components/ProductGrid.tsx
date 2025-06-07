'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ProductCard from './ProductCard';
import { Product } from '@/types';

// Mock data for demonstration
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Premium Wireless Headphones',
    slug: 'premium-wireless-headphones',
    description: 'High-quality wireless headphones with noise cancellation',
    price: 299.99,
    comparePrice: 399.99,
    sku: 'WH-001',
    quantity: 50,
    isActive: true,
    isFeatured: true,
    tags: ['electronics', 'audio', 'wireless'],
    categoryId: '1',
    category: {
      id: '1',
      name: 'Electronics',
      slug: 'electronics',
      isActive: true
    },
    images: [
      {
        id: '1',
        url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
        altText: 'Premium Wireless Headphones',
        sortOrder: 0
      }
    ],
    variants: [],
    reviews: [],
    rating: 4.5,
    reviewCount: 128
  },
  {
    id: '2',
    name: 'Smart Fitness Watch',
    slug: 'smart-fitness-watch',
    description: 'Advanced fitness tracking with heart rate monitoring',
    price: 199.99,
    sku: 'SW-002',
    quantity: 75,
    isActive: true,
    isFeatured: true,
    tags: ['fitness', 'smartwatch', 'health'],
    categoryId: '1',
    category: {
      id: '1',
      name: 'Electronics',
      slug: 'electronics',
      isActive: true
    },
    images: [
      {
        id: '2',
        url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500',
        altText: 'Smart Fitness Watch',
        sortOrder: 0
      }
    ],
    variants: [],
    reviews: [],
    rating: 4.3,
    reviewCount: 89
  },
  {
    id: '3',
    name: 'Organic Cotton T-Shirt',
    slug: 'organic-cotton-tshirt',
    description: 'Comfortable and sustainable organic cotton t-shirt',
    price: 29.99,
    sku: 'TS-003',
    quantity: 100,
    isActive: true,
    isFeatured: true,
    tags: ['clothing', 'organic', 'cotton'],
    categoryId: '2',
    category: {
      id: '2',
      name: 'Clothing',
      slug: 'clothing',
      isActive: true
    },
    images: [
      {
        id: '3',
        url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500',
        altText: 'Organic Cotton T-Shirt',
        sortOrder: 0
      }
    ],
    variants: [],
    reviews: [],
    rating: 4.7,
    reviewCount: 156
  },
  {
    id: '4',
    name: 'Professional Camera',
    slug: 'professional-camera',
    description: 'High-end DSLR camera for professional photography',
    price: 1299.99,
    comparePrice: 1499.99,
    sku: 'CAM-004',
    quantity: 25,
    isActive: true,
    isFeatured: true,
    tags: ['camera', 'photography', 'professional'],
    categoryId: '1',
    category: {
      id: '1',
      name: 'Electronics',
      slug: 'electronics',
      isActive: true
    },
    images: [
      {
        id: '4',
        url: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=500',
        altText: 'Professional Camera',
        sortOrder: 0
      }
    ],
    variants: [],
    reviews: [],
    rating: 4.8,
    reviewCount: 67
  },
  {
    id: '5',
    name: 'Ergonomic Office Chair',
    slug: 'ergonomic-office-chair',
    description: 'Comfortable ergonomic office chair for long work sessions',
    price: 449.99,
    sku: 'CH-005',
    quantity: 30,
    isActive: true,
    isFeatured: true,
    tags: ['furniture', 'office', 'ergonomic'],
    categoryId: '3',
    category: {
      id: '3',
      name: 'Furniture',
      slug: 'furniture',
      isActive: true
    },
    images: [
      {
        id: '5',
        url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500',
        altText: 'Ergonomic Office Chair',
        sortOrder: 0
      }
    ],
    variants: [],
    reviews: [],
    rating: 4.4,
    reviewCount: 94
  },
  {
    id: '6',
    name: 'Stainless Steel Water Bottle',
    slug: 'stainless-steel-water-bottle',
    description: 'Insulated stainless steel water bottle, keeps drinks cold for 24 hours',
    price: 34.99,
    sku: 'WB-006',
    quantity: 200,
    isActive: true,
    isFeatured: true,
    tags: ['drinkware', 'stainless steel', 'insulated'],
    categoryId: '4',
    category: {
      id: '4',
      name: 'Accessories',
      slug: 'accessories',
      isActive: true
    },
    images: [
      {
        id: '6',
        url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500',
        altText: 'Stainless Steel Water Bottle',
        sortOrder: 0
      }
    ],
    variants: [],
    reviews: [],
    rating: 4.6,
    reviewCount: 203
  }
];

interface ProductGridProps {
  limit?: number;
  categoryId?: string;
  featured?: boolean;
}

const ProductGrid = ({ limit = 6, categoryId, featured = true }: ProductGridProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      let filteredProducts = mockProducts;
      
      if (categoryId) {
        filteredProducts = filteredProducts.filter(p => p.categoryId === categoryId);
      }
      
      if (featured) {
        filteredProducts = filteredProducts.filter(p => p.isFeatured);
      }
      
      setProducts(filteredProducts.slice(0, limit));
      setLoading(false);
    }, 1000);
  }, [limit, categoryId, featured]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {Array.from({ length: limit }).map((_, index) => (
          <div
            key={index}
            className="bg-gray-200 animate-pulse rounded-lg h-96"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {products.map((product, index) => (
        <motion.div
          key={product.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <ProductCard product={product} />
        </motion.div>
      ))}
    </div>
  );
};

export default ProductGrid;
