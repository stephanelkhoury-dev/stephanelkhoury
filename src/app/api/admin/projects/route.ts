import { NextRequest, NextResponse } from 'next/server';
import { isAdminRequest } from '@/lib/admin-auth';
import { prisma } from '@/lib/prisma';
import { projectsPayloadSchema } from '@/lib/admin-schemas';

export const runtime = 'nodejs';

function configError() {
  return NextResponse.json(
    { error: 'DATABASE_URL is not configured. Add it in Vercel and .env.local.' },
    { status: 500 }
  );
}

export async function GET(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!process.env.DATABASE_URL) return configError();

  const projects = await prisma.project.findMany({ orderBy: { sortOrder: 'asc' } });
  return NextResponse.json({ projects });
}

export async function PUT(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!process.env.DATABASE_URL) return configError();

  const parsed = projectsPayloadSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid payload', issues: parsed.error.issues }, { status: 400 });
  }

  const { projects } = parsed.data;

  await prisma.project.deleteMany({});
  if (projects.length > 0) {
    await prisma.project.createMany({
      data: projects.map((project) => ({
        title: project.title,
        slug: project.slug,
        summary: project.summary,
        description: project.description,
        imageUrl: project.imageUrl ?? null,
        githubUrl: project.githubUrl ?? null,
        liveUrl: project.liveUrl ?? null,
        technologies: project.technologies,
        sortOrder: project.sortOrder,
        isActive: project.isActive,
      })),
    });
  }

  return NextResponse.json({ success: true });
}
