import React from 'react';
import { motion } from 'framer-motion';
import { Layers, Database, Globe, Search, Play, FileCode2 } from 'lucide-react';

const skillCategories = [
  {
    icon: <FileCode2 className="w-6 h-6 text-blue-400" />,
    title: "Frontend Development",
    skills: ["React", "Next.js", "TypeScript", "JavaScript (ES6+)", "Tailwind CSS", "HTML5 & CSS3"]
  },
  {
    icon: <Database className="w-6 h-6 text-emerald-400" />,
    title: "Backend & Systems",
    skills: ["Node.js", "Express", "FastAPI", "PostgreSQL", "MongoDB", "RESTful APIs"]
  },
  {
    icon: <Globe className="w-6 h-6 text-amber-400" />,
    title: "CMS & Platforms",
    skills: ["WordPress Architecture", "WooCommerce", "Enterprise CMS", "Headless Implementation"]
  },
  {
    icon: <Layers className="w-6 h-6 text-purple-400" />,
    title: "Quality Assurance",
    skills: ["Manual Testing", "Structured QA Governance", "Audit Trails", "Validation Systems", "Performance Testing"]
  },
  {
    icon: <Search className="w-6 h-6 text-pink-400" />,
    title: "SEO & Analytics",
    skills: ["Technical SEO", "Performance Optimization", "Data Analytics", "Reporting & Insights"]
  },
  {
    icon: <Play className="w-6 h-6 text-rose-400" />,
    title: "Multimedia & UI/UX",
    skills: ["WebGL & Canvas", "Framer Motion", "Interactive Screening", "Digital Experience Design"]
  }
];

export function Skills() {
  return (
    <section id="skills" className="py-24 bg-zinc-950 border-t border-zinc-900/50">
      <div className="container mx-auto px-6 md:px-12">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-sm font-semibold text-emerald-500 uppercase tracking-widest mb-2">Technical Proficiency</h2>
            <h3 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-4">Skills & Tools</h3>
            <p className="text-zinc-400 text-lg">
              A diverse technical stack enabling end-to-end product development, from architecture to execution.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {skillCategories.map((category, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="bg-zinc-900/30 border border-zinc-800/80 rounded-2xl p-8 hover:bg-zinc-900/50 hover:border-zinc-700 transition-colors"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 rounded-xl bg-zinc-800/50">
                  {category.icon}
                </div>
                <h4 className="text-xl font-bold text-zinc-100">{category.title}</h4>
              </div>
              
              <ul className="space-y-3">
                {category.skills.map((skill, sIdx) => (
                  <li key={sIdx} className="flex items-center gap-3 text-zinc-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-700" />
                    <span className="text-sm font-medium">{skill}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
