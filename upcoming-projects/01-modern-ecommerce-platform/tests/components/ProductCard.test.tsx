import { render, screen } from '@testing-library/react';
import { describe, it, expect } from '@jest/globals';
import ProductCard from '@/components/ProductCard';
import { Product } from '@/types';

const mockProduct: Product = {
  id: '1',
  name: 'Test Product',
  slug: 'test-product',
  description: 'This is a test product',
  price: 99.99,
  comparePrice: 129.99,
  sku: 'TEST-001',
  quantity: 10,
  isActive: true,
  isFeatured: true,
  tags: ['test', 'product'],
  categoryId: '1',
  category: {
    id: '1',
    name: 'Test Category',
    slug: 'test-category',
    isActive: true,
  },
  images: [
    {
      id: '1',
      url: 'https://example.com/image.jpg',
      altText: 'Test Product Image',
      sortOrder: 0,
    },
  ],
  variants: [],
  reviews: [],
  rating: 4.5,
  reviewCount: 20,
};

describe('ProductCard', () => {
  it('renders product information correctly', () => {
    render(<ProductCard product={mockProduct} />);
    
    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('This is a test product')).toBeInTheDocument();
    expect(screen.getByText('$99.99')).toBeInTheDocument();
    expect(screen.getByText('$129.99')).toBeInTheDocument();
    expect(screen.getByText('4.5 (20)')).toBeInTheDocument();
  });

  it('shows discount badge when compare price is higher', () => {
    render(<ProductCard product={mockProduct} />);
    
    const discountBadge = screen.getByText('23% OFF');
    expect(discountBadge).toBeInTheDocument();
  });

  it('shows in stock status', () => {
    render(<ProductCard product={mockProduct} />);
    
    expect(screen.getByText('In Stock')).toBeInTheDocument();
  });

  it('shows out of stock when quantity is 0', () => {
    const outOfStockProduct = { ...mockProduct, quantity: 0 };
    render(<ProductCard product={outOfStockProduct} />);
    
    expect(screen.getByText('Out of Stock')).toBeInTheDocument();
  });
});
