'use client';

import { motion } from 'framer-motion';
import { Server, Layout, Database, Workflow, Search, Activity, type LucideIcon } from 'lucide-react';
import type { ArchitectureContent } from './types';

const iconMap: Record<string, LucideIcon> = {
  screening: Layout,
  base: Server,
  data: Database,
  seo: Search,
};

export default function PremiumArchitecture({ content }: { content: ArchitectureContent }) {
  const pipeline = content.pipeline ?? [];

  return (
    <section id="architecture" className="editorial-section">
      <div className="editorial-section-inner">
        <div className="editorial-section-heading">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <h2 className="editorial-eyebrow">
              <Workflow size={15} aria-hidden="true" />
              The Pipeline
            </h2>
            <h3 className="editorial-display font-display">{content.title}</h3>
            <p className="editorial-subtitle">{content.subtitle}</p>
          </motion.div>
        </div>

        <div className="architecture-grid">
          {pipeline.map((node, index) => {
            const Icon = iconMap[node.icon] || Layout;
            return (
              <motion.article
                key={`${node.title}-${index}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="architecture-item"
              >
                <div className="architecture-item-meta">
                  <Icon size={19} aria-hidden="true" />
                  <span>{node.status}</span>
                </div>
                <h4 className="font-display">{node.title}</h4>
                <ul>
                  {node.details.map((detail) => (
                    <li key={`${node.title}-${detail}`}>
                      <Activity size={13} aria-hidden="true" />
                      {detail}
                    </li>
                  ))}
                </ul>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
