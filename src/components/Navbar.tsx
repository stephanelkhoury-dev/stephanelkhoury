'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AnimatedLink } from './animations';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'backdrop-blur-md bg-[#0B001F]/80' : ''
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.a
            href="#"
            className="text-2xl font-bold"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="bg-gradient-to-r from-[#3b82f6] via-[#06b6d4] to-[#10b981] text-transparent bg-clip-text">
              Stephan El Khoury
            </span>
          </motion.a>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8">
            <AnimatedLink href="#about">About</AnimatedLink>
            <AnimatedLink href="#projects">Projects</AnimatedLink>
            <AnimatedLink href="#experience">Experience</AnimatedLink>
            <AnimatedLink href="#blog">Blog</AnimatedLink>
            <AnimatedLink href="#contact">Contact</AnimatedLink>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            whileTap={{ scale: 0.95 }}
          >
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMobileMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </motion.button>

          {/* Mobile Menu */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="absolute top-full left-0 w-full bg-[#0B001F]/95 backdrop-blur-md md:hidden"
              >
                <div className="flex flex-col items-center space-y-4 py-6">
                  <AnimatedLink href="#about">About</AnimatedLink>
                  <AnimatedLink href="#projects">Projects</AnimatedLink>
                  <AnimatedLink href="#experience">Experience</AnimatedLink>
                  <AnimatedLink href="#blog">Blog</AnimatedLink>
                  <AnimatedLink href="#contact">Contact</AnimatedLink>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
