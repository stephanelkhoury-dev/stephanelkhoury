import React from 'react';
import { motion } from 'framer-motion';
import { Code2, MonitorCheck, BarChart3, Palette, CheckCircle2, Music, Blocks, Briefcase } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

const services = [
  {
    icon: <MonitorCheck className="w-8 h-8 text-blue-400" />,
    title: "Website Design & Dev",
    desc: "Custom, responsive, and performant web experiences built from the ground up."
  },
  {
    icon: <Code2 className="w-8 h-8 text-amber-400" />,
    title: "Full Stack Web Apps",
    desc: "End-to-end architecture using React, Next.js, Node.js, and modern databases."
  },
  {
    icon: <CheckCircle2 className="w-8 h-8 text-emerald-400" />,
    title: "QA Audits & Testing",
    desc: "Structured QA governance platforms and manual testing to ensure product quality."
  },
  {
    icon: <BarChart3 className="w-8 h-8 text-purple-400" />,
    title: "SEO & Optimization",
    desc: "Technical SEO, performance optimization, and data analytics for better reach."
  },
  {
    icon: <Palette className="w-8 h-8 text-pink-400" />,
    title: "UI/UX Implementation",
    desc: "Translating complex designs into pixel-perfect, accessible user interfaces."
  },
  {
    icon: <Blocks className="w-8 h-8 text-indigo-400" />,
    title: "Technical Documentation",
    desc: "Clear, concise documentation for complex architectures and platforms."
  },
  {
    icon: <Music className="w-8 h-8 text-rose-400" />,
    title: "Music Digital Tools",
    desc: "Innovative digital products blending music theory, chord structures, and tech."
  },
  {
    icon: <Briefcase className="w-8 h-8 text-cyan-400" />,
    title: "Business Websites",
    desc: "Scalable CMS solutions including custom WordPress and enterprise systems."
  }
];

export function Services() {
  return (
    <section id="services" className="py-24 bg-zinc-950 relative border-t border-zinc-900/50">
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1760548425425-e42e77fa38f1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBzb2Z0d2FyZSUyMGVuZ2luZWVyaW5nfGVufDF8fHx8MTc3Mjc2NjE0Nnww&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Modern Software Engineering"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-sm font-semibold text-blue-500 uppercase tracking-widest mb-2">Capabilities</h2>
            <h3 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-4">Services & Expertise</h3>
            <p className="text-zinc-400 text-lg">
              A comprehensive approach to digital products, combining engineering, quality assurance, and creative design.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="bg-zinc-900/40 border border-zinc-800/80 hover:border-zinc-700 backdrop-blur-sm p-8 rounded-2xl group transition-all duration-300 hover:shadow-[0_0_30px_rgba(59,130,246,0.1)] hover:-translate-y-1 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-zinc-800/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="mb-6 inline-flex p-3 rounded-xl bg-zinc-800/50 group-hover:bg-zinc-800 transition-colors">
                {service.icon}
              </div>
              <h4 className="text-xl font-bold text-zinc-100 mb-3">{service.title}</h4>
              <p className="text-zinc-400 text-sm leading-relaxed relative z-10">
                {service.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
