import PremiumNavbar from '@/components/premium/Navbar';
import PremiumHero from '@/components/premium/Hero';
import PremiumAbout from '@/components/premium/About';
import PremiumServices from '@/components/premium/Services';
import PremiumProjects from '@/components/premium/Projects';
import PlatformLogos from '@/components/premium/PlatformLogos';
import PremiumSkills from '@/components/premium/Skills';
import PremiumExperience from '@/components/premium/Experience';
import PremiumArchitecture from '@/components/premium/Architecture';
import PremiumTestimonials from '@/components/premium/Testimonials';
import PremiumContact from '@/components/premium/Contact';
import PremiumFooter from '@/components/premium/Footer';
import { getPublicContent } from '@/lib/bootstrap';
import type {
  HeroContent,
  AboutContent,
  ServicesContent,
  SkillsContent,
  ExperienceContent,
  ArchitectureContent,
  TestimonialsContent,
  ContactContent,
} from '@/components/premium/types';

export const dynamic = 'force-dynamic';

function asRecord(value: unknown): Record<string, unknown> {
  if (value && typeof value === 'object') {
    return value as Record<string, unknown>;
  }
  return {};
}

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === 'string');
}

export default async function Home() {
  const { blocks, projects, systems, certificates } = await getPublicContent();
  const bySlug = Object.fromEntries(blocks.map((block) => [block.slug, block]));

  const heroBlock = bySlug['hero-main'];
  const aboutBlock = bySlug['about-main'];
  const servicesBlock = bySlug['services-main'];
  const skillsBlock = bySlug['skills-main'];
  const experienceBlock = bySlug['experience-main'];
  const architectureBlock = bySlug['architecture-main'];
  const testimonialsBlock = bySlug['testimonials-main'];
  const contactBlock = bySlug['contact-main'];

  const hero = {
    ...asRecord(heroBlock?.content),
    title: heroBlock?.title,
    subtitle: heroBlock?.subtitle,
  } as HeroContent;
  const about = {
    ...asRecord(aboutBlock?.content),
    title: aboutBlock?.title,
    subtitle: aboutBlock?.subtitle,
  } as AboutContent;
  const services = {
    ...asRecord(servicesBlock?.content),
    title: servicesBlock?.title,
    subtitle: servicesBlock?.subtitle,
  } as ServicesContent;
  const skills = {
    ...asRecord(skillsBlock?.content),
    title: skillsBlock?.title,
    subtitle: skillsBlock?.subtitle,
  } as SkillsContent;
  const experience = {
    ...asRecord(experienceBlock?.content),
    title: experienceBlock?.title,
    subtitle: experienceBlock?.subtitle,
  } as ExperienceContent;
  const architecture = {
    ...asRecord(architectureBlock?.content),
    title: architectureBlock?.title,
    subtitle: architectureBlock?.subtitle,
  } as ArchitectureContent;
  const testimonials = {
    ...asRecord(testimonialsBlock?.content),
    title: testimonialsBlock?.title,
    subtitle: testimonialsBlock?.subtitle,
  } as TestimonialsContent;
  const contact = {
    ...asRecord(contactBlock?.content),
    title: contactBlock?.title,
    subtitle: contactBlock?.subtitle,
  } as ContactContent;

  const mappedProjects = projects.map((project) => ({
    id: project.id,
    slug: project.slug,
    title: project.title,
    summary: project.summary,
    description: project.description,
    imageUrl: project.imageUrl,
    liveUrl: project.liveUrl,
    githubUrl: project.githubUrl,
    technologies: asStringArray(project.technologies),
  }));

  const platformLogos = systems.map((system) => ({
    name: system.name,
    slug: system.slug,
    logoUrl: system.logoUrl,
  }));

  return (
    <>
      <PremiumNavbar />
      <main className="min-h-screen pt-16 bg-zinc-950 text-zinc-50">
        <PremiumHero content={hero} />
        <PremiumAbout content={about} certificationsCount={certificates.length} />
        <PremiumServices content={services} />
        <PremiumProjects projects={mappedProjects} />
        <PlatformLogos items={platformLogos} />
        <PremiumSkills content={skills} />
        <PremiumExperience content={experience} />
        <PremiumArchitecture content={architecture} />
        <PremiumTestimonials content={testimonials} />
        <PremiumContact content={contact} />
      </main>
      <PremiumFooter />
    </>
  );
}
