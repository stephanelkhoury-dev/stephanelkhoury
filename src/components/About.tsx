'use client';

import React from 'react';
import { motion } from 'framer-motion';
import GradientText from './animations/GradientText';
import { AnimatedSection, ScrollReveal, TextReveal } from './animations';

const About: React.FC = () => {
  const education = [
    {
      school: 'Antonine University Baabda',
      degree: 'Computer and Telecommunications Faculty of Engineering - Multimedia',
      period: '2017 - 2022',
    },
    {
      school: 'Notre Dames des Appotres',
      degree: 'Lebanese Baccalaureate II - Life Science',
      period: '2002 - 2017',
    },
  ];

  const languages = [
    { name: 'ENGLISH', level: 'B.2.2' },
    { name: 'FRENCH', level: 'DELF B.2.1' },
    { name: 'ARABIC', level: 'NATIVE' },
  ];

  const skills = [
    'HTML', 'CSS', 'JavaScript', 'React', 'PHP', 'Bootstrap',
    'Google Workspace (Docs, Sheets, Drive, Slides)',
    'Microsoft Office Suite',
    'Miro', 'Figma', 'AutoCAD',
    'Adobe (Photoshop, Illustrator, XD, Dimensions)'
  ];

  const certifications = [
    {
      type: 'Cisco Certificates',
      items: [
        'Cisco 1: Introduction to networks',
        'Cisco 2: Routing and Switching Essentials',
        'Cisco 3: Scaling Networks',
        'Cisco 4: Connecting Networks',
      ]
    },
    {
      type: 'Google Certificates',
      items: [
        'The Fundamentals of Digital Marketing',
        'Introduction to Generative AI'
      ]
    }
  ];

  return (
    <section id="about" className="py-20 px-6 md:px-20 bg-[#0B001F]/30 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-r from-[#00E1FF] to-[#C13CFF] rounded-full blur-3xl floating-animation" />
        <div className="absolute bottom-1/3 right-1/4 w-24 h-24 bg-gradient-to-r from-[#C13CFF] to-[#FF8A00] rounded-full blur-2xl floating-animation" style={{ animationDelay: '2s' }} />
      </div>

      <AnimatedSection>
        <TextReveal
          text="About Me"
          className="text-3xl font-semibold mb-8 text-center"
        />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <ScrollReveal direction="left" delay={0.2}>
            <div className="glass rounded-2xl p-8 hover-glow">
              <TextReveal
                text="I'm a multimedia engineer skilled in designing and implementing innovative solutions across platforms. With expertise in multimedia technologies, I excel in fast-paced environments, delivering high-quality user experiences. Based in Lebanon, I thrive on solving complex problems and contributing to project success."
                className="text-gray-300 mb-6"
                delay={0.5}
                staggerDelay={0.02}
              />

              <h3 className="text-xl font-semibold mb-4 text-white ">Education</h3>
              <div className="space-y-4 mb-8">
                {education.map((edu, index) => (
                  <motion.div 
                    key={index} 
                    className="bg-white/5 p-4 rounded-lg hover-lift shimmer magnetic"
                    whileHover={{ scale: 1.02 }}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.6 }}
                  >
                    <h4 className="font-semibold text-[#00E1FF]">{edu.school}</h4>
                    <p className="text-gray-300">{edu.degree}</p>
                    <p className="text-gray-400 text-sm">{edu.period}</p>
                  </motion.div>
                ))}
              </div>

              <h3 className="text-xl font-semibold mb-4 text-white">Languages</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              {languages.map((lang, index) => (
                <motion.div 
                  key={index} 
                  className="bg-white/5 p-4 rounded-lg text-center hover-glow pulse-glow"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  whileHover={{ y: -5 }}
                >
                  <h4 className="font-semibold text-[#00E1FF]">{lang.name}</h4>
                  <p className="text-gray-300">{lang.level}</p>
                </motion.div>
              ))}
            </div>
          </div>
          </ScrollReveal>

          <ScrollReveal direction="right" delay={0.4}>
            <div className="glass rounded-2xl p-8 hover-glow">
              <h3 className="text-xl font-semibold mb-4 text-white ">Skills</h3>
              <div className="flex flex-wrap gap-2 mb-8">
                {skills.map((skill, index) => (
                  <motion.span
                    key={index}
                    className="px-3 py-1 text-sm bg-white/10 rounded-full text-gray-300 hover-lift magnetic"
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05, duration: 0.4 }}
                    whileHover={{ scale: 1.1, backgroundColor: 'rgba(0, 225, 255, 0.2)' }}
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>

              <h3 className="text-xl font-semibold mb-4 text-white ">Certifications</h3>
              <div className="space-y-6">
                {certifications.map((cert, index) => (
                  <motion.div 
                    key={index} 
                    className="bg-white/5 p-4 rounded-lg shimmer hover-lift"
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.2, duration: 0.6 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <h4 className="font-semibold text-[#00E1FF] mb-2">{cert.type}</h4>
                    <ul className="list-disc list-inside text-gray-300 space-y-1">
                      {cert.items.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </motion.div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </AnimatedSection>
    </section>
  );
};

export default About;
