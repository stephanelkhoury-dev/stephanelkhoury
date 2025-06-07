'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { 
  MinusIcon, 
  PlusIcon, 
  TrashIcon, 
  ShoppingBagIcon,
  CreditCardIcon,
  TruckIcon 
} from '@heroicons/react/24/outline';

interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  price: number;
  product: {
    id: string;
    name: string;
    slug: string;
    images: Array<{
      url: string;
      altText: string;
    }>;
  };
}

interface Cart {
  id: string;
  items: CartItem[];
  total: number;
}

const CartPage = () => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const response = await fetch('/api/cart', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      
      if (data.success) {
        setCart(data.data);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) return;
    
    setUpdating(itemId);
    try {
      const response = await fetch(`/api/cart/${itemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ quantity: newQuantity }),
      });
      
      if (response.ok) {
        await fetchCart();
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
    } finally {
      setUpdating(null);
    }
  };

  const removeItem = async (itemId: string) => {
    setUpdating(itemId);
    try {
      const response = await fetch(`/api/cart/${itemId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      
      if (response.ok) {
        await fetchCart();
      }
    } catch (error) {
      console.error('Error removing item:', error);
    } finally {
      setUpdating(null);
    }
  };

  const calculateSubtotal = () => {
    if (!cart) return 0;
    return cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const calculateTax = () => {
    return calculateSubtotal() * 0.08; // 8% tax
  };

  const calculateShipping = () => {
    return calculateSubtotal() > 100 ? 0 : 10; // Free shipping over $100
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax() + calculateShipping();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <ShoppingBagIcon className="h-24 w-24 text-gray-400 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
        <p className="text-gray-600 mb-8">Start shopping to add items to your cart</p>
        <Link
          href="/products"
          className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              {cart.items.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-6 border-b last:border-b-0"
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <Image
                        src={item.product.images[0]?.url || '/placeholder-product.jpg'}
                        alt={item.product.images[0]?.altText || item.product.name}
                        width={100}
                        height={100}
                        className="rounded-lg object-cover"
                      />
                    </div>
                    
                    <div className="flex-1">
                      <Link href={`/products/${item.product.slug}`}>
                        <h3 className="text-lg font-semibold text-gray-900 hover:text-primary-600 transition-colors">
                          {item.product.name}
                        </h3>
                      </Link>
                      <p className="text-gray-600">${item.price.toFixed(2)} each</p>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        disabled={updating === item.id || item.quantity <= 1}
                        className="p-1 rounded-full border border-gray-300 hover:bg-gray-100 disabled:opacity-50"
                      >
                        <MinusIcon className="h-4 w-4" />
                      </button>
                      
                      <span className="w-12 text-center font-semibold">
                        {item.quantity}
                      </span>
                      
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        disabled={updating === item.id}
                        className="p-1 rounded-full border border-gray-300 hover:bg-gray-100 disabled:opacity-50"
                      >
                        <PlusIcon className="h-4 w-4" />
                      </button>
                    </div>
                    
                    <div className="text-lg font-semibold text-gray-900">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                    
                    <button
                      onClick={() => removeItem(item.id)}
                      disabled={updating === item.id}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors disabled:opacity-50"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">${calculateSubtotal().toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-semibold">${calculateTax().toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-semibold">
                    {calculateShipping() === 0 ? 'FREE' : `$${calculateShipping().toFixed(2)}`}
                  </span>
                </div>
                
                {calculateSubtotal() < 100 && (
                  <div className="flex items-center text-sm text-primary-600">
                    <TruckIcon className="h-4 w-4 mr-1" />
                    <span>Free shipping on orders over $100</span>
                  </div>
                )}
                
                <div className="border-t pt-3">
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold">Total</span>
                    <span className="text-lg font-bold text-primary-600">
                      ${calculateTotal().toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
              
              <Link
                href="/checkout"
                className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                <CreditCardIcon className="h-5 w-5" />
                <span>Proceed to Checkout</span>
              </Link>
              
              <Link
                href="/products"
                className="w-full mt-3 border border-gray-300 text-gray-700 font-semibold py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors text-center block"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
