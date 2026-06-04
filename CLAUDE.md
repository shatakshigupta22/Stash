# Stash — Claude Code context

## What this is

Stash is a personal YouTube library. Users sign in with Google (YouTube read-only OAuth), import their liked videos, and organize them with categories, notes, and a watch-later queue. It's a single-user-per-account app — no social features, no sharing.

## Stack

- Next.js 16 App Router (RSC + Server Actions where appropriate)
- NextAuth v4 with PrismaAdapter — database sessions, not JWT
- Prisma 5 + Neon (serverless Postgres over `DATABASE_URL`)
- Tailwind CSS v4
- Groq SDK for AI categorization
- Resend for email

## Auth flow

1. User hits `/api/auth/signin` → Google OAuth consent (requests `youtube.readonly` scope)
2. NextAuth stores the session in the `Session` table and the OAuth tokens in the `Account` table
3. The `signIn` callback also copies `access_token` onto the `User` row for easy lookup
4. The `session` callback exposes `user.id` and `user.accessToken` to the client

The `[...nextauth]` route must be `force-dynamic` — it uses PrismaAdapter which can't be statically analyzed at build time.

## Data flow: video import

`POST /api/import-videos` → reads `user.accessToken` → pages through YouTube Data API (`myRating=like`) → upserts into `Video` table keyed on `(youtubeId, userId)`. The upsert means re-importing is safe and idempotent.

## Schema constraints to know

- `Video` has a `@@unique([youtubeId, userId])` — one row per video per user, no duplicates on re-import
- `User.accessToken` is a denormalized copy from `Account.access_token` — kept in sync in the `signIn` callback, not via a join
- All relations use `onDelete: Cascade` so deleting a user cleans up everything

## What to be careful about

- **Never** modify the OAuth scopes in `lib/auth.ts` without updating the Google Cloud Console authorized scopes — scope mismatches cause silent auth failures
- The `DATABASE_URL` must include `?sslmode=require` for Neon
- Prisma binary targets include `rhel-openssl-3.0.x` and `linux-musl-openssl-3.0.x` for Vercel — don't remove them
- `NEXTAUTH_URL` in production must match the exact Vercel deployment URL or Google will reject the redirect

## Commands

```bash
npm run dev          # start dev server (localhost:3000)
npm run build        # prisma generate + next build
npx prisma studio    # browse the database
npx prisma migrate dev --name <name>   # create a migration
```

## Conventions

- Server components fetch data directly via `prisma` — no API layer for reads
- API routes are only used for mutations (import, recategorize, feedback) and auth
- Tailwind only — no CSS modules or styled-components
- All pages under `app/dashboard/` assume an authenticated session (redirect to `/` if not)
