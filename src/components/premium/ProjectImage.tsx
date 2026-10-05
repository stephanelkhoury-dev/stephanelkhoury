'use client';

import Image from 'next/image';
import { useState } from 'react';

type ProjectImageProps = {
  src: string | null;
  alt: string;
  title: string;
  summary?: string;
  index?: number;
  fit?: 'cover' | 'contain';
  sizes: string;
  priority?: boolean;
  className?: string;
};

export default function ProjectImage({
  src,
  alt,
  title,
  summary,
  index = 0,
  fit = 'cover',
  sizes,
  priority = false,
  className = '',
}: ProjectImageProps) {
  const [failed, setFailed] = useState(false);
  const canLoadImage = Boolean(src) && !src?.startsWith('/api/blob/');

  return (
    <div className={`project-image-frame relative overflow-hidden ${fit === 'contain' ? 'bg-white dark:bg-zinc-100' : 'bg-[#ecebe5] dark:bg-zinc-900'} ${className}`}>
      {src && canLoadImage && !failed ? (
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes={sizes}
          onError={() => setFailed(true)}
          className={fit === 'contain' ? 'object-contain p-8 sm:p-12' : 'object-cover transition-transform duration-700 group-hover:scale-[1.025]'}
        />
      ) : (
        <div role="img" aria-label={alt} className={`project-art-fallback project-art-variant-${index % 3} absolute inset-0 flex flex-col justify-between p-6 sm:p-10`}>
          <p className="relative z-10 text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--accent-secondary)]">{summary || 'Selected work'}</p>
          <p className="relative z-10 max-w-[12ch] font-display text-4xl leading-[0.95] text-[#191a18] sm:text-6xl">{title}</p>
          <span aria-hidden="true" className="project-art-mark">{String(index + 1).padStart(2, '0')}</span>
        </div>
      )}
    </div>
  );
}