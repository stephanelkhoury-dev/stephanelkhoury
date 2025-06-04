'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';
import GradientText from './animations/GradientText';
import { AnimatedSection, ScrollReveal, TextReveal } from './animations';

interface Project {
  title: string;
  description: string;
  image: string;
  technologies: string[];
  github?: string;
  live?: string;
  category: string;
}

const projects: Project[] = [
  // Professional & Freelance Projects
  {
    title: 'Harmonix: AI-Powered Music Analysis Platform',
    description: 'Real-time chord detection from MP3 files, tempo detection, instrument tuner, and lyric extractor. Built as Final Year Project at Antonine University with full documentation and testing.',
    image: '/projects/harmonix.jpg',
    technologies: ['React', 'FastAPI', 'Python', 'Machine Learning', 'Audio Processing'],
    github: 'https://github.com/stephanelkhoury/harmonix',
    live: 'https://harmonix.ai',
    category: 'AI & Machine Learning',
  },
  {
    title: 'Sancta Maria Choir Website',
    description: 'Complete CMS with ACF Pro, events management, PDF resources, admin dashboard, and media gallery. Full-featured website for professional choir with advanced content management.',
    image: '/projects/sancta-maria.jpg',
    technologies: ['WordPress', 'ACF Pro', 'PHP', 'MySQL', 'CMS', 'Event Management'],
    live: 'https://sanctamariachoir.com',
    category: 'WordPress',
  },
  {
    title: 'Guitta Tabet Portfolio Website',
    description: 'Custom WordPress website with categorized product collections, responsive design, and modern UI. Built for creative professional with advanced filtering and showcase features.',
    image: '/projects/guitta-tabet.jpg',
    technologies: ['WordPress', 'Custom PHP', 'JavaScript', 'Responsive Design', 'Portfolio'],
    live: 'https://guittatabet.com',
    category: 'WordPress',
  },
  {
    title: 'Online POS + CRM Platform',
    description: 'Full-stack enterprise solution with custom CRM tools, inventory management, and sales analytics. Dockerized architecture for scalability and performance.',
    image: '/projects/pos-crm.jpg',
    technologies: ['React', 'Node.js', 'Docker', 'PostgreSQL', 'Redux', 'Enterprise'],
    github: 'https://github.com/stephanelkhoury/pos-crm',
    category: 'Enterprise',
  },
  {
    title: 'Cryptokers E-Learning Platform',
    description: 'Comprehensive platform for cryptocurrency and blockchain education with course streaming, Telegram subscription for signals, and integrated payment gateway.',
    image: '/projects/cryptokers.jpg',
    technologies: ['PHP', 'MySQL', 'Telegram API', 'Payment Gateway', 'LMS', 'Blockchain'],
    live: 'https://cryptokers.com',
    category: 'E-Learning',
  },
  {
    title: 'Angular E-Commerce Platform',
    description: 'Fully-featured shopping system with NgRx state management, Redux flow, and comprehensive product-cart relations with schema visuals.',
    image: '/projects/angular-ecommerce.jpg',
    technologies: ['Angular', 'NgRx', 'TypeScript', 'Redux', 'E-Commerce', 'State Management'],
    github: 'https://github.com/stephanelkhoury/angular-ecommerce',
    category: 'E-Commerce',
  },
  {
    title: 'Richy\'s Entertainment Website',
    description: 'Event company website with tagline integration and visual storytelling. Modern design with booking system and portfolio showcase.',
    image: '/projects/richys-entertainment.jpg',
    technologies: ['WordPress', 'Event Management', 'Visual Storytelling', 'Booking System'],
    live: 'https://richysentertainment.com',
    category: 'WordPress',
  },
  {
    title: 'Crypto Engineers LMS Platform',
    description: 'Learning Management System for cryptocurrency courses using Tutor LMS and BuddyBoss. Community-driven learning with course progression tracking.',
    image: '/projects/crypto-engineers.jpg',
    technologies: ['WordPress', 'Tutor LMS', 'BuddyBoss', 'Community Features', 'Course Management'],
    live: 'https://cryptoengineers.com',
    category: 'E-Learning',
  },
  {
    title: 'Hi-YU Lebanon Web Strategy',
    description: 'Complete website rebuild strategy and development proposal. Full-stack approach with modern design principles and performance optimization.',
    image: '/projects/hi-yu-lebanon.jpg',
    technologies: ['Strategy', 'Full-Stack Development', 'Performance Optimization', 'Modern Design'],
    category: 'Strategy',
  },
  {
    title: 'Chord Dictionary Visual Tool',
    description: 'Interactive chord dictionary with visual representations. Working on mobile app version using Flutter for chord extraction and music education.',
    image: '/projects/chord-dictionary.jpg',
    technologies: ['Flutter', 'Mobile Development', 'Music Education', 'Interactive Design'],
    github: 'https://github.com/stephanelkhoury/chord-dictionary',
    category: 'Music Tech',
  },
  {
    title: 'Saudi Dates Documentation',
    description: 'Comprehensive GitHub markdown wiki based on 9 functional pages. Includes use cases, user stories, and system diagrams for enterprise application.',
    image: '/projects/saudi-dates.jpg',
    technologies: ['Documentation', 'GitHub Wiki', 'System Design', 'Use Cases', 'Markdown'],
    github: 'https://github.com/stephanelkhoury/saudi-dates-docs',
    category: 'Documentation',
  },
  {
    title: 'ERP System Project',
    description: 'Enterprise Resource Planning system developed during Software Engineering studies. Includes modules for report generation, user access control, and data flow management.',
    image: '/projects/erp-system.jpg',
    technologies: ['Java', 'Database Design', 'Report Generation', 'User Management', 'Enterprise'],
    github: 'https://github.com/stephanelkhoury/erp-system',
    category: 'Enterprise',
  }
];

const Projects: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = React.useState('All');
  
  const categories = ['All', ...Array.from(new Set(projects.map(p => p.category)))];
  
  const filteredProjects = selectedCategory === 'All' 
    ? projects 
    : projects.filter(p => p.category === selectedCategory);

  return (
    <section id="projects" className="py-20 px-6 md:px-20">
      <AnimatedSection>
        <GradientText
          text="Featured Projects"
          className="text-3xl font-semibold mb-8"
        />
        
        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-12 justify-center">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm transition-all duration-300 ${
                selectedCategory === category
                  ? 'bg-gradient-to-r from-[#00E1FF] to-[#FF8A00] text-black'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project, index) => (
            <ScrollReveal key={index} delay={index * 0.1} direction="up">
              <motion.div
                className="group relative bg-gradient-to-br from-[#00E1FF10] to-[#FF8A0010] rounded-xl overflow-hidden border border-white/10 hover-glow glass shimmer"
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <div className="aspect-w-16 aspect-h-9 h-48 relative overflow-hidden">
                  <motion.div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${project.image})` }}
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.5 }}
                  />
                  <div className="absolute inset-0 bg-black/60 group-hover:bg-black/40 transition-colors duration-300" />
                  
                  {/* Category Badge */}
                  <motion.div 
                    className="absolute top-4 left-4"
                    whileHover={{ scale: 1.1 }}
                  >
                    <span className="px-3 py-1 text-xs bg-gradient-to-r from-[#00E1FF] to-[#FF8A00] text-black rounded-full font-medium liquid-bg">
                      {project.category}
                    </span>
                  </motion.div>
                </div>
                
                <div className="relative p-6">
                  <motion.h3 
                    className="text-xl font-semibold mb-2 group-hover:text-[#00E1FF] transition-colors duration-300 "
                    whileHover={{ scale: 1.05 }}
                  >
                    {project.title}
                  </motion.h3>
                  <p className="text-gray-300 mb-4 text-sm leading-relaxed">
                    {project.description}
                  </p>
                  
                  {/* Technologies */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.slice(0, 4).map((tech, techIndex) => (
                      <motion.span
                        key={techIndex}
                        className="px-2 py-1 text-xs bg-white/10 rounded-full text-gray-300 hover-lift magnetic"
                        whileHover={{ scale: 1.1, backgroundColor: 'rgba(0, 225, 255, 0.2)' }}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: techIndex * 0.1, duration: 0.3 }}
                      >
                        {tech}
                      </motion.span>
                    ))}
                    {project.technologies.length > 4 && (
                      <span className="px-2 py-1 text-xs bg-white/10 rounded-full text-gray-400">
                        +{project.technologies.length - 4} more
                      </span>
                    )}
                </div>
                
                {/* Links */}
                <div className="flex gap-3">
                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm transition-colors duration-300"
                    >
                      <FontAwesomeIcon icon={faGithub} />
                      Code
                    </a>
                  )}
                  {project.live && (
                    <a
                      href={project.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-[#00E1FF] to-[#FF8A00] text-black rounded-lg text-sm font-medium hover:opacity-90 transition-opacity duration-300"
                    >
                      <FontAwesomeIcon icon={faExternalLinkAlt} />
                      Live Demo
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
            </ScrollReveal>
          ))}
        </div>
        
        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400">No projects found in this category.</p>
          </div>
        )}
      </AnimatedSection>
    </section>
  );
};

export default Projects;
