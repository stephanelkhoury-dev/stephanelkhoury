'use client';

import { useEffect, useMemo, useState } from 'react';
import type { ProjectInput } from '@/lib/admin-types';

const emptyProject = (): ProjectInput => ({
  title: '',
  slug: '',
  summary: '',
  description: '',
  imageUrl: '',
  githubUrl: '',
  liveUrl: '',
  technologies: [],
  sortOrder: 0,
  isActive: true,
});

export default function ProjectsEditor() {
  const [projects, setProjects] = useState<ProjectInput[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const sortedProjects = useMemo(
    () => [...projects].sort((a, b) => a.sortOrder - b.sortOrder),
    [projects]
  );

  const load = async () => {
    setMessage('');
    const response = await fetch('/api/admin/projects', { cache: 'no-store' });
    const data = await response.json();

    if (!response.ok) {
      setMessage(data.error || 'Failed to auto-load projects');
      setLoading(false);
      return;
    }

    setProjects(data.projects || []);
    setLoading(false);
  };

  useEffect(() => {
    void load();
  }, []);

  const updateProject = <K extends keyof ProjectInput>(index: number, key: K, value: ProjectInput[K]) => {
    setProjects((current) => current.map((item, i) => (i === index ? { ...item, [key]: value } : item)));
  };

  const addProject = () => {
    setProjects((current) => [...current, { ...emptyProject(), sortOrder: current.length + 1 }]);
  };

  const removeProject = (index: number) => {
    setProjects((current) => current.filter((_, i) => i !== index));
  };

  const save = async () => {
    setSaving(true);
    setMessage('');
    try {
      const response = await fetch('/api/admin/projects', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projects }),
      });
      const data = await response.json();
      if (!response.ok) {
        setMessage(data.error || 'Failed to save projects');
        return;
      }
      setMessage('Projects saved successfully.');
      await load();
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-gray-300">Auto-loading projects from PostgreSQL...</div>;
  }

  return (
    <section className="space-y-6">
      <header className="flex flex-wrap gap-3 items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold mb-1 tracking-tight">Projects CMS</h1>
          <p className="text-slate-400">Auto-loaded from Neon PostgreSQL. Edit cards, links, and images directly.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={addProject} className="px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 hover:bg-slate-700">
            Add Project
          </button>
          <button
            onClick={() => void save()}
            disabled={saving}
            className="px-4 py-2 rounded-lg bg-slate-200 text-slate-900 font-medium hover:bg-white disabled:opacity-60"
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </header>

      {message && <p className="text-sm text-slate-300">{message}</p>}

      <div className="space-y-4">
        {sortedProjects.map((project, index) => (
          <article key={`${project.slug}-${index}`} className="rounded-xl border border-slate-700 bg-[#0f172a] p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">Project #{index + 1}</h2>
              <button onClick={() => removeProject(index)} className="text-sm px-2 py-1 rounded bg-red-500/20 border border-red-400/30">
                Remove
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-3">
              <Input label="Title" value={project.title} onChange={(v) => updateProject(index, 'title', v)} />
              <Input label="Slug" value={project.slug} onChange={(v) => updateProject(index, 'slug', v)} />
              <Input label="Image URL" value={project.imageUrl || ''} onChange={(v) => updateProject(index, 'imageUrl', v)} />
              <Input label="GitHub URL" value={project.githubUrl || ''} onChange={(v) => updateProject(index, 'githubUrl', v)} />
              <Input label="Live URL" value={project.liveUrl || ''} onChange={(v) => updateProject(index, 'liveUrl', v)} />
              <Input
                label="Sort Order"
                value={String(project.sortOrder)}
                onChange={(v) => updateProject(index, 'sortOrder', Number(v) || 0)}
              />
              <TextArea label="Summary" value={project.summary} onChange={(v) => updateProject(index, 'summary', v)} />
              <TextArea
                label="Description"
                value={project.description}
                onChange={(v) => updateProject(index, 'description', v)}
              />
              <TextArea
                label="Technologies (comma-separated)"
                value={project.technologies.join(', ')}
                onChange={(v) =>
                  updateProject(
                    index,
                    'technologies',
                    v
                      .split(',')
                      .map((item) => item.trim())
                      .filter(Boolean)
                  )
                }
              />
            </div>

            <label className="inline-flex gap-2 text-sm text-gray-300 items-center">
              <input
                type="checkbox"
                checked={project.isActive}
                onChange={(event) => updateProject(index, 'isActive', event.target.checked)}
              />
              Active
            </label>
          </article>
        ))}
      </div>
    </section>
  );
}

function Input({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="block">
      <span className="text-xs text-slate-400">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full mt-1 rounded-lg px-3 py-2 bg-[#020617] border border-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500"
      />
    </label>
  );
}

function TextArea({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="block md:col-span-2">
      <span className="text-xs text-slate-400">{label}</span>
      <textarea
        rows={3}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full mt-1 rounded-lg px-3 py-2 bg-[#020617] border border-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500"
      />
    </label>
  );
}
