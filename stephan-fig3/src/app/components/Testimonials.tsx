import React from 'react';
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';

const testimonials = [
  {
    quote: "Stephan transformed our approach to quality assurance. His structured governance systems saved us hundreds of hours in deployment cycles.",
    author: "CTO, Tech Enterprise",
    role: "Engineering Leadership"
  },
  {
    quote: "Working with Stephan on our custom CMS was an incredible experience. He brings a unique blend of technical mastery and design sensibility.",
    author: "Director of Digital",
    role: "Digital Agency"
  },
  {
    quote: "His ability to bridge complex algorithms with musical theory for our AI project was unmatched. A true polymath in the digital space.",
    author: "Founder, MusicTech Startup",
    role: "Product Vision"
  }
];

export function Testimonials() {
  return (
    <section className="py-24 bg-zinc-950 border-t border-zinc-900/50">
      <div className="container mx-auto px-6 md:px-12">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-sm font-semibold text-blue-500 uppercase tracking-widest mb-2">Trust & Validation</h2>
            <h3 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-4">Client Feedback</h3>
            <p className="text-zinc-400 text-lg">
              Collaborations built on precision, reliability, and innovative problem-solving.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((test, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="bg-zinc-900/40 border border-zinc-800/80 p-8 rounded-2xl relative group hover:border-zinc-700 transition-colors"
            >
              <Quote className="absolute top-6 right-6 w-12 h-12 text-zinc-800/50 group-hover:text-blue-500/10 transition-colors" />
              
              <div className="relative z-10">
                <div className="flex gap-1 mb-6 text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                
                <p className="text-zinc-300 italic mb-8 leading-relaxed">
                  "{test.quote}"
                </p>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-zinc-800 border-2 border-zinc-700 overflow-hidden">
                    <div className="w-full h-full bg-zinc-700 flex items-center justify-center text-zinc-500 text-xs font-bold uppercase">
                      {test.author.charAt(0)}
                    </div>
                  </div>
                  <div>
                    <h5 className="text-white font-bold text-sm">{test.author}</h5>
                    <p className="text-zinc-500 text-xs">{test.role}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
