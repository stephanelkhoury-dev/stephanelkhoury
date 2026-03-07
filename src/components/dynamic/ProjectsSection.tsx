import { Project } from '@prisma/client';

type ProjectsSectionProps = {
  projects: Project[];
};

export default function ProjectsSection({ projects }: ProjectsSectionProps) {
  return (
    <section id="projects" className="py-20 px-6 md:px-20">
      <h2 className="text-3xl font-bold mb-3">Projects</h2>
      {projects.length === 0 ? (
        <div className="rounded-xl border border-white/10 bg-white/5 p-8 text-gray-300">
          Projects are intentionally empty for now. Add projects later from the admin dashboard.
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => {
            const technologies = Array.isArray(project.technologies)
              ? (project.technologies as string[])
              : [];

            return (
              <article key={project.id} className="rounded-xl border border-white/10 bg-white/5 p-5">
                <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                <p className="text-gray-400 text-sm mb-3">{project.summary}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {technologies.map((tech) => (
                    <span key={tech} className="text-xs px-2 py-1 rounded-full bg-[#3b82f6]/20">
                      {tech}
                    </span>
                  ))}
                </div>
                <div className="flex gap-3 text-sm">
                  {project.githubUrl && (
                    <a href={project.githubUrl} target="_blank" rel="noreferrer" className="text-[#3b82f6]">
                      GitHub
                    </a>
                  )}
                  {project.liveUrl && (
                    <a href={project.liveUrl} target="_blank" rel="noreferrer" className="text-[#10b981]">
                      Live
                    </a>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
