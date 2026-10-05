import type { ExperienceContent } from '@/components/premium/types';

export type ExperienceItem = NonNullable<ExperienceContent['items']>[number];

export function experienceSlug(item: ExperienceItem): string {
  return item.slug || `${item.company}-${item.title}`
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export function experienceItems(content: unknown): ExperienceItem[] {
  if (!content || typeof content !== 'object' || !('items' in content) || !Array.isArray(content.items)) return [];
  return content.items.filter((item): item is ExperienceItem =>
    Boolean(item) && typeof item === 'object' &&
    typeof item.title === 'string' && typeof item.company === 'string' &&
    typeof item.year === 'string' && typeof item.description === 'string' &&
    Array.isArray(item.metrics) && item.metrics.every((metric: unknown) => typeof metric === 'string') &&
    (item.slug === undefined || (typeof item.slug === 'string' && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(item.slug))) &&
    ['achievements', 'tools', 'deliverables'].every((field) =>
      item[field] === undefined || (Array.isArray(item[field]) && item[field].every((value: unknown) => typeof value === 'string')),
    ),
  );
}