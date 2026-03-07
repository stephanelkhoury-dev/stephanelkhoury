import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

const projects = [
  {
    title: "Harmonix",
    category: "AI Music Analysis",
    description: "An AI-powered music analysis platform blending complex algorithms with intuitive musical theory, helping musicians decode chord structures dynamically.",
    image: "https://images.unsplash.com/photo-1762264644162-363c5b4e151d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMGRhcmslMjBibHVlJTIwZ29sZCUyMHRlY2hub2xvZ3l8ZW58MXx8fHwxNzcyNzY2MTQ2fDA&ixlib=rb-4.1.0&q=80&w=1080",
    tags: ["React", "FastAPI", "AI Models", "Web Audio"]
  },
  {
    title: "QA Phobia",
    category: "QA Governance Platform",
    description: "A structured quality assurance governance platform designed to streamline testing processes, audit trails, and validation systems for enterprise scale.",
    image: "https://images.unsplash.com/photo-1723987251277-18fc0a1effd0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXRhJTIwYW5hbHl0aWNzJTIwY2hhcnQlMjBzY3JlZW58ZW58MXx8fHwxNzcyNzY2MTc0fDA&ixlib=rb-4.1.0&q=80&w=1080",
    tags: ["Next.js", "Node.js", "PostgreSQL", "Data Viz"]
  },
  {
    title: "Clinickable",
    category: "HealthTech Platform",
    description: "A comprehensive clinic management platform focusing on secure patient data handling, intuitive booking, and robust backend architecture.",
    image: "https://images.unsplash.com/photo-1631563020941-c0c6bc534b8e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBtZWRpY2FsJTIwZGFzaGJvYXJkJTIwVUl8ZW58MXx8fHwxNzcyNzY2MTczfDA&ixlib=rb-4.1.0&q=80&w=1080",
    tags: ["React", "Express", "HIPAA Compliance", "UI/UX"]
  },
  {
    title: "LibraryMe",
    category: "Digital Library",
    description: "A scalable digital library platform providing seamless reading experiences, advanced search algorithms, and structured cataloging.",
    image: "https://images.unsplash.com/photo-1770307939909-f27b8e4ae9c9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaWdpdGFsJTIwbGlicmFyeSUyMHJlYWRpbmclMjBwbGF0Zm9ybXxlbnwxfHx8fDE3NzI3NjYxNzN8MA&ixlib=rb-4.1.0&q=80&w=1080",
    tags: ["React", "MongoDB", "ElasticSearch"]
  },
  {
    title: "Hospitality Connect",
    category: "Booking & Management",
    description: "Premium restaurant and hospitality booking platforms combining luxurious front-end design with robust reservation management backends.",
    image: "https://images.unsplash.com/photo-1746130560622-766ee657968f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjByZXN0YXVyYW50JTIwd2Vic2l0ZXxlbnwxfHx8fDE3NzI3NjYxNzN8MA&ixlib=rb-4.1.0&q=80&w=1080",
    tags: ["Next.js", "Stripe", "Tailwind CSS"]
  },
  {
    title: "Enterprise Web Systems",
    category: "CMS Architecture",
    description: "Custom WordPress, WooCommerce, and headless enterprise CMS implementations focusing on speed, technical SEO, and conversion optimization.",
    image: "https://images.unsplash.com/photo-1760548425425-e42e77fa38f1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBzb2Z0d2FyZSUyMGVuZ2luZWVyaW5nfGVufDF8fHx8MTc3Mjc2NjE0Nnww&ixlib=rb-4.1.0&q=80&w=1080",
    tags: ["WordPress", "PHP", "Technical SEO", "React"]
  }
];

export function Projects() {
  return (
    <section id="projects" className="py-24 bg-zinc-950">
      <div className="container mx-auto px-6 md:px-12">
        <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <h2 className="text-sm font-semibold text-blue-500 uppercase tracking-widest mb-2">Portfolio</h2>
            <h3 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-4">Featured Work</h3>
            <p className="text-zinc-400 text-lg">
              A selection of digital platforms, applications, and tools engineered for performance and beautifully designed for users.
            </p>
          </motion.div>
          
          <motion.a 
            href="https://github.com" 
            target="_blank" 
            rel="noreferrer"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="hidden md:inline-flex items-center gap-2 px-6 py-3 rounded-full bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white transition-colors text-sm font-medium"
          >
            View GitHub Archive
            <ArrowUpRight size={16} />
          </motion.a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="group bg-zinc-900/50 rounded-3xl overflow-hidden border border-zinc-800/80 hover:border-zinc-700 transition-all flex flex-col hover:shadow-2xl hover:shadow-blue-500/5"
            >
              {/* Project Image */}
              <div className="relative h-64 overflow-hidden bg-zinc-800">
                <div className="absolute inset-0 bg-zinc-900/20 group-hover:bg-transparent transition-colors z-10" />
                <ImageWithFallback
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                
                {/* Category Badge */}
                <div className="absolute top-4 left-4 z-20">
                  <span className="px-3 py-1 text-xs font-semibold rounded-full bg-zinc-950/80 text-white backdrop-blur-md border border-zinc-800">
                    {project.category}
                  </span>
                </div>
              </div>

              {/* Project Content */}
              <div className="p-8 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <h4 className="text-2xl font-bold text-zinc-100 group-hover:text-blue-400 transition-colors">
                    {project.title}
                  </h4>
                  <a href="#" className="p-2 rounded-full bg-zinc-800 text-zinc-400 group-hover:bg-blue-600 group-hover:text-white transition-colors opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transform duration-300">
                    <ArrowUpRight size={18} />
                  </a>
                </div>
                
                <p className="text-zinc-400 text-sm leading-relaxed mb-6 flex-1">
                  {project.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mt-auto pt-4 border-t border-zinc-800/50">
                  {project.tags.map((tag, tIdx) => (
                    <span key={tIdx} className="text-xs font-medium text-zinc-500 bg-zinc-900 px-2 py-1 rounded-md">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
