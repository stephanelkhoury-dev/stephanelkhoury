'use client';

import { motion } from 'framer-motion';
import { Layers, Database, Globe, Search, Play, FileCode2, type LucideIcon } from 'lucide-react';
import type { SkillsContent } from './types';

const iconMap: Record<string, LucideIcon> = {
  frontend: FileCode2,
  backend: Database,
  cms: Globe,
  qa: Layers,
  seo: Search,
  creative: Play,
};

export default function PremiumSkills({ content }: { content: SkillsContent }) {
  const categories = content.categories ?? [];

  return (
    <section id="skills" className="editorial-section">
      <div className="editorial-section-inner">
        <div className="editorial-section-heading">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <h2 className="editorial-eyebrow">Technical Proficiency</h2>
            <h3 className="editorial-display font-display">{content.title}</h3>
            <p className="editorial-subtitle">{content.subtitle}</p>
          </motion.div>
        </div>

        <div className="skills-grid">
          {categories.map((category, index) => {
            const Icon = iconMap[category.icon] || FileCode2;
            return (
              <motion.div
                key={`${category.title}-${index}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="skills-category"
              >
                <div className="skills-category-heading">
                  <Icon size={19} aria-hidden="true" />
                  <h4 className="font-display">{category.title}</h4>
                </div>

                <ul>
                  {category.skills.map((skill) => (
                    <li key={`${category.title}-${skill}`}>
                      <span aria-hidden="true" />
                      <span className="text-sm font-medium">{skill}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
