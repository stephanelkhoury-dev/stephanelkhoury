'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { loadStripe } from '@stripe/stripe-js';
import { 
  CreditCardIcon, 
  MapPinIcon, 
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  price: number;
  product: {
    name: string;
    images: Array<{
      url: string;
      altText: string;
    }>;
  };
}

interface Cart {
  items: CartItem[];
  total: number;
}

interface ShippingAddress {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

const CheckoutPage = () => {
  const router = useRouter();
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState(1);
  
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
  });

  const [paymentMethod, setPaymentMethod] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    nameOnCard: '',
  });

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
        if (data.data.items.length === 0) {
          router.push('/cart');
        }
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
      setError('Failed to load cart');
    } finally {
      setLoading(false);
    }
  };

  const calculateSubtotal = () => {
    if (!cart) return 0;
    return cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const calculateTax = () => {
    return calculateSubtotal() * 0.08;
  };

  const calculateShipping = () => {
    return calculateSubtotal() > 100 ? 0 : 10;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax() + calculateShipping();
  };

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateShippingAddress()) {
      setStep(2);
    }
  };

  const validateShippingAddress = () => {
    const required = ['firstName', 'lastName', 'address', 'city', 'state', 'zipCode'];
    return required.every(field => shippingAddress[field as keyof ShippingAddress].trim() !== '');
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);
    setError(null);

    try {
      const stripe = await stripePromise;
      if (!stripe) throw new Error('Stripe failed to load');

      // Create payment method
      const { error: paymentError, paymentMethod: stripePaymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: {
          number: paymentMethod.cardNumber,
          exp_month: parseInt(paymentMethod.expiryDate.split('/')[0]),
          exp_year: parseInt(`20${paymentMethod.expiryDate.split('/')[1]}`),
          cvc: paymentMethod.cvv,
        },
        billing_details: {
          name: paymentMethod.nameOnCard,
          address: {
            line1: shippingAddress.address,
            city: shippingAddress.city,
            state: shippingAddress.state,
            postal_code: shippingAddress.zipCode,
            country: 'US',
          },
        },
      });

      if (paymentError) {
        throw new Error(paymentError.message);
      }

      // Process order
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          shippingAddress,
          paymentMethodId: stripePaymentMethod.id,
        }),
      });

      const data = await response.json();

      if (data.success) {
        router.push(`/order/confirmation?orderId=${data.data.id}`);
      } else {
        throw new Error(data.error);
      }
    } catch (err: any) {
      setError(err.message || 'Payment failed');
    } finally {
      setProcessing(false);
    }
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No items to checkout</h2>
          <p className="text-gray-600">Your cart is empty</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center">
            <div className={`flex items-center ${step >= 1 ? 'text-primary-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                step >= 1 ? 'border-primary-600 bg-primary-600 text-white' : 'border-gray-300'
              }`}>
                {step > 1 ? <CheckCircleIcon className="h-5 w-5" /> : '1'}
              </div>
              <span className="ml-2 font-medium">Shipping</span>
            </div>
            
            <div className={`flex-1 h-0.5 mx-4 ${step >= 2 ? 'bg-primary-600' : 'bg-gray-300'}`} />
            
            <div className={`flex items-center ${step >= 2 ? 'text-primary-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                step >= 2 ? 'border-primary-600 bg-primary-600 text-white' : 'border-gray-300'
              }`}>
                {step > 2 ? <CheckCircleIcon className="h-5 w-5" /> : '2'}
              </div>
              <span className="ml-2 font-medium">Payment</span>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex">
              <ExclamationTriangleIcon className="h-5 w-5 text-red-400 mt-0.5" />
              <div className="ml-3">
                <p className="text-red-800">{error}</p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-lg shadow-md p-6"
              >
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <MapPinIcon className="h-6 w-6 mr-2" />
                  Shipping Address
                </h2>
                
                <form onSubmit={handleShippingSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        First Name
                      </label>
                      <input
                        type="text"
                        required
                        value={shippingAddress.firstName}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, firstName: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name
                      </label>
                      <input
                        type="text"
                        required
                        value={shippingAddress.lastName}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, lastName: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address
                    </label>
                    <input
                      type="text"
                      required
                      value={shippingAddress.address}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, address: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        City
                      </label>
                      <input
                        type="text"
                        required
                        value={shippingAddress.city}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        State
                      </label>
                      <input
                        type="text"
                        required
                        value={shippingAddress.state}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        ZIP Code
                      </label>
                      <input
                        type="text"
                        required
                        value={shippingAddress.zipCode}
                        onChange={(e) => setShippingAddress({ ...shippingAddress, zipCode: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                  </div>
                  
                  <button
                    type="submit"
                    className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
                  >
                    Continue to Payment
                  </button>
                </form>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-lg shadow-md p-6"
              >
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <CreditCardIcon className="h-6 w-6 mr-2" />
                  Payment Information
                </h2>
                
                <form onSubmit={handlePaymentSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name on Card
                    </label>
                    <input
                      type="text"
                      required
                      value={paymentMethod.nameOnCard}
                      onChange={(e) => setPaymentMethod({ ...paymentMethod, nameOnCard: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Card Number
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="1234 5678 9012 3456"
                      value={paymentMethod.cardNumber}
                      onChange={(e) => setPaymentMethod({ ...paymentMethod, cardNumber: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="MM/YY"
                        value={paymentMethod.expiryDate}
                        onChange={(e) => setPaymentMethod({ ...paymentMethod, expiryDate: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        CVV
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="123"
                        value={paymentMethod.cvv}
                        onChange={(e) => setPaymentMethod({ ...paymentMethod, cvv: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                  </div>
                  
                  <div className="flex space-x-4">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="flex-1 border border-gray-300 text-gray-700 font-semibold py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Back
                    </button>
                    
                    <button
                      type="submit"
                      disabled={processing}
                      className="flex-1 bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {processing ? 'Processing...' : `Pay $${calculateTotal().toFixed(2)}`}
                    </button>
                  </div>
                </form>
              </motion.div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-6">
                {cart.items.map((item) => (
                  <div key={item.id} className="flex justify-between">
                    <span className="text-gray-600">
                      {item.product.name} × {item.quantity}
                    </span>
                    <span className="font-semibold">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
              
              <div className="space-y-3 mb-6 border-t pt-4">
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
                
                <div className="border-t pt-3">
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold">Total</span>
                    <span className="text-lg font-bold text-primary-600">
                      ${calculateTotal().toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
