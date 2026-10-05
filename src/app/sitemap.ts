import type { MetadataRoute } from 'next';
import { getPublicContent } from '@/lib/bootstrap';
import { featuredProjectSlugs } from '@/lib/featured-projects';
import { experienceItems, experienceSlug } from '@/lib/experiences';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.stephanelkhoury.com';
  const now = new Date();
  const { blocks, projects, systems } = await getPublicContent();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1,
    },
  ];

  const projectRoutes: MetadataRoute.Sitemap = projects
    .filter((project) => featuredProjectSlugs.has(project.slug) && Boolean(project.liveUrl))
    .map((project) => ({
      url: `${baseUrl}/projects/${project.slug}`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    }));

  const platformRoutes: MetadataRoute.Sitemap = systems.map((system) => ({
    url: `${baseUrl}/platforms/${system.slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  const experienceRoutes: MetadataRoute.Sitemap = experienceItems(
    blocks.find((block) => block.slug === 'experience-main')?.content,
  ).map((item) => ({
    url: `${baseUrl}/experience/${experienceSlug(item)}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  return [...staticRoutes, ...projectRoutes, ...platformRoutes, ...experienceRoutes];
}
