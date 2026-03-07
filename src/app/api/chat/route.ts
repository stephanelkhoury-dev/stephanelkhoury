import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { prisma } from '@/lib/prisma';
import { getPublicContent } from '@/lib/bootstrap';

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

  const projectsList = content.projects
    .map((p: { title: string; description?: string; technologiesUsed?: string[] }) =>
      `- ${p.title}${p.description ? ': ' + p.description : ''}${p.technologiesUsed?.length ? ' [' + p.technologiesUsed.join(', ') + ']' : ''}`
    )
    .join('\n');

  const prompt = `You are the AI assistant for Stephan El Khoury's portfolio website.
Your job is to answer visitor questions clearly and honestly based on the profile data below.

## Rules
1. For project/work inquiries (e.g. "can you build X for me?", "can we collaborate on Y?", "do you do freelance?"):
   - Start with a clear YES or NO based on whether the request matches Stephan's tech stack (listed below).
   - Briefly explain WHY — mention the specific technologies from his stack that apply.
   - Then ALWAYS say: "To move forward, the next step is to book a consultation appointment. You can reach Stephan via email at multigraphic.lb@gmail.com, through the contact form at the bottom of this page, or by connecting on LinkedIn. In your message, briefly describe your project and he will get back to you to schedule a call."
2. For availability/rates questions: explain appointments are required to discuss project scope and pricing — direct them to multigraphic.lb@gmail.com.
3. For general questions, answer concisely from the profile data only.
4. Never make up information not in the data.
5. Keep answers friendly, professional, and to the point.

## Contact & Appointment Information
- Email (preferred): multigraphic.lb@gmail.com
- Contact form: bottom of this page (#contact section)
- LinkedIn: available via the social links on this site
- Process: visitor emails → Stephan reviews → schedules a discovery call

## Profile Blocks
${content.blocks
  .map((block: { title: string; content: unknown }) => `${block.title}: ${JSON.stringify(block.content)}`)
  .join('\n')}

## Current Projects
${projectsList}

## Supported Systems / Tech Stack
${systemsText}

## Certificates
${content.certificates
  .map((cert: { title: string; issuer: string; fileUrl: string }) => `${cert.title} (${cert.issuer}) -> ${cert.fileUrl}`)
  .join('\n')}

---
Visitor question: ${message}`;

  const ai = new GoogleGenAI({ apiKey });

  let answer = 'I could not generate a response right now.';
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: prompt,
    });
    answer = response.text || answer;
  } catch {
    answer =
      'I can share profile details, but the AI provider is temporarily unavailable. Please try again in a moment.';
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
  });
}
