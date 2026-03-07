'use client';

import { useEffect, useMemo, useState } from 'react';
import type { ContentBlockInput } from '@/lib/admin-types';
import {
  getDefaultMultigraphicPage,
  MULTIGRAPHIC_BLOCK_TYPES,
  normalizeMultigraphicPage,
  serializeMultigraphicPage,
  type MultigraphicBlock,
  type MultigraphicPageContent,
} from '@/lib/multigraphic-page';
import MultigraphicPageRenderer from '@/components/multigraphic/MultigraphicPageRenderer';
import ImageUploaderField from '@/components/admin/ImageUploaderField';

const IMAGE_KEY_REGEX = /(image|logo|avatar|photo|cover)/i;

function pretty(value: unknown) {
  return JSON.stringify(value, null, 2);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === 'object' && !Array.isArray(value);
}

function collectImagePaths(value: unknown, base = ''): string[] {
  if (Array.isArray(value)) {
    return value.flatMap((item, index) => collectImagePaths(item, `${base}[${index}]`));
  }

  if (!isRecord(value)) return [];

  return Object.entries(value).flatMap(([key, nested]) => {
    const path = base ? `${base}.${key}` : key;
    const own = IMAGE_KEY_REGEX.test(key) && typeof nested === 'string' ? [path] : [];
    return [...own, ...collectImagePaths(nested, path)];
  });
}

function getByPath(root: Record<string, unknown>, path: string): unknown {
  const tokens = path.replace(/\[(\d+)\]/g, '.$1').split('.').filter(Boolean);
  let current: unknown = root;
  for (const token of tokens) {
    if (Array.isArray(current)) {
      current = current[Number(token)];
      continue;
    }
    if (!isRecord(current)) return undefined;
    current = current[token];
  }
  return current;
}

function setByPath(root: Record<string, unknown>, path: string, value: unknown): Record<string, unknown> {
  const clone = JSON.parse(JSON.stringify(root || {})) as Record<string, unknown>;
  const tokens = path.replace(/\[(\d+)\]/g, '.$1').split('.').filter(Boolean);
  let current: unknown = clone;

  for (let index = 0; index < tokens.length; index += 1) {
    const token = tokens[index];
    const isLast = index === tokens.length - 1;
    const nextToken = tokens[index + 1];
    const nextIsArrayIndex = /^\d+$/.test(nextToken || '');

    if (Array.isArray(current)) {
      const targetIndex = Number(token);
      if (isLast) {
        current[targetIndex] = value;
        break;
      }

      if (current[targetIndex] == null) {
        current[targetIndex] = nextIsArrayIndex ? [] : {};
      }
      current = current[targetIndex];
      continue;
    }

    if (!isRecord(current)) break;

    if (isLast) {
      current[token] = value;
      break;
    }

    if (current[token] == null) {
      current[token] = nextIsArrayIndex ? [] : {};
    }
    current = current[token];
  }

  return clone;
}

export default function MultigraphicBuilder() {
  const [blocks, setBlocks] = useState<ContentBlockInput[]>([]);
  const [page, setPage] = useState<MultigraphicPageContent>(getDefaultMultigraphicPage());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState('');
  const [jsonErrors, setJsonErrors] = useState<Record<string, string>>({});

  const multigraphicIndex = useMemo(() => blocks.findIndex((item) => item.slug === 'multigraphic-main'), [blocks]);

  const load = async () => {
    setStatus('');
    const response = await fetch('/api/admin/blocks', { cache: 'no-store' });
    const data = await response.json();

    if (!response.ok) {
      setStatus(data.error || 'Failed to load blocks');
      setLoading(false);
      return;
    }

    const loadedBlocks = (data.blocks || []) as ContentBlockInput[];
    setBlocks(loadedBlocks);

    const multigraphicBlock = loadedBlocks.find((item) => item.slug === 'multigraphic-main');
    setPage(normalizeMultigraphicPage(multigraphicBlock?.content || {}));
    setLoading(false);
  };

  useEffect(() => {
    void load();
  }, []);

  const updateBranding = (key: keyof MultigraphicPageContent['branding'], value: string) => {
    setPage((current) => ({ ...current, branding: { ...current.branding, [key]: value } }));
  };

  const updatePrimaryAction = (key: keyof MultigraphicPageContent['primaryAction'], value: string) => {
    setPage((current) => ({ ...current, primaryAction: { ...current.primaryAction, [key]: value } }));
  };

  const updateFooter = (key: keyof MultigraphicPageContent['footer'], value: string) => {
    setPage((current) => ({ ...current, footer: { ...current.footer, [key]: value } }));
  };

  const updateNavItem = (index: number, key: 'label' | 'anchor', value: string) => {
    setPage((current) => ({
      ...current,
      nav: current.nav.map((item, itemIndex) => (itemIndex === index ? { ...item, [key]: value } : item)),
    }));
  };

  const addNavItem = () => {
    setPage((current) => ({ ...current, nav: [...current.nav, { label: 'New Link', anchor: 'new-section' }] }));
  };

  const removeNavItem = (index: number) => {
    setPage((current) => ({ ...current, nav: current.nav.filter((_, itemIndex) => itemIndex !== index) }));
  };

  const updateFooterLink = (index: number, key: 'label' | 'anchor', value: string) => {
    setPage((current) => ({
      ...current,
      footer: {
        ...current.footer,
        links: current.footer.links.map((item, itemIndex) => (itemIndex === index ? { ...item, [key]: value } : item)),
      },
    }));
  };

  const addFooterLink = () => {
    setPage((current) => ({
      ...current,
      footer: { ...current.footer, links: [...current.footer.links, { label: 'New Link', anchor: 'new-section' }] },
    }));
  };

  const removeFooterLink = (index: number) => {
    setPage((current) => ({
      ...current,
      footer: { ...current.footer, links: current.footer.links.filter((_, itemIndex) => itemIndex !== index) },
    }));
  };

  const updateBlockMeta = (index: number, key: 'id' | 'anchor', value: string) => {
    setPage((current) => ({
      ...current,
      blocks: current.blocks.map((block, blockIndex) => (blockIndex === index ? { ...block, [key]: value } : block)),
    }));
  };

  const updateBlockType = (index: number, value: string) => {
    setPage((current) => ({
      ...current,
      blocks: current.blocks.map((block, blockIndex) =>
        blockIndex === index ? { ...block, type: value as MultigraphicBlock['type'] } : block
      ),
    }));
  };

  const toggleBlock = (index: number, enabled: boolean) => {
    setPage((current) => ({
      ...current,
      blocks: current.blocks.map((block, blockIndex) => (blockIndex === index ? { ...block, enabled } : block)),
    }));
  };

  const updateBlockContentFromJSON = (index: number, value: string) => {
    try {
      const parsed = JSON.parse(value) as Record<string, unknown>;
      setJsonErrors((current) => {
        const next = { ...current };
        delete next[String(index)];
        return next;
      });
      setPage((current) => ({
        ...current,
        blocks: current.blocks.map((block, blockIndex) => (blockIndex === index ? { ...block, content: parsed } : block)),
      }));
    } catch {
      setJsonErrors((current) => ({ ...current, [String(index)]: 'Invalid JSON. Fix syntax to apply.' }));
    }
  };

  const updateBlockImagePath = (blockIndex: number, path: string, imageUrl: string) => {
    setPage((current) => ({
      ...current,
      blocks: current.blocks.map((block, index) => {
        if (index !== blockIndex) return block;
        const nextContent = setByPath(block.content, path, imageUrl);
        return { ...block, content: nextContent };
      }),
    }));
  };

  const moveBlock = (index: number, direction: 'up' | 'down') => {
    setPage((current) => {
      const blocksCopy = [...current.blocks];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= blocksCopy.length) return current;
      const [item] = blocksCopy.splice(index, 1);
      blocksCopy.splice(targetIndex, 0, item);
      return { ...current, blocks: blocksCopy };
    });
  };

  const removeBlock = (index: number) => {
    setPage((current) => ({ ...current, blocks: current.blocks.filter((_, blockIndex) => blockIndex !== index) }));
  };

  const addBlock = (type: MultigraphicBlock['type']) => {
    setPage((current) => ({
      ...current,
      blocks: [
        ...current.blocks,
        {
          id: `${type}-${current.blocks.length + 1}`,
          type,
          anchor: type,
          enabled: true,
          content: {},
        },
      ],
    }));
  };

  const save = async () => {
    if (multigraphicIndex === -1) {
      setStatus('multigraphic-main block not found.');
      return;
    }

    if (Object.keys(jsonErrors).length > 0) {
      setStatus('Fix JSON errors before saving.');
      return;
    }

    setSaving(true);
    setStatus('');

    try {
      const updatedBlocks = blocks.map((block, index) =>
        index === multigraphicIndex
          ? {
              ...block,
              title: page.branding.subtitle || block.title,
              subtitle: page.branding.name || block.subtitle,
              content: serializeMultigraphicPage(page),
            }
          : block
      );

      const response = await fetch('/api/admin/blocks', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ blocks: updatedBlocks }),
      });

      const data = await response.json();
      if (!response.ok) {
        setStatus(data.error || 'Failed to save Multigraphic page');
        return;
      }

      setBlocks(updatedBlocks);
      setStatus('Multigraphic page saved. Live page and preview now match the CMS payload.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p className="text-slate-300">Loading Multigraphic builder...</p>;
  }

  return (
    <section className="space-y-5">
      <header>
        <h1 className="text-2xl font-semibold mb-2 tracking-tight">Multigraphic Page Builder</h1>
        <p className="text-slate-400">
          Block-based CMS editor with live preview. Add, reorder, and edit blocks with upload-enabled image fields.
        </p>
      </header>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => void save()}
          disabled={saving}
          className="px-4 py-2 rounded-lg bg-slate-200 text-slate-900 font-medium hover:bg-white disabled:opacity-60"
        >
          {saving ? 'Saving...' : 'Save Multigraphic Page'}
        </button>
        <a
          href="/multigraphiclb"
          target="_blank"
          rel="noreferrer"
          className="px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 hover:bg-slate-700"
        >
          Open Live Page
        </a>
      </div>

      {status && <p className="text-sm text-slate-300">{status}</p>}

      <div className="grid xl:grid-cols-[1.1fr_1fr] gap-5 items-start">
        <div className="space-y-5">
          <EditorCard title="Branding & Header">
            <ImageUploaderField
              label="Brand Logo (also used as symbol)"
              value={page.branding.logoUrl}
              onChange={(value) => updateBranding('logoUrl', value)}
              helperText="Drag-drop or upload your Multigraphic logo."
            />
            <Input label="Brand Name" value={page.branding.name} onChange={(value) => updateBranding('name', value)} />
            <Input label="Brand Subtitle" value={page.branding.subtitle} onChange={(value) => updateBranding('subtitle', value)} />
            <Input label="Fallback Symbol Text" value={page.branding.symbol} onChange={(value) => updateBranding('symbol', value)} />
            <Input label="Primary Action Label" value={page.primaryAction.label} onChange={(value) => updatePrimaryAction('label', value)} />
            <Input label="Primary Action Href" value={page.primaryAction.href} onChange={(value) => updatePrimaryAction('href', value)} />
          </EditorCard>

          <EditorCard title="Navigation">
            {page.nav.map((item, index) => (
              <div key={`nav-${index}`} className="grid grid-cols-[1fr_1fr_auto] gap-2">
                <Input label={`Nav ${index + 1} Label`} value={item.label} onChange={(value) => updateNavItem(index, 'label', value)} />
                <Input label="Anchor" value={item.anchor} onChange={(value) => updateNavItem(index, 'anchor', value)} />
                <button onClick={() => removeNavItem(index)} className="self-end px-3 py-2 rounded-lg border border-slate-700 text-xs hover:bg-slate-800">Remove</button>
              </div>
            ))}
            <button onClick={addNavItem} className="px-3 py-2 rounded-lg border border-slate-700 text-xs hover:bg-slate-800">Add Nav Item</button>
          </EditorCard>

          <EditorCard title="Page Blocks">
            <div className="flex flex-wrap gap-2 mb-3">
              {MULTIGRAPHIC_BLOCK_TYPES.map((type) => (
                <button
                  key={type}
                  onClick={() => addBlock(type)}
                  className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-700 hover:bg-slate-800"
                >
                  Add {type}
                </button>
              ))}
            </div>

            <div className="space-y-3">
              {page.blocks.map((block, index) => {
                const imagePaths = collectImagePaths(block.content);
                return (
                  <div key={`${block.id}-${index}`} className="rounded-lg border border-slate-700/80 bg-[#020617] p-3 space-y-3">
                    <div className="grid md:grid-cols-2 gap-2">
                      <Input label="Block ID" value={block.id} onChange={(value) => updateBlockMeta(index, 'id', value)} />
                      <Input label="Anchor" value={block.anchor} onChange={(value) => updateBlockMeta(index, 'anchor', value)} />
                    </div>

                    <div className="grid md:grid-cols-[1fr_auto] gap-2 items-end">
                      <label className="block">
                        <span className="text-sm text-slate-300">Type</span>
                        <select
                          value={block.type}
                          onChange={(event) => updateBlockType(index, event.target.value)}
                          className="w-full mt-1 rounded-lg px-3 py-2 bg-[#020617] border border-slate-700"
                        >
                          {MULTIGRAPHIC_BLOCK_TYPES.map((type) => (
                            <option key={type} value={type}>{type}</option>
                          ))}
                        </select>
                      </label>
                      <label className="flex items-center gap-2 text-xs text-slate-300">
                        <input type="checkbox" checked={block.enabled} onChange={(event) => toggleBlock(index, event.target.checked)} />
                        enabled
                      </label>
                    </div>

                    {imagePaths.length > 0 && (
                      <div className="rounded-lg border border-slate-700/80 bg-slate-900/30 p-3 space-y-3">
                        <p className="text-xs uppercase tracking-wider text-slate-400">Image fields</p>
                        {imagePaths.map((path) => (
                          <ImageUploaderField
                            key={`${block.id}-${path}`}
                            label={path}
                            value={String(getByPath(block.content, path) || '')}
                            onChange={(url) => updateBlockImagePath(index, path, url)}
                          />
                        ))}
                      </div>
                    )}

                    <label className="block">
                      <span className="text-sm text-slate-300">Block Content JSON</span>
                      <textarea
                        rows={10}
                        value={pretty(block.content)}
                        onChange={(event) => updateBlockContentFromJSON(index, event.target.value)}
                        className="w-full mt-1 rounded-lg bg-[#020617] border border-slate-700 p-2 font-mono text-xs"
                      />
                    </label>

                    {jsonErrors[String(index)] && <p className="text-xs text-rose-300">{jsonErrors[String(index)]}</p>}

                    <div className="flex flex-wrap gap-2">
                      <button onClick={() => moveBlock(index, 'up')} className="px-2.5 py-1 text-xs rounded border border-slate-700 hover:bg-slate-800">Up</button>
                      <button onClick={() => moveBlock(index, 'down')} className="px-2.5 py-1 text-xs rounded border border-slate-700 hover:bg-slate-800">Down</button>
                      <button onClick={() => removeBlock(index)} className="px-2.5 py-1 text-xs rounded border border-rose-700/70 text-rose-300 hover:bg-rose-900/20">Delete</button>
                    </div>
                  </div>
                );
              })}
            </div>
          </EditorCard>

          <EditorCard title="Footer">
            <Input label="Footer Brand Top" value={page.footer.brandTop} onChange={(value) => updateFooter('brandTop', value)} />
            <Input label="Footer Brand Bottom" value={page.footer.brandBottom} onChange={(value) => updateFooter('brandBottom', value)} />
            <Input label="Copyright" value={page.footer.copyright} onChange={(value) => updateFooter('copyright', value)} />

            {page.footer.links.map((item, index) => (
              <div key={`footer-link-${index}`} className="grid grid-cols-[1fr_1fr_auto] gap-2">
                <Input label={`Footer Link ${index + 1}`} value={item.label} onChange={(value) => updateFooterLink(index, 'label', value)} />
                <Input label="Anchor" value={item.anchor} onChange={(value) => updateFooterLink(index, 'anchor', value)} />
                <button onClick={() => removeFooterLink(index)} className="self-end px-3 py-2 rounded-lg border border-slate-700 text-xs hover:bg-slate-800">Remove</button>
              </div>
            ))}
            <button onClick={addFooterLink} className="px-3 py-2 rounded-lg border border-slate-700 text-xs hover:bg-slate-800">Add Footer Link</button>
          </EditorCard>
        </div>

        <div className="rounded-xl border border-slate-700 bg-[#020617] overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-700 flex items-center justify-between">
            <h2 className="font-medium text-sm">Live Preview</h2>
            <span className="text-xs text-slate-400">Updates as you edit</span>
          </div>
          <div className="h-[80vh] overflow-auto">
            <MultigraphicPageRenderer page={page} />
          </div>
        </div>
      </div>
    </section>
  );
}

function EditorCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-slate-700 bg-[#0f172a] p-4 space-y-3">
      <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
      {children}
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-sm text-slate-300">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full mt-1 rounded-lg px-3 py-2 bg-[#020617] border border-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500"
      />
    </label>
  );
}
