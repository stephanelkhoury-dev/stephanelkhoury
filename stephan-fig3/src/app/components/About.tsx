import React from 'react';
import { motion } from 'framer-motion';
import { Terminal, Database, ShieldCheck, Zap, Award } from 'lucide-react';

export function About() {
  return (
    <section id="about" className="py-24 bg-zinc-950 relative overflow-hidden">
      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Column - Text Content */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div>
              <h2 className="text-sm font-semibold text-blue-500 uppercase tracking-widest mb-2">End-to-End Capabilities</h2>
              <h3 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-6">
                Controlling data, creating the screening, and <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">building the base.</span>
              </h3>
            </div>
            
            <div className="space-y-6 text-zinc-400 text-lg leading-relaxed">
              <p>
                As a Multimedia Engineer and SEO Expert, my approach to digital product development spans the absolute entirety of a project's lifecycle. I don't just write code; I architect the entire experience.
              </p>
              <p>
                Backed by <strong className="text-white">19 global certifications</strong> across various technical domains, I have built a comprehensive toolkit. I create the screening—pixel-perfect, highly interactive frontends that captivate users. I build the base—robust, scalable backend architectures that power enterprise platforms.
              </p>
              <p>
                Furthermore, my deep expertise in technical SEO allows me to control the data, ensuring the solutions I build are not just functional and beautiful, but inherently optimized for visibility, analytics, and growth. 
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-4">
              <div className="border border-zinc-800 bg-zinc-900/50 p-4 rounded-xl">
                <div className="text-3xl font-bold text-white mb-1 flex items-center gap-2">
                  19
                </div>
                <div className="text-xs text-zinc-500 uppercase tracking-wider">Global Certifications</div>
              </div>
              <div className="border border-zinc-800 bg-zinc-900/50 p-4 rounded-xl">
                <div className="text-3xl font-bold text-white mb-1">100%</div>
                <div className="text-xs text-zinc-500 uppercase tracking-wider">Code Quality</div>
              </div>
              <div className="border border-zinc-800 bg-zinc-900/50 p-4 rounded-xl hidden md:block">
                <div className="text-3xl font-bold text-white mb-1">50+</div>
                <div className="text-xs text-zinc-500 uppercase tracking-wider">Systems Built</div>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Tech Focus Visualization */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative h-full min-h-[500px] flex items-center justify-center lg:justify-end"
          >
            <div className="relative w-full max-w-md aspect-square">
              {/* Central Core */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-blue-600/20 rounded-full blur-2xl animate-pulse" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-zinc-900 border border-zinc-700 rounded-2xl flex flex-col items-center justify-center shadow-2xl z-20">
                <Award className="w-8 h-8 text-amber-400 mb-1" />
                <span className="text-xs font-bold text-white">19 CERTS</span>
              </div>

              {/* Orbiting Nodes */}
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 border border-zinc-800 rounded-full"
              >
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-zinc-900 border border-zinc-700 rounded-full flex items-center justify-center -rotate-90 group relative cursor-pointer">
                  <Database className="w-5 h-5 text-emerald-400" />
                  <span className="absolute -top-8 bg-zinc-800 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Control Data</span>
                </div>
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-zinc-900 border border-zinc-700 rounded-full flex items-center justify-center -rotate-90 group relative cursor-pointer">
                  <ShieldCheck className="w-5 h-5 text-purple-400" />
                  <span className="absolute -bottom-8 bg-zinc-800 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">QA Base</span>
                </div>
              </motion.div>
              
              <motion.div 
                animate={{ rotate: -360 }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                className="absolute inset-12 border border-zinc-800/50 rounded-full"
              >
                <div className="absolute top-1/2 -left-6 -translate-y-1/2 w-12 h-12 bg-zinc-900 border border-zinc-700 rounded-full flex items-center justify-center rotate-90 group relative cursor-pointer">
                  <Zap className="w-5 h-5 text-amber-400" />
                  <span className="absolute -left-24 bg-zinc-800 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Screening UI</span>
                </div>
              </motion.div>

              {/* Decorative data lines */}
              <svg className="absolute inset-0 w-full h-full z-10 opacity-30 pointer-events-none" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="#3f3f46" strokeWidth="0.5" strokeDasharray="2 4" />
                <circle cx="50" cy="50" r="30" fill="none" stroke="#3f3f46" strokeWidth="0.5" strokeDasharray="2 4" />
              </svg>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
