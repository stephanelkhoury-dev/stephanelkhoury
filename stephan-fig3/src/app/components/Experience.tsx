import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, ChevronRight, Activity, Cpu } from 'lucide-react';

const experiences = [
  {
    year: "2023 - Present",
    title: "Lead Systems Architect & Full Stack Consultant",
    company: "Freelance / Enterprise Clients",
    description: "Designing and implementing high-end scalable web architectures, intricate multimedia dashboards, and custom backend systems. Responsible for end-to-end delivery of complex digital platforms.",
    metrics: ["100% Client Satisfaction", "Microservices Architecture", "Performance Opt."]
  },
  {
    year: "2022 - 2024",
    title: "QA Engineer & Auditor",
    company: "Tech Enterprise",
    description: "Developed and managed structured QA governance frameworks. Created automated testing pipelines and conducted extensive performance audits to guarantee robust software deployment.",
    metrics: ["99.9% Uptime Verified", "Automated Pipelines", "Security Audits"]
  },
  {
    year: "2021 - 2023",
    title: "Frontend & Multimedia Developer",
    company: "Digital Agency",
    description: "Built visually stunning, highly interactive web applications using React and WebGL. Focused on bridging the gap between rigorous technical SEO and high-end creative design.",
    metrics: ["Interactive UIs", "WebGL Integration", "Technical SEO"]
  },
  {
    year: "2017 - 2021",
    title: "Computer Engineering (B.E.)",
    company: "Lebanese American University",
    description: "Deep dive into software engineering principles, system architecture, data structures, and hardware-software integration.",
    metrics: ["System Architecture", "Algorithms", "Advanced Computing"]
  }
];

export function Experience() {
  return (
    <section id="experience" className="py-24 bg-zinc-950 border-t border-zinc-900/50">
      <div className="container mx-auto px-6 md:px-12">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-sm font-semibold text-purple-500 uppercase tracking-widest mb-2 flex items-center justify-center gap-2">
              <Cpu size={16} />
              Career Trajectory
            </h2>
            <h3 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-4">Engineering Experience</h3>
            <p className="text-zinc-400 text-lg">
              A log of professional roles focusing on enterprise architecture, multimedia development, and quality assurance.
            </p>
          </motion.div>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="space-y-6">
            {experiences.map((exp, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="group flex flex-col md:flex-row gap-6 bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-6 md:p-8 hover:bg-zinc-900 hover:border-zinc-700 transition-all cursor-crosshair"
              >
                {/* Year/Time column */}
                <div className="md:w-1/4 shrink-0">
                  <div className="sticky top-24">
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-950 border border-zinc-800 text-xs font-mono text-zinc-400 group-hover:text-blue-400 transition-colors">
                      <Activity size={12} className={idx === 0 ? "text-emerald-500" : "text-zinc-500"} />
                      {exp.year}
                    </span>
                  </div>
                </div>

                {/* Content column */}
                <div className="md:w-3/4 space-y-4">
                  <div>
                    <h4 className="text-xl md:text-2xl font-bold text-white group-hover:text-blue-400 transition-colors flex items-center gap-2">
                      {exp.title}
                      <ChevronRight className="w-5 h-5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-blue-500" />
                    </h4>
                    <div className="flex items-center gap-2 mt-2 text-sm font-medium text-zinc-400">
                      <Briefcase size={14} />
                      {exp.company}
                    </div>
                  </div>
                  
                  <p className="text-zinc-400 leading-relaxed">
                    {exp.description}
                  </p>

                  <div className="flex flex-wrap gap-2 pt-2">
                    {exp.metrics.map((metric, mIdx) => (
                      <span key={mIdx} className="text-[10px] font-mono uppercase tracking-wider bg-zinc-800/50 text-zinc-300 px-2.5 py-1 rounded-md border border-zinc-700/50">
                        {metric}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
