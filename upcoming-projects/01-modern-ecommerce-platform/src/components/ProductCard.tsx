'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { HeartIcon, ShoppingCartIcon, StarIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { useState } from 'react';
import { Product } from '@/types';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      // Show success message or update cart state
    }, 1000);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsWishlisted(!isWishlisted);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <StarIcon
        key={index}
        className={`h-4 w-4 ${
          index < Math.floor(rating)
            ? 'text-yellow-400 fill-current'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white rounded-lg shadow-lg overflow-hidden group"
    >
      <Link href={`/products/${product.slug}`}>
        <div className="relative">
          <div className="aspect-w-1 aspect-h-1 h-64 overflow-hidden">
            <Image
              src={product.images[0]?.url || '/placeholder-product.jpg'}
              alt={product.images[0]?.altText || product.name}
              width={400}
              height={400}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          
          {/* Discount Badge */}
          {product.comparePrice && product.comparePrice > product.price && (
            <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
              {Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)}% OFF
            </div>
          )}

          {/* Wishlist Button */}
          <button
            onClick={handleWishlistToggle}
            className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow"
          >
            {isWishlisted ? (
              <HeartSolidIcon className="h-5 w-5 text-red-500" />
            ) : (
              <HeartIcon className="h-5 w-5 text-gray-600" />
            )}
          </button>

          {/* Quick Add to Cart */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAddToCart}
              disabled={isLoading}
              className="bg-white text-gray-900 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              <ShoppingCartIcon className="h-5 w-5" />
              {isLoading ? 'Adding...' : 'Quick Add'}
            </motion.button>
          </div>
        </div>
      </Link>

      <div className="p-4">
        <Link href={`/products/${product.slug}`}>
          <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-primary-600 transition-colors">
            {product.name}
          </h3>
        </Link>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {product.description}
        </p>

        {/* Rating */}
        {product.rating && (
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center">
              {renderStars(product.rating)}
            </div>
            <span className="text-sm text-gray-500">
              {product.rating} ({product.reviewCount})
            </span>
          </div>
        )}

        {/* Price */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-gray-900">
              ${product.price}
            </span>
            {product.comparePrice && product.comparePrice > product.price && (
              <span className="text-sm text-gray-500 line-through">
                ${product.comparePrice}
              </span>
            )}
          </div>
          
          {/* Stock Status */}
          <div className="text-sm">
            {product.quantity > 10 ? (
              <span className="text-green-600">In Stock</span>
            ) : product.quantity > 0 ? (
              <span className="text-yellow-600">Low Stock</span>
            ) : (
              <span className="text-red-600">Out of Stock</span>
            )}
          </div>
        </div>

        {/* Add to Cart Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleAddToCart}
          disabled={isLoading || product.quantity === 0}
          className="w-full mt-4 bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <ShoppingCartIcon className="h-5 w-5" />
          {isLoading ? 'Adding...' : product.quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
        </motion.button>
      </div>
    </motion.div>
  );
};

export default ProductCard;
