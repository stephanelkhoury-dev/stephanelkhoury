import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Linkedin, Github, Send, MapPin, Twitter } from 'lucide-react';

export function Contact() {
  return (
    <section id="contact" className="py-24 bg-zinc-950 relative border-t border-zinc-900/50">
      {/* Decorative background element */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -right-1/4 w-[1000px] h-[1000px] bg-blue-600/5 rounded-full blur-[120px]" />
      </div>

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16">
          
          {/* Left Column - Info */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-12"
          >
            <div>
              <h2 className="text-sm font-semibold text-blue-500 uppercase tracking-widest mb-2">Get in Touch</h2>
              <h3 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-6">
                Let's build something <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-amber-200">exceptional.</span>
              </h3>
              <p className="text-zinc-400 text-lg max-w-md">
                Whether you have a specific project in mind, need technical consulting, or just want to connect, I'm always open to discussing new opportunities.
              </p>
            </div>

            <div className="space-y-6">
              <a href="mailto:contact@stephanelkhoury.com" className="flex items-center gap-4 text-zinc-300 hover:text-blue-400 transition-colors group">
                <div className="w-12 h-12 rounded-full bg-zinc-900 border border-zinc-800 group-hover:border-blue-500/50 flex items-center justify-center text-zinc-400 group-hover:text-blue-400 transition-all">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-zinc-500">Email Me</h4>
                  <p className="font-medium text-lg">contact@stephanelkhoury.com</p>
                </div>
              </a>

              <div className="flex items-center gap-4 text-zinc-300">
                <div className="w-12 h-12 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-zinc-500">Location</h4>
                  <p className="font-medium text-lg">Lebanon (Open to Remote)</p>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-zinc-800">
              <h4 className="text-sm font-medium text-zinc-500 mb-6">Connect across platforms</h4>
              <div className="flex gap-4">
                <a href="#" className="w-12 h-12 rounded-full bg-zinc-900 border border-zinc-800 hover:border-blue-500 hover:bg-blue-600/10 flex items-center justify-center text-zinc-400 hover:text-blue-400 transition-all">
                  <Linkedin className="w-5 h-5" />
                </a>
                <a href="#" className="w-12 h-12 rounded-full bg-zinc-900 border border-zinc-800 hover:border-zinc-500 hover:bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white transition-all">
                  <Github className="w-5 h-5" />
                </a>
                <a href="#" className="w-12 h-12 rounded-full bg-zinc-900 border border-zinc-800 hover:border-blue-400 hover:bg-blue-400/10 flex items-center justify-center text-zinc-400 hover:text-blue-400 transition-all">
                  <Twitter className="w-5 h-5" />
                </a>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Form */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-zinc-900/50 border border-zinc-800/80 p-8 md:p-10 rounded-3xl backdrop-blur-sm shadow-2xl shadow-zinc-950/50"
          >
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium text-zinc-400">Full Name</label>
                  <input 
                    type="text" 
                    id="name" 
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-100 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-zinc-600"
                    placeholder="John Doe"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-zinc-400">Email Address</label>
                  <input 
                    type="email" 
                    id="email" 
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-100 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-zinc-600"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="subject" className="text-sm font-medium text-zinc-400">Subject</label>
                <input 
                  type="text" 
                  id="subject" 
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-100 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-zinc-600"
                  placeholder="Project Inquiry"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium text-zinc-400">Message</label>
                <textarea 
                  id="message" 
                  rows={6}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-100 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all resize-none placeholder:text-zinc-600"
                  placeholder="Tell me about your project, goals, or technical needs..."
                ></textarea>
              </div>

              <button 
                type="button" 
                className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] group"
              >
                Send Message
                <Send className="w-5 h-5 group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
              </button>
            </form>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
