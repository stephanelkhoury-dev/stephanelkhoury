'use client';

import React from 'react';
import { motion } from 'framer-motion';
import GradientText from './animations/GradientText';
import { AnimatedSection } from './animations';

interface BlogPost {
  title: string;
  excerpt: string;
  date: string;
  category: string;
  image: string;
  link: string;
}

const blogPosts: BlogPost[] = [
  {
    title: 'The Future of AI in Music Production',
    excerpt: 'Exploring how artificial intelligence is revolutionizing the way we create and produce music, from automated composition to intelligent mixing.',
    date: 'May 28, 2025',
    category: 'AI & Music',
    image: '/blog/ai-music.jpg',
    link: '/blog/ai-music-production',
  },
  {
    title: 'Building Modern Web Applications with Next.js',
    excerpt: 'A comprehensive guide to creating fast, SEO-friendly web applications using Next.js 13+ with App Router and TypeScript.',
    date: 'May 15, 2025',
    category: 'Web Development',
    image: '/blog/nextjs.jpg',
    link: '/blog/nextjs-modern-apps',
  },
  {
    title: 'The Intersection of Music and Code',
    excerpt: 'How my background in music influences my approach to software development and creates unique problem-solving perspectives.',
    date: 'May 1, 2025',
    category: 'Personal',
    image: '/blog/music-code.jpg',
    link: '/blog/music-and-code',
  },
  {
    title: 'WordPress vs Custom Development: When to Choose What',
    excerpt: 'A detailed analysis of when to use WordPress and when to build custom solutions, based on real project experiences.',
    date: 'April 20, 2025',
    category: 'Web Development',
    image: '/blog/wordpress-vs-custom.jpg',
    link: '/blog/wordpress-vs-custom',
  },
  {
    title: 'Building Scalable E-Learning Platforms',
    excerpt: 'Lessons learned from developing cryptocurrency education platforms with thousands of users and complex course structures.',
    date: 'April 10, 2025',
    category: 'E-Learning',
    image: '/blog/elearning-platforms.jpg',
    link: '/blog/scalable-elearning',
  },
  {
    title: 'From University Project to Real-World Application',
    excerpt: 'The journey of transforming Harmonix from a final year project into a production-ready music analysis platform.',
    date: 'March 25, 2025',
    category: 'Startup',
    image: '/blog/university-to-production.jpg',
    link: '/blog/university-to-production',
  },
];

const Blog: React.FC = () => {
  const [showAllArticles, setShowAllArticles] = React.useState(false);
  
  const displayedPosts = showAllArticles ? blogPosts : blogPosts.slice(0, 3);

  return (
    <section id="blog" className="py-20 px-6 md:px-20 bg-[#0B001F]/30">
      <AnimatedSection>
        <div className="text-center mb-12">
          <GradientText
            text="Latest Articles"
            className="text-3xl font-semibold mb-4"
          />
          <p className="text-gray-300 max-w-2xl mx-auto">
            Thoughts, insights, and experiences from my journey in technology,
            music, and entrepreneurship.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {displayedPosts.map((post, index) => (
            <motion.article
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group cursor-pointer"
              whileHover={{ y: -5 }}
            >
              <div className="bg-gradient-to-br from-[#00E1FF05] to-[#FF8A0005] p-6 rounded-xl border border-white/10 h-full">
                <div className="relative aspect-w-16 aspect-h-9 mb-4 rounded-lg overflow-hidden">
                  <motion.div
                    className="absolute inset-0 bg-cover bg-center h-48"
                    style={{ backgroundImage: `url(${post.image})` }}
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                  />
                  <div className="absolute inset-0 bg-black/50 group-hover:bg-black/30 transition-colors duration-300" />
                  
                  {/* Category Badge */}
                  <div className="absolute top-3 left-3">
                    <span className="px-2 py-1 text-xs bg-gradient-to-r from-[#00E1FF] to-[#FF8A00] text-black rounded-full font-medium">
                      {post.category}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-gray-400">
                    <i className="far fa-calendar-alt mr-2"></i>
                    <span>{post.date}</span>
                  </div>
                  <h3 className="text-lg font-semibold group-hover:text-[#00E1FF] transition-colors duration-300 line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-gray-300 text-sm leading-relaxed line-clamp-3">
                    {post.excerpt}
                  </p>
                  <div className="pt-2">
                    <span className="text-[#00E1FF] text-sm font-medium group-hover:underline">
                      Read More →
                    </span>
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        <div className="text-center">
          <motion.button
            onClick={() => setShowAllArticles(!showAllArticles)}
            className="px-8 py-3 bg-gradient-to-r from-[#00E1FF] to-[#FF8A00] text-black font-semibold rounded-full hover:opacity-90 transition-opacity duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {showAllArticles ? 'Show Less Articles' : 'View All Articles'}
          </motion.button>
        </div>
      </AnimatedSection>
    </section>
  );
};

export default Blog;
