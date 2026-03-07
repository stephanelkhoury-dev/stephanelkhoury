import React from 'react';
import { motion } from 'framer-motion';
import { Server, Layout, Database, Workflow, Search, Activity } from 'lucide-react';

const pipeline = [
  {
    icon: <Layout className="w-6 h-6 text-cyan-400" />,
    title: "Creating the Screening",
    details: ["Interactive Frontend", "React & WebGL", "UI/UX Implementation", "Multimedia Delivery"],
    status: "Optimized"
  },
  {
    icon: <Server className="w-6 h-6 text-blue-500" />,
    title: "Building the Base",
    details: ["Core Infrastructure", "Node.js / FastAPI", "Microservices", "System Architecture"],
    status: "Scalable"
  },
  {
    icon: <Database className="w-6 h-6 text-emerald-400" />,
    title: "Controlling Data",
    details: ["Database Engineering", "PostgreSQL & MongoDB", "Data Pipelines", "Caching Layers"],
    status: "Secure"
  },
  {
    icon: <Search className="w-6 h-6 text-amber-400" />,
    title: "SEO & Growth",
    details: ["Technical SEO", "Performance Audits", "Analytics Integration", "Visibility Strategies"],
    status: "Verified"
  }
];

export function Architecture() {
  return (
    <section id="architecture" className="py-24 bg-zinc-950 relative border-t border-zinc-900/50 overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-blue-900/10 blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-sm font-semibold text-blue-500 uppercase tracking-widest mb-2 flex items-center justify-center gap-2">
              <Workflow size={16} />
              The Pipeline
            </h2>
            <h3 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-4">Complete Solution Lifecycle</h3>
            <p className="text-zinc-400 text-lg">
              From the foundational data architecture to the final user screening, engineered for absolute performance and reach.
            </p>
          </motion.div>
        </div>

        <div className="relative max-w-5xl mx-auto">
          {/* Connecting Line (Desktop) */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-500/20 via-blue-500/50 to-amber-500/20 -translate-y-1/2" />
          
          {/* Animated data packets */}
          <motion.div 
            animate={{ left: ["0%", "100%"] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="hidden lg:block absolute top-1/2 w-4 h-1 bg-white shadow-[0_0_10px_#fff] rounded-full -translate-y-1/2 z-0" 
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
            {pipeline.map((node, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.15 }}
                className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 hover:border-zinc-600 transition-colors shadow-xl group relative overflow-hidden"
              >
                {/* Status Indicator */}
                <div className="absolute top-4 right-4 flex items-center gap-1.5">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-mono">{node.status}</span>
                </div>

                <div className="w-12 h-12 bg-zinc-950 border border-zinc-800 rounded-xl flex items-center justify-center mb-6 shadow-inner group-hover:scale-110 transition-transform">
                  {node.icon}
                </div>
                
                <h4 className="text-lg font-bold text-white mb-4">{node.title}</h4>
                
                <ul className="space-y-2">
                  {node.details.map((detail, dIdx) => (
                    <li key={dIdx} className="flex items-center gap-2 text-sm text-zinc-400 font-mono">
                      <Activity className="w-3 h-3 text-zinc-600" />
                      {detail}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
