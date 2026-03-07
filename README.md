# Stephan El Khoury - Dynamic Portfolio Platform

A fully dynamic, block-based portfolio platform built with Next.js App Router, Prisma, and PostgreSQL. Content is managed from an admin dashboard (no code edits needed for normal updates).

## 🚀 Features

- **Block-based content system**: Hero/About/Experience/Contact managed in DB
- **Dynamic projects**: DB-backed list (currently intentionally empty)
- **Supported systems showcase**: Clickable logos to detailed stack/platform pages
- **Admin dashboard**: JSON-powered CMS at `/admin`
- **Live chatbot**: Gemini-powered assistant trained from your live DB content
- **Chat persistence**: Every chat session/message saved and visible in admin
- **Vercel ready**: Uses environment variables and server APIs

## 🛠️ Technologies Used

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js Route Handlers
- **Database**: PostgreSQL + Prisma ORM
- **AI**: Gemini (`gemini-2.0-flash`) via `@google/genai`
- **Deployment**: Vercel

## Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/stephan-portfolio.git
   ```

2. Install dependencies:
   ```bash
   cd stephan-portfolio
   npm install
   ```

3. Set up environment variables:
   Create both `.env` and `.env.local` in the root directory (or copy `.env.example`) and add:
   ```env
   DATABASE_URL="postgresql://..."
   DATABASE_URL_UNPOOLED="postgresql://..."
   ADMIN_DASHBOARD_TOKEN="your-secure-token"
   GEMINI_API_KEY="your-gemini-key"
   ```

4. Generate Prisma client, push schema, and seed full dataset:
   ```bash
   npm run prisma:generate
   npm run prisma:push
   npm run prisma:seed
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3333](http://localhost:3333) in your browser.
7. Open `/admin`, paste `ADMIN_DASHBOARD_TOKEN`, then load/save content.

## Database Operations

- Seed data only:
   ```bash
   npm run prisma:seed
   ```
- Full destructive reset + reseed:
   ```bash
   npm run prisma:reset
   ```

## Full Documentation

- Detailed DB/Vercel/local runbook: [docs/DB-VERCEL-LOCAL-SETUP.md](docs/DB-VERCEL-LOCAL-SETUP.md)

## Project Structure

```
src/
   ├── app/
   │   ├── admin/                  # Admin dashboard
   │   ├── api/admin/content/      # Admin CRUD API
   │   ├── api/chat/               # Gemini chat API + persistence
   │   └── systems/[slug]/         # Supported system detail pages
   ├── components/dynamic/         # Block renderer + dynamic sections
   └── lib/                        # Prisma + bootstrap + auth
prisma/
   └── schema.prisma               # DB models
```

## Deployment

The site is automatically deployed through Vercel's Git integration. Every push to the main branch triggers a new deployment.

## Contributing

While this is my personal portfolio, if you find any bugs or have suggestions for improvements, feel free to open an issue or submit a pull request.

## License

MIT © Stephan El Khoury
