'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { AnimatedSection, ScrollReveal, TextReveal } from './animations';
import CertificateCarousel from './CertificateCarousel';

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
    'HTML', 'CSS', 'JavaScript', 'React', 'Next.js', 'Node.js', 'TypeScript', 'PHP', 'Python', 'Bootstrap', 'Tailwind CSS',
    'MongoDB', 'MySQL', 'PostgreSQL', 'Firebase', 'AWS', 'Docker', 'Git', 'Figma', 'Adobe Creative Suite',
    'Three.js', 'GSAP', 'Framer Motion', 'REST APIs', 'GraphQL', 'Webpack', 'Vite'
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
        'Introduction to Generative AI',
        'Google Workspace Suite',
        'Google Cloud Platform'
      ]
    },
    {
      type: 'AI & Data Science',
      items: [
        'AI, Business & the Future of Work',
        'AI, Empathy & Ethics',
        'Data Literacy',
        'Data Science Ethics'
      ]
    }
  ];

  // Certificate data for the carousel
  const certificates = [
    {
      id: '1',
      title: 'AI, Business & the Future of Work',
      organization: 'Lund University - Coursera',
      type: 'AI & Business',
      filename: 'AI, Business & the Future of Work - Lund University - Coursera NGNAGY4E0BWW.pdf',
      path: '/Stephan-Certificates/AI, Business & the Future of Work - Lund University - Coursera NGNAGY4E0BWW.pdf',
      preview: '/certificate-previews/ai-business-lund.svg'
    },
    {
      id: '2',
      title: 'AI, Empathy & Ethics',
      organization: 'UC Santa Cruz - Coursera',
      type: 'AI Ethics',
      filename: 'AI, Empathy & Ethics - US SANTA CRUZ- Coursera 5FUDOMOKQJA2.pdf',
      path: '/Stephan-Certificates/AI, Empathy & Ethics - US SANTA CRUZ- Coursera 5FUDOMOKQJA2.pdf',
      preview: '/certificate-previews/ai-empathy-ethics.svg'
    },
    {
      id: '3',
      title: 'Data Literacy',
      organization: 'University of Copenhagen - Coursera',
      type: 'Data Science',
      filename: 'Data Literacy - University of Copenhagen - Coursera 3QMWORSEKX28.pdf',
      path: '/Stephan-Certificates/Data Literacy - University of Copenhagen - Coursera 3QMWORSEKX28.pdf',
      preview: '/certificate-previews/data-literacy.svg'
    }
  ];

  return (
    <>
      <section id="about" className="py-20 px-6 md:px-20 bg-[#0B001F]/30 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-r from-[#00E1FF] to-[#C13CFF] rounded-full blur-3xl floating-animation" />
          <div className="absolute bottom-1/3 right-1/4 w-24 h-24 bg-gradient-to-r from-[#C13CFF] to-[#FF8A00] rounded-full blur-2xl floating-animation" style={{ animationDelay: '2s' }} />
        </div>

        <AnimatedSection>
          <TextReveal
            text="About Me"
            className="text-4xl font-bold mb-16 text-center"
          />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 max-w-7xl mx-auto">
            {/* Profile Image Column */}
            <ScrollReveal direction="up" delay={0.2}>
              <div className="lg:col-span-1 text-center">
                <div className="relative w-80 h-80 mx-auto mb-8">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#C13CFF] to-[#00E1FF] rounded-full blur-xl opacity-30"></div>
                  <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-white/20 shadow-2xl">
                    <img
                      src="/images/profile/stephan-profile.jpg"
                      alt="Stephan El Khoury - Full Stack Developer"
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  {/* Floating Elements around Profile */}
                  <div className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-r from-[#FF8A00] to-[#C13CFF] rounded-full flex items-center justify-center shadow-lg floating-animation">
                    <span className="text-white font-bold">💻</span>
                  </div>
                  <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-gradient-to-r from-[#00E1FF] to-[#C13CFF] rounded-full flex items-center justify-center shadow-lg floating-animation" style={{ animationDelay: '1s' }}>
                    <span className="text-white font-bold">🎵</span>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 gap-4">
                  <motion.div 
                    className="bg-white/10 backdrop-blur-sm p-4 rounded-lg hover-glow"
                    whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
                  >
                    <div className="text-2xl font-bold text-[#00E1FF]">5+</div>
                    <div className="text-sm text-gray-300">Years Experience</div>
                  </motion.div>
                  <motion.div 
                    className="bg-white/10 backdrop-blur-sm p-4 rounded-lg hover-glow"
                    whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
                  >
                    <div className="text-2xl font-bold text-[#C13CFF]">50+</div>
                    <div className="text-sm text-gray-300">Projects Completed</div>
                  </motion.div>
                  <motion.div 
                    className="bg-white/10 backdrop-blur-sm p-4 rounded-lg hover-glow"
                    whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
                  >
                    <div className="text-2xl font-bold text-[#FF8A00]">15+</div>
                    <div className="text-sm text-gray-300">Certifications</div>
                  </motion.div>
                </div>
              </div>
            </ScrollReveal>

            {/* Content Columns */}
            <div className="lg:col-span-2 grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - About & Education */}
              <ScrollReveal direction="left" delay={0.3}>
                <div className="glass rounded-2xl p-8 hover-glow h-full">
                  <motion.p 
                    className="text-lg text-gray-300 leading-relaxed mb-6"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                  >
                    I'm a passionate <span className="text-[#00E1FF] font-semibold">Computer Engineer</span> and 
                    <span className="text-[#C13CFF] font-semibold"> Full Stack Developer</span> with expertise in 
                    modern web technologies and a unique background in music production.
                  </motion.p>

                  <h3 className="text-xl font-semibold mb-4 text-white">Education</h3>
                  <div className="space-y-4 mb-8">
                    {education.map((edu, index) => (
                      <motion.div 
                        key={index} 
                        className="bg-white/5 p-4 rounded-lg hover-lift shimmer"
                        whileHover={{ scale: 1.02 }}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.6 }}
                      >
                        <h4 className="font-semibold text-[#00E1FF]">{edu.school}</h4>
                        <p className="text-gray-300 text-sm">{edu.degree}</p>
                        <p className="text-gray-400 text-xs">{edu.period}</p>
                      </motion.div>
                    ))}
                  </div>

                  <h3 className="text-xl font-semibold mb-4 text-white">Languages</h3>
                  <div className="grid grid-cols-1 gap-3">
                    {languages.map((lang, index) => (
                      <motion.div 
                        key={index} 
                        className="bg-white/5 p-3 rounded-lg text-center hover-glow"
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1, duration: 0.5 }}
                      >
                        <div className="font-semibold text-[#C13CFF]">{lang.name}</div>
                        <div className="text-gray-400 text-sm">{lang.level}</div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </ScrollReveal>

              {/* Right Column - Skills & Certifications */}
              <ScrollReveal direction="right" delay={0.4}>
                <div className="glass rounded-2xl p-8 hover-glow h-full">
                  <h3 className="text-xl font-semibold mb-4 text-white">Skills & Technologies</h3>
                  <div className="flex flex-wrap gap-2 mb-8">
                    {skills.map((skill, index) => (
                      <motion.span
                        key={index}
                        className="bg-gradient-to-r from-[#00E1FF]/20 to-[#C13CFF]/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm text-gray-300 border border-white/10"
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05, duration: 0.4 }}
                        whileHover={{ scale: 1.1, backgroundColor: 'rgba(0, 225, 255, 0.2)' }}
                      >
                        {skill}
                      </motion.span>
                    ))}
                  </div>

                  <h3 className="text-xl font-semibold mb-4 text-white">Certifications</h3>
                  <div className="space-y-4">
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
                        <ul className="list-disc list-inside text-gray-300 space-y-1 text-sm">
                          {cert.items.slice(0, 3).map((item, i) => (
                            <li key={i}>{item}</li>
                          ))}
                          {cert.items.length > 3 && (
                            <li className="text-[#C13CFF]">+{cert.items.length - 3} more</li>
                          )}
                        </ul>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* Certificate Carousel Section */}
      <section className="py-16 px-6 md:px-20 bg-[#0B001F]/20 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/3 right-1/4 w-40 h-40 bg-gradient-to-r from-[#C13CFF] to-[#00E1FF] rounded-full blur-3xl floating-animation" />
          <div className="absolute bottom-1/4 left-1/3 w-28 h-28 bg-gradient-to-r from-[#FF8A00] to-[#C13CFF] rounded-full blur-2xl floating-animation" style={{ animationDelay: '3s' }} />
        </div>

        <AnimatedSection>
          <div className="max-w-7xl mx-auto">
            <TextReveal
              text="Professional Certifications"
              className="text-3xl font-bold mb-12 text-center"
            />
            <CertificateCarousel certificates={certificates} />
          </div>
        </AnimatedSection>
      </section>
    </>
  );
};

export default About;
