'use client';

import React from 'react';
import { motion } from 'framer-motion';
import GradientText from './animations/GradientText';
import { AnimatedSection, AnimatedButton } from './animations';

const Contact: React.FC = () => {
  return (
    <section id="contact" className="py-20 px-6 md:px-20">
      <AnimatedSection>
        <div className="max-w-4xl mx-auto text-center">
          <GradientText
            text="Let's Connect"
            className="text-3xl font-semibold mb-6"
          />
          <p className="text-gray-300 mb-12 text-lg">
            Whether you&apos;re interested in collaboration, have a project in mind,
            or just want to say hello, I&apos;d love to hear from you.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <motion.div
              whileHover={{ y: -5 }}
              className="p-6 bg-gradient-to-br from-[#00E1FF10] to-[#FF8A0010] rounded-xl"
            >
              <h3 className="text-xl font-semibold mb-4">Work Inquiries</h3>
              <p className="text-gray-300 mb-4">
                Looking for a developer for your next project?
              </p>
              <AnimatedButton>
                <a href="mailto:stephanelkhoury2000@gmail.com">Get in Touch</a>
              </AnimatedButton>
            </motion.div>

            <motion.div
              whileHover={{ y: -5 }}
              className="p-6 bg-gradient-to-br from-[#00E1FF10] to-[#FF8A0010] rounded-xl"
            >
              <h3 className="text-xl font-semibold mb-4">Contact Information</h3>
              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-center gap-3 text-gray-300">
                  <i className="fas fa-envelope text-[#00E1FF]"></i>
                  <span>stephanelkhoury2000@gmail.com</span>
                </div>
                <div className="flex items-center justify-center gap-3 text-gray-300">
                  <i className="fas fa-phone text-[#00E1FF]"></i>
                  <span>+961 78 965 292</span>
                </div>
              </div>
              
              {/* Social Media Icons */}
              <div className="flex flex-wrap justify-center gap-3">
                <SocialLink href="https://www.linkedin.com/in/stephanelkhoury/" icon="linkedin" color="#0077B5" />
                <SocialLink href="https://github.com/stephanelkhoury" icon="github" color="#333" />
                <SocialLink href="mailto:stephanelkhoury2000@gmail.com" icon="envelope" color="#EA4335" isEmail />
                <SocialLink href="tel:+96178965292" icon="phone" color="#25D366" isPhone />
                <SocialLink href="https://wa.me/96178965292" icon="whatsapp" color="#25D366" />
                <SocialLink href="https://t.me/stephanelkhoury" icon="telegram" color="#0088cc" />
                <SocialLink href="https://instagram.com/stephanelkhoury" icon="instagram" color="#E4405F" />
                <SocialLink href="https://facebook.com/stephanelkhoury" icon="facebook" color="#1877F2" />
                <SocialLink href="https://x.com/stephanelkhoury" icon="x-twitter" color="#000000" />
              </div>
            </motion.div>
          </div>

          <div className="max-w-2xl mx-auto">
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input
                  type="text"
                  placeholder="Name"
                  className="w-full px-4 py-3 bg-white/5 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C13CFF] transition-colors"
                />
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full px-4 py-3 bg-white/5 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C13CFF] transition-colors"
                />
              </div>
              <textarea
                placeholder="Message"
                rows={6}
                className="w-full px-4 py-3 bg-white/5 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C13CFF] transition-colors"
              />
              <AnimatedButton>
                Send Message
              </AnimatedButton>
            </form>
          </div>
        </div>
      </AnimatedSection>
    </section>
  );
};

const SocialLink: React.FC<{ 
  href: string; 
  icon: string; 
  color?: string;
  isEmail?: boolean;
  isPhone?: boolean;
}> = ({ href, icon, color = '#ffffff', isEmail = false, isPhone = false }) => (
  <motion.a
    href={href}
    target={isEmail || isPhone ? '_self' : '_blank'}
    rel={isEmail || isPhone ? undefined : 'noopener noreferrer'}
    whileHover={{ y: -3, scale: 1.1 }}
    className="w-12 h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300 group"
    style={{ '--hover-color': color } as React.CSSProperties}
  >
    <i className={`${isEmail || isPhone ? 'fas' : 'fab'} fa-${icon} text-xl group-hover:text-[var(--hover-color)] transition-colors duration-300`} />
  </motion.a>
);

export default Contact;
