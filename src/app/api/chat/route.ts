import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { prisma } from '@/lib/prisma';
import { getPublicContent } from '@/lib/bootstrap';
import { featuredProjectCopy, featuredProjectSlugs } from '@/lib/featured-projects';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json(
      { error: 'DATABASE_URL is not configured. Add it in Vercel and .env.local.' },
      { status: 500 }
    );
  }

  const body = await request.json();
  const message = String(body.message || '').trim();
  const sessionId = body.sessionId ? String(body.sessionId) : null;
  const visitorId = String(body.visitorId || 'anonymous');

  if (!message) {
    return NextResponse.json({ error: 'Message is required' }, { status: 400 });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: 'Gemini API key is missing. Add GEMINI_API_KEY in Vercel env vars.' },
      { status: 500 }
    );
  }

  const [content, chatSession] = await Promise.all([
    getPublicContent(),
    sessionId
      ? prisma.chatSession.findUnique({ where: { id: sessionId } })
      : prisma.chatSession.create({
          data: {
            visitorId,
            title: 'Website visitor chat',
          },
        }),
  ]);

  const actualSession = chatSession;
  if (!actualSession) {
    return NextResponse.json({ error: 'Chat session not found' }, { status: 404 });
  }

  await prisma.chatMessage.create({
    data: {
      sessionId: actualSession.id,
      role: 'user',
      content: message,
    },
  });

  const systemsText = content.systems
    .map((system: { name: string; experience: string }) => `${system.name}: ${system.experience}`)
    .join('\n');

  const contactBlock = content.blocks.find((block) => block.slug === 'contact-main');
  const contactDetails = contactBlock?.content as { email?: string } | undefined;
  const contactEmail = contactDetails?.email || 'stephanelkhoury2000@gmail.com';

  const projectsList = content.projects
    .filter((project) => featuredProjectSlugs.has(project.slug) && Boolean(project.liveUrl))
    .map((project) => `- ${project.title}: ${featuredProjectCopy[project.slug].description}`)
    .join('\n');
  const profileBlockSlugs = new Set(['experience-main', 'skills-main', 'contact-main']);
  const profileBlocks = content.blocks
    .filter((block) => profileBlockSlugs.has(block.slug))
    .map((block) => `${block.title}: ${JSON.stringify(block.content)}`)
    .join('\n');

  const prompt = `You are the AI assistant for Stephan El Khoury's portfolio website.
Your job is to answer visitor questions clearly and honestly based on the profile data below.

## Rules
1. For project/work inquiries (e.g. "can you build X for me?", "can we collaborate on Y?", "do you do freelance?"):
   - Start with a clear YES or NO based on whether the request matches Stephan's tech stack (listed below).
   - Briefly explain WHY — mention the specific technologies from his stack that apply.
  - Then direct the visitor to the contact section or email at ${contactEmail} to discuss next steps.
2. For availability/rates questions: explain that current availability and pricing should be discussed directly, and provide ${contactEmail}.
3. For general questions, answer concisely from the profile data only.
4. Never make up information not in the data.
5. Keep answers friendly, professional, and to the point.
6. Reply in plain text without Markdown markers or formatting.

## Contact & Appointment Information
- Email (preferred): ${contactEmail}
- Contact form: bottom of this page (#contact section), which opens an email draft
- LinkedIn: available via the social links on this site
- Next steps and scheduling are discussed directly by email.

## Profile Blocks
${profileBlocks}

## Current Projects
${projectsList}

## Supported Systems / Tech Stack
${systemsText}

---
Visitor question: ${message}`;

  const ai = new GoogleGenAI({ apiKey });

  const MODELS = ['gemini-3.8-flash', 'gemini-flash-latest', 'gemini-3.1-flash-lite'];
  let answer = '';
  let degraded = false;

  for (const model of MODELS) {
    try {
      const response = await ai.models.generateContent({ model, contents: prompt });
      answer = response.text || '';
      if (answer) break;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error(`[chat] model ${model} failed:`, msg);
      const shouldTryFallback =
        msg.includes('429') ||
        msg.includes('quota') ||
        msg.includes('503') ||
        msg.includes('overloaded') ||
        msg.includes('404') ||
        msg.includes('NOT_FOUND');
      if (!shouldTryFallback) break;
    }
  }

  if (!answer) {
    degraded = true;
    answer = `The AI assistant is temporarily unavailable. You can reach Stephan directly at ${contactEmail} or use the contact form below.`;
  }

  await prisma.chatMessage.create({
    data: {
      sessionId: actualSession.id,
      role: 'assistant',
      content: answer,
    },
  });

  return NextResponse.json({
    sessionId: actualSession.id,
    answer,
    degraded,
  });
}
