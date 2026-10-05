'use client';

import Image from 'next/image';
import { useState } from 'react';

export default function ProjectLogo({ title, src, featured = false }: { title: string; src?: string; featured?: boolean }) {
  const [failed, setFailed] = useState(false);

  return (
    <div className={`project-logo-frame ${featured ? 'project-logo-featured' : ''}`}>
      {src && !failed ? (
        <Image
          src={src}
          alt={`${title} logo`}
          fill
          sizes={featured ? '(max-width: 768px) 75vw, 600px' : '(max-width: 768px) 65vw, 380px'}
          onError={() => setFailed(true)}
          className="object-contain"
          priority={featured}
        />
      ) : (
        <span className="project-logo-wordmark">{title}</span>
      )}
    </div>
  );
}