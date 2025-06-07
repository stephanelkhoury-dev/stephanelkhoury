'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRightIcon } from '@heroicons/react/24/outline';

const Hero = () => {
  return (
    <section className="relative bg-gradient-to-r from-primary-600 to-primary-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Discover Amazing Products
            </h1>
            <p className="text-xl mb-8 text-primary-100">
              Shop from our curated collection of premium products with fast shipping and excellent customer service.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/products">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center"
                >
                  Shop Now
                  <ArrowRightIcon className="ml-2 h-5 w-5" />
                </motion.button>
              </Link>
              <Link href="/categories">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors"
                >
                  Browse Categories
                </motion.button>
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/20 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold">10K+</div>
                  <div className="text-sm">Products</div>
                </div>
                <div className="bg-white/20 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold">5K+</div>
                  <div className="text-sm">Happy Customers</div>
                </div>
                <div className="bg-white/20 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold">24/7</div>
                  <div className="text-sm">Support</div>
                </div>
                <div className="bg-white/20 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold">Fast</div>
                  <div className="text-sm">Shipping</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Background Pattern */}
      <div className="absolute inset-0 bg-black/20">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600/90 to-primary-800/90"></div>
      </div>
    </section>
  );
};

export default Hero;
