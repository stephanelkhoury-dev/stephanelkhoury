import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Layers, Code2, Cpu, LineChart } from 'lucide-react';

export function Hero() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden bg-zinc-950">
      {/* Interactive Mouse Spotlight */}
      <div 
        className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-300"
        style={{
          background: `radial-gradient(800px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(29, 78, 216, 0.15), transparent 40%)`
        }}
      />

      {/* Grid Pattern */}
      <div className="absolute inset-0 z-0 opacity-20" 
           style={{ backgroundImage: 'linear-gradient(#3f3f46 1px, transparent 1px), linear-gradient(90deg, #3f3f46 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
      </div>

      <div className="container relative z-10 mx-auto px-6 md:px-12 flex flex-col items-center">
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-5xl mx-auto text-center flex flex-col items-center"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 backdrop-blur-sm mb-8 text-blue-400">
            <LineChart size={14} />
            <span className="text-xs font-semibold tracking-wide uppercase">Multimedia Engineer & SEO Expert</span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight text-white mb-6 leading-[1.1]">
            Engineering <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-emerald-400">High-End</span> <br className="hidden md:block" />
            Digital Solutions.
          </h1>
          
          <p className="text-lg md:text-2xl text-zinc-400 mb-12 font-light max-w-3xl mx-auto leading-relaxed">
            I control the data, create the interactive screening, and build the scalable base. Bridging technical SEO strategy with multimedia development to deliver the best end-to-end applications.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center">
            <a href="#projects" className="group relative flex items-center justify-center gap-2 px-8 py-4 bg-zinc-100 hover:bg-white text-zinc-950 rounded-full font-bold transition-all w-full sm:w-auto overflow-hidden">
              <span className="relative z-10 flex items-center gap-2">
                Explore Solutions
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 h-full w-full bg-white scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 ease-out"></div>
            </a>
            <a href="#architecture" className="px-8 py-4 bg-zinc-900 border border-zinc-800 hover:border-blue-500/50 text-zinc-300 hover:text-white rounded-full font-medium transition-all w-full sm:w-auto flex items-center justify-center gap-2 group">
              <Layers size={18} className="text-zinc-500 group-hover:text-blue-400 transition-colors" />
              View Architecture
            </a>
          </div>
        </motion.div>

        {/* Floating Tech Badges showing "Multimedia / High-end" vibe */}
        <div className="w-full max-w-5xl mt-24 grid grid-cols-2 md:grid-cols-4 gap-4 relative z-10">
          {[
            { icon: <Code2 />, title: "Creating the Screening", desc: "Interactive UI & WebGL" },
            { icon: <Cpu />, title: "Building the Base", desc: "System Architecture & APIs" },
            { icon: <LineChart />, title: "Controlling Data", desc: "Technical SEO & Analytics" },
            { icon: <Layers />, title: "QA Governance", desc: "19 Global Certifications" }
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
              className="bg-zinc-900/50 backdrop-blur-md border border-zinc-800/80 p-5 rounded-2xl hover:bg-zinc-800/50 hover:border-zinc-700 transition-colors group"
            >
              <div className="text-blue-400 mb-3 group-hover:scale-110 transition-transform origin-left">{item.icon}</div>
              <h3 className="text-white font-semibold text-sm mb-1">{item.title}</h3>
              <p className="text-zinc-500 text-xs">{item.desc}</p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
