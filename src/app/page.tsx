'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { AnimatedSection, AnimatedButton } from '@/components/animations';
import GradientText from '@/components/animations/GradientText';
import Navbar from '@/components/Navbar';
import About from '@/components/About';
import Projects from '@/components/Projects';
import Experience from '@/components/Experience';
import Blog from '@/components/Blog';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="relative flex flex-col items-center justify-center min-h-screen px-6 overflow-hidden">
          {/* Logo Animation */}
            <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 1,
              ease: [0.6, -0.05, 0.01, 0.99],
            }}
            className="relative mb-8"
            >
            <motion.img
              src="/logo-multigraphic.lb.png"
              alt="Multigraphic.lb Logo"
              className="w-40 h-40"
              whileHover={{ scale: 1.05 }}
              animate={{
              filter: [
                'brightness(1) blur(0px)',
                'brightness(1.2) blur(4px)',
                'brightness(1) blur(0px)',
              ],
              }}
              transition={{
              duration: 3,
              repeat: Infinity,
              repeatType: 'reverse',
              }}
            />
            </motion.div>

          {/* Name and Title */}
          <GradientText
            text="Stephan El Khoury"
            className="text-4xl md:text-6xl font-bold mb-4"
            delay={0.3}
          />
          
          <AnimatedSection delay={0.5}>
            <h2 className="text-xl md:text-2xl text-gray-300 mb-2">
              Computer Engineer | Full Stack Developer | Musician
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl text-center mb-8">
              Innovating at the intersection of code, creativity, and sound
            </p>
            
            <AnimatedButton>
              Explore My Work
            </AnimatedButton>
          </AnimatedSection>

          {/* Background Gradient */}
          <div className="absolute inset-0 bg-gradient-radial from-[#0B001F] via-[#0B001F] to-black opacity-50 -z-10" />
        </section>

        <About />

        {/* Projects Section */}
        <Projects />

        {/* Experience Section */}
        <Experience />

        {/* Blog Section */}
        <Blog />

        {/* Contact Section */}
        <Contact />
      </main>
      <Footer />
    </>
  );
}
