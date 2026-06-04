# Stash

A personal YouTube library. Sign in with Google and Stash imports all your liked videos, then lets you organize them by category, add notes, and build a watch-later queue — without fighting YouTube's algorithm.

**Live:** [stash-ten-lilac.vercel.app](https://stash-ten-lilac.vercel.app)

## Stack

- **Next.js 16** (App Router, React Server Components)
- **NextAuth v4** — Google OAuth with YouTube read-only scope
- **Prisma 5 + Neon** (serverless Postgres)
- **Tailwind CSS v4**
- **Groq** — AI-assisted video categorization
- **Resend** — transactional email
- **Vercel** — hosting

## Features

- Google sign-in with YouTube read-only OAuth
- One-click import of all liked videos from YouTube Data API
- AI auto-categorization of videos by title/channel (Groq)
- Filter, search, and browse by category
- Per-video notes and watch-later flag
- Dark mode
- In-app feedback form

## Data model

```
User → has many Videos, Accounts, Sessions
Video → youtubeId, title, channel, thumbnail, category, notes, watched, watchLater
Account → stores OAuth tokens (access_token, refresh_token)
```

## Local setup

```bash
cp .env.example .env          # fill in secrets
npm install
npx prisma migrate dev
npm run dev
```

Requires: `DATABASE_URL` (Postgres), `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `NEXTAUTH_SECRET`, `GROQ_API_KEY`, `RESEND_API_KEY`.

## Key files

```
lib/auth.ts          — NextAuth config, Google provider, session/signIn callbacks
lib/prisma.ts        — singleton PrismaClient
app/api/auth/        — NextAuth route handler (force-dynamic for Vercel)
app/api/import-videos/ — fetches liked videos from YouTube Data API, upserts to DB
app/api/recategorize/  — runs Groq categorization over stored videos
app/dashboard/       — main UI: VideoGrid, filters, import button
```
