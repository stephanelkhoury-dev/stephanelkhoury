'use client';

import React, { useEffect, useRef } from 'react';
import { motion, useInView, useAnimation } from 'framer-motion';

interface TextRevealProps {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
  staggerDelay?: number;
}

const TextReveal: React.FC<TextRevealProps> = ({
  text,
  className = '',
  delay = 0,
  duration = 0.8,
  staggerDelay = 0.05,
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    }
  }, [isInView, controls]);

  // Split text into words and characters
  const words = text.split(' ');

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: delay,
      },
    },
  };

  const wordVariants = {
    hidden: {
      opacity: 0,
      y: 50,
      rotateX: -90,
    },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: {
        duration: duration,
        ease: [0.25, 0.4, 0.25, 1],
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      className={`overflow-hidden ${className}`}
      variants={containerVariants}
      initial="hidden"
      animate={controls}
    >
      {words.map((word, wordIndex) => (
        <span key={wordIndex} className="inline-block">
          <motion.span
            className="inline-block"
            variants={wordVariants}
            style={{ transformOrigin: 'bottom' }}
          >
            {word}
          </motion.span>
          {wordIndex < words.length - 1 && (
            <span className="inline-block">&nbsp;</span>
          )}
        </span>
      ))}
    </motion.div>
  );
};

export default TextReveal;
