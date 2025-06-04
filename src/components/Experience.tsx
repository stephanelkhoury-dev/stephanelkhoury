'use client';

import React from 'react';
import { motion } from 'framer-motion';
import GradientText from './animations/GradientText';
import { AnimatedSection } from './animations';

interface Experience {
  title: string;
  company: string;
  period: string;
  description: string[];
  technologies: string[];
}

const experiences: Experience[] = [
  {
    title: 'Founder & Lead Developer',
    company: 'Multigraphic.lb',
    period: '2020 - Present',
    description: [
      'Founded and scaled a creative studio delivering full-stack web development and branding solutions',
      'Led 20+ client projects including WordPress, Shopify, and React-based applications',
      'Developed comprehensive digital strategies for startups and established businesses',
      'Built custom CMS solutions with ACF Pro, event management systems, and e-commerce platforms',
      'Created complete branding packages including business identity and UX/UI design systems',
    ],
    technologies: ['React', 'WordPress', 'Shopify', 'Next.js', 'TailwindCSS', 'ACF Pro', 'WooCommerce'],
  },
  {
    title: 'Front-End Developer & QA Engineer',
    company: 'WPP - Ogilvy',
    period: 'Sep 2023 - Present',
    description: [
      'Develop and maintain large-scale CMS platforms (Sitecore, Sitefinity) for major clients',
      'Conduct comprehensive QA testing, performance analysis, and Lighthouse audits',
      'Implement SEO optimizations and accessibility fixes across enterprise applications',
      'Manage GitHub projects with detailed markdown documentation and issue tracking',
      'Create advertising campaigns using Google Web Designer and full-stack web applications',
    ],
    technologies: ['Sitecore', 'Sitefinity', 'Google Web Designer', 'QA Testing', 'SEO', 'GitHub'],
  },
  {
    title: 'Multimedia Developer - Full Stack Developer',
    company: 'Firma Events, Qatar',
    period: 'Nov 2023 - Apr 2024',
    description: [
      'Developed and launched a modern event management website for Qatar market',
      'Implemented SEO strategies resulting in first-page rankings for key event industry terms',
      'Built responsive UI with modern animations and cross-browser compatibility',
      'Completed 6-month contract delivering all project objectives on schedule',
    ],
    technologies: ['Next.js', 'TypeScript', 'TailwindCSS', 'SEO', 'Responsive Design', 'UI/UX'],
  },
  {
    title: 'Oriental Keyboard Instructor',
    company: 'Music School & Private Lessons',
    period: 'Jan 2018 - Present',
    description: [
      'Teach oriental keyboard techniques including maqamat and occidental/oriental styles',
      'Conduct 30-45 minute sessions covering arpeggios and ear-training for chord recognition',
      'Perform regularly at high-end venues including Kempinski Hotel Qatar',
      'Accompany professional singers with extensive Arabic and Western repertoire',
    ],
    technologies: ['Music Theory', 'Performance', 'Teaching', 'Audio Production'],
  },
  {
    title: 'Multimedia Developer - UX/UI and Web Developer',
    company: 'InnovatorsGate',
    period: 'Oct 2021 - Nov 2023',
    description: [
      'Designed the platform UX/UI using Figma for the TechStans project',
      'Developed on WordPress with a focus on functionality & design',
      'Led a team of two developers to ensure project success',
    ],
    technologies: ['Figma', 'WordPress', 'UX/UI Design', 'Team Leadership'],
  },
  {
    title: 'Multimedia Developer - Web Developer - Ebook Creator',
    company: 'Sayegh 1944',
    period: 'Mar 2020 - Oct 2021',
    description: [
      'Developed eBooks and interactive content using HTML, CSS, JavaScript',
      'Utilized internal tools to digitize soft copy books efficiently',
      'Created automated solutions to streamline repetitive tasks for the team',
    ],
    technologies: ['HTML', 'CSS', 'JavaScript', 'eBooks', 'Automation'],
  },
  {
    title: 'Manager - Graphic Design',
    company: 'Aplus - ARCH Blat - GA Print Solutions',
    period: 'Jan 2018 - Dec 2021',
    description: [
      'Managed printing solutions across plotters, printers, and laser machines',
      'Handled server maintenance for three copy centers',
      'Mastered Adobe Suite: Photoshop, Illustrator, InDesign, and Dimensions',
    ],
    technologies: ['Adobe Suite', 'Print Design', 'Server Management', 'Team Leadership'],
  }
];

const Experience: React.FC = () => {
  return (
    <section id="experience" className="py-20 px-6 md:px-20 bg-[#0B001F]/30">
      <AnimatedSection>
        <GradientText
          text="Experience"
          className="text-3xl font-semibold mb-12"
        />
        <div className="space-y-12">
          {experiences.map((exp, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="relative"
            >
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <div className="md:w-1/3">
                  <h3 className="text-xl font-semibold text-white">{exp.title}</h3>
                  <p className="text-[#00E1FF]">{exp.company}</p>
                  <p className="text-gray-400">{exp.period}</p>
                </div>
                <div className="md:w-2/3">
                  <ul className="list-disc list-inside space-y-2 text-gray-300 mb-4">
                    {exp.description.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                  <div className="flex flex-wrap gap-2">
                    {exp.technologies.map((tech, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 text-sm bg-white/10 rounded-full"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              {index !== experiences.length - 1 && (
                <div className="absolute left-0 bottom-0 w-full h-px bg-gradient-to-r from-transparent via-[#C13CFF40] to-transparent" />
              )}
            </motion.div>
          ))}
        </div>
      </AnimatedSection>
    </section>
  );
};

export default Experience;
