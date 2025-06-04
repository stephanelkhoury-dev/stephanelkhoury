'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';
import Image from 'next/image';
import Modal from './Modal';

interface Project {
  title: string;
  description: string;
  image: string;
  technologies: string[];
  github?: string;
  live?: string;
  category: string;
  fullDescription?: string;
  features?: string[];
  challenges?: string[];
  date?: string;
}

interface ProjectModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

const ProjectModal: React.FC<ProjectModalProps> = ({ project, isOpen, onClose }) => {
  if (!project) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={project.title}>
      {/* Mobile Layout */}
      <div className="md:hidden space-y-6">
        {/* Project Image */}
        <div className="relative aspect-square rounded-xl overflow-hidden group">
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw"
            priority={true}
            quality={90}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          
          {/* Overlay Info */}
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <div className="flex flex-wrap gap-2">
              <span className="px-2 py-1 text-xs bg-white/20 backdrop-blur-sm rounded-full">
                {project.category}
              </span>
              {project.date && (
                <span className="px-2 py-1 text-xs bg-white/20 backdrop-blur-sm rounded-full">
                  {project.date}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Content */}
        <div className="space-y-4">
          {/* Description */}
          <p className="text-gray-300 leading-relaxed text-sm">
            {project.fullDescription || project.description}
          </p>

          {/* Technologies */}
          <div>
            <h3 className="text-base font-semibold text-white mb-3">Technologies Used</h3>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech, index) => (
                <motion.span
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  className="px-3 py-1 bg-gradient-to-r from-[#00E1FF]/20 to-[#C13CFF]/20 border border-[#00E1FF]/30 rounded-full text-xs text-[#00E1FF] font-medium"
                >
                  {tech}
                </motion.span>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3">
            {project.github && (
              <motion.a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-gray-700 to-gray-600 rounded-lg text-white font-medium hover:from-gray-600 hover:to-gray-500 transition-all text-sm"
              >
                <FontAwesomeIcon icon={faGithub} />
                View Code
              </motion.a>
            )}
            {project.live && (
              <motion.a
                href={project.live}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#00E1FF] to-[#C13CFF] rounded-lg text-white font-medium hover:shadow-lg hover:shadow-[#00E1FF]/25 transition-all text-sm"
              >
                <FontAwesomeIcon icon={faExternalLinkAlt} />
                Live Demo
              </motion.a>
            )}
          </div>

          {/* Features & Challenges */}
          {(project.features || project.challenges) && (
            <div className="space-y-4 pt-4 border-t border-white/10">
              {project.features && (
                <div>
                  <h3 className="text-base font-semibold text-white mb-3">Key Features</h3>
                  <ul className="space-y-2">
                    {project.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2 text-gray-300 text-sm">
                        <span className="text-[#00E1FF] mt-1 flex-shrink-0">•</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {project.challenges && (
                <div>
                  <h3 className="text-base font-semibold text-white mb-3">Technical Challenges</h3>
                  <ul className="space-y-2">
                    {project.challenges.map((challenge, index) => (
                      <li key={index} className="flex items-start gap-2 text-gray-300 text-sm">
                        <span className="text-[#C13CFF] mt-1 flex-shrink-0">•</span>
                        <span>{challenge}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Desktop Layout - Image Left, Content Right in Two Columns */}
      <div className="hidden md:flex gap-8">
        {/* Left Side - 1:1 Image */}
        <div className="flex-shrink-0 w-80">
          <div className="relative aspect-square rounded-xl overflow-hidden group">
            <Image
              src={project.image}
              alt={project.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="320px"
              priority={true}
              quality={90}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            
            {/* Overlay Info */}
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 text-xs bg-white/20 backdrop-blur-sm rounded-full">
                  {project.category}
                </span>
                {project.date && (
                  <span className="px-3 py-1 text-xs bg-white/20 backdrop-blur-sm rounded-full">
                    {project.date}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Two Columns Content */}
        <div className="flex-1 grid grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Project Overview</h3>
              <p className="text-gray-300 leading-relaxed text-sm">
                {project.fullDescription || project.description}
              </p>
            </div>

            {/* Technologies */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Technologies Used</h3>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech, index) => (
                  <motion.span
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    className="px-3 py-1 bg-gradient-to-r from-[#00E1FF]/20 to-[#C13CFF]/20 border border-[#00E1FF]/30 rounded-full text-xs text-[#00E1FF] font-medium"
                  >
                    {tech}
                  </motion.span>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              {project.github && (
                <motion.a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-gray-700 to-gray-600 rounded-lg text-white font-medium hover:from-gray-600 hover:to-gray-500 transition-all text-sm"
                >
                  <FontAwesomeIcon icon={faGithub} />
                  View Code
                </motion.a>
              )}
              {project.live && (
                <motion.a
                  href={project.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#00E1FF] to-[#C13CFF] rounded-lg text-white font-medium hover:shadow-lg hover:shadow-[#00E1FF]/25 transition-all text-sm"
                >
                  <FontAwesomeIcon icon={faExternalLinkAlt} />
                  Live Demo
                </motion.a>
              )}
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Features */}
            {project.features && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Key Features</h3>
                <div className="space-y-2">
                  {project.features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-2 p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                      <span className="text-[#00E1FF] mt-1 flex-shrink-0 text-xs">•</span>
                      <span className="text-gray-300 text-xs leading-relaxed">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Challenges */}
            {project.challenges && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Technical Challenges</h3>
                <div className="space-y-2">
                  {project.challenges.map((challenge, index) => (
                    <div key={index} className="flex items-start gap-2 p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                      <span className="text-[#C13CFF] mt-1 flex-shrink-0 text-xs">•</span>
                      <span className="text-gray-300 text-xs leading-relaxed">{challenge}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Project Stats */}
            <div className="p-4 bg-white/5 rounded-lg">
              <h4 className="text-white font-medium mb-3">Project Details</h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-400">Category:</span>
                  <span className="text-gray-300">{project.category}</span>
                </div>
                {project.date && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Date:</span>
                    <span className="text-gray-300">{project.date}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-400">Technologies:</span>
                  <span className="text-gray-300">{project.technologies.length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ProjectModal;
