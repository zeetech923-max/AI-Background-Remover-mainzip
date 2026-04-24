# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Admin Panel (BGRemover AI)

WordPress-style CMS at `/admin`. Default password `admin123` (override with `ADMIN_PASSWORD` env var).

Tabs:
- **Overview** — stat cards (total/published/draft posts, media count) + recent posts list.
- **Posts** — WordPress-style WYSIWYG editor (TipTap/ProseMirror) with full toolbar: bold/italic/underline/strike/inline code, H1–H3, bullet/ordered/quote/code-block, alignment (left/center/right), link with prompt, image insert (uses media gallery picker), undo/redo/clear, plus a Visual ↔ HTML source toggle. Title, slug (auto-generated), excerpt (300 char counter), featured image (gallery picker or URL), category, tags, draft/publish toggle. Search filter on the list. Component lives at `src/components/RichTextEditor.tsx`; content stored as HTML and rendered via `dangerouslySetInnerHTML` on the public article page.
- **Per-post Meta Tags / SEO panel** — Yoast-style. Focus keyword with live checks (in title / description / slug / content + word count + density), meta title (color-graded 40–60 sweet spot, max 70), meta description (120–158 sweet spot, max 160), meta keywords, canonical URL override, author. Live Google SERP preview rendering the actual blue title, URL crumb, and grey snippet. Separate Open Graph block (OG title, OG description, OG image with 1.91:1 social card preview) and Twitter/X block (twitter title, twitter description). Robots block: `noindex` and `nofollow` toggles. Fields persisted on the post; rendered into the public page `<head>` by `src/components/Seo.tsx` (description, keywords, robots, author, canonical, og:*, article:published_time/modified_time/author, twitter:card/title/description/image/site/creator).
- **Media** — upload (multi), preview grid, copy URL, delete. Shared image picker dialog reused inside the post editor.
- **SEO** — site-wide: site name, title template (`%s | Site`), default title/description/keywords, default OG image, Twitter handle, Google Search Console verification, GA Measurement ID, "block all search engines" toggle. Plus links to live `/api/sitemap.xml` and `/api/robots.txt`.
- **Settings** — hero copy, tagline, contact email.

Backed by Postgres via Drizzle ORM in the `api-server` artifact. Schema in `lib/db/src/schema/index.ts` (postsTable now includes category, tags, metaTitle, metaDescription, metaKeywords, ogImageUrl, noindex). API routes under `/api`: `auth`, `posts`, `gallery`, `settings`, `sitemap.xml`, `robots.txt`. Admin routes are gated by an HMAC-signed cookie (`bgr_admin`).

Public pages use `<Seo>` (`src/components/Seo.tsx`) to inject `<title>`, description, keywords, canonical, Open Graph and Twitter Card meta tags. Site-wide settings are read via the cached `useSiteSeo` hook (`src/hooks/useSiteSeo.ts`). Sitemap auto-includes static routes plus every published, non-noindex post.

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
