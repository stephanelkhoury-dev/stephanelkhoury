'use client';

import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, title }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  // Handle escape key press and prevent background scroll
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      // Store the currently focused element
      previousActiveElement.current = document.activeElement as HTMLElement;
      
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
      // Improve touch scrolling on iOS
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      
      // Focus the modal for better accessibility
      setTimeout(() => {
        modalRef.current?.focus();
      }, 100);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
      document.body.style.position = 'unset';
      document.body.style.width = 'unset';
      
      // Restore focus to the previously focused element
      if (previousActiveElement.current) {
        previousActiveElement.current.focus();
      }
    };
  }, [isOpen, onClose]);

  // Handle backdrop click with proper event handling
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleBackdropClick}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 cursor-pointer"
          />
          
          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ 
              type: "spring", 
              duration: 0.4,
              bounce: 0.1,
              stiffness: 200,
              damping: 20
            }}
            className="fixed inset-2 sm:inset-4 md:inset-6 lg:inset-8 xl:inset-12 z-50 flex items-start sm:items-center justify-center p-2 sm:p-4 pointer-events-none"
          >
            <div 
              ref={modalRef}
              tabIndex={-1}
              className="bg-[#0B001F]/95 backdrop-blur-xl border border-white/20 rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-7xl max-h-full overflow-hidden flex flex-col pointer-events-auto focus:outline-none"
            >
              {/* Header - Fixed */}
              <div className="flex-shrink-0 flex items-center justify-between p-4 sm:p-6 border-b border-white/10 bg-[#0B001F]/80 backdrop-blur-sm sticky top-0 z-10">
                {title && (
                  <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-[#3b82f6] via-[#06b6d4] to-[#10b981] text-transparent bg-clip-text pr-4 truncate">
                    {title}
                  </h2>
                )}
                <motion.button
                  onClick={onClose}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-white/20"
                  aria-label="Close modal"
                >
                  <FontAwesomeIcon icon={faTimes} className="text-gray-400 hover:text-white text-sm sm:text-base" />
                </motion.button>
              </div>
              
              {/* Content - Scrollable */}
              <div className="flex-1 overflow-y-auto modal-scrollbar overscroll-contain scroll-smooth">
                <div className="p-3 sm:p-4 md:p-6 lg:p-8">
                  {children}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Modal;
