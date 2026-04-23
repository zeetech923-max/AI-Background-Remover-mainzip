# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Admin Panel (BGRemover AI)

- Visit `/admin` on the published site to log in.
- Default password: `admin123` (set the `ADMIN_PASSWORD` environment variable to change it).
- Manages: blog posts (CRUD + publish toggle), image gallery, and site settings (hero text, etc.).
- Backed by Postgres via Drizzle ORM in the `api-server` artifact. Schema lives in `lib/db/src/schema/index.ts`.
- API routes under `/api`: `auth`, `posts`, `gallery`, `settings`. Admin routes are gated by an HMAC-signed cookie (`bgr_admin`).
- Public Articles page (`/articles`) and post page (`/articles/:slug`) read published posts from the database.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.
