# Web Article — Editorial Publishing Platform

> Platform publikasi artikel bergaya editorial, content-first — dibangun dengan TanStack Start, React 19, dan Tailwind CSS v4.

[![React](https://img.shields.io/badge/React-19-149ECA?logo=react&logoColor=white)](https://react.dev)
[![TanStack Start](https://img.shields.io/badge/TanStack-Start-FF4154?logo=react)](https://tanstack.com/start)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38BDF8?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Drizzle ORM](https://img.shields.io/badge/Drizzle-ORM-C5F277?logo=drizzle&logoColor=black)](https://orm.drizzle.team)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)

## Overview

Web Article adalah aplikasi web untuk menulis, mempublikasikan, dan membaca artikel dengan pengalaman membaca editorial yang tenang dan fokus pada tipografi. Proyek ini mengutamakan hierarki konten, performa SSR, dan type-safety end-to-end.

**Prinsip desain:** editorial clarity over decoration — terinspirasi Medium dengan layout tiga zona, palet netral, dan aksen yang restrained. Detail lengkap ada di [`DESIGN.md`](./DESIGN.md).

## Features

- **Editorial Reading Experience** — Layout 3 zona (Sidebar · Feed · Discovery Rail), tipografi serif untuk brand/headline dan sans-serif untuk body/metadata
- **SSR & File-based Routing** — TanStack Start + TanStack Router dengan route tree generation otomatis
- **Type-safe Data Layer** — TanStack Query dengan SSR hydration via `@tanstack/react-router-ssr-query`
- **Relational Content Model** — `users` → `blogs` → `comments` (nested replies) + `likes` + `saves` (bookmarks), lihat [`DATABASE.md`](./DATABASE.md)
- **Database Tooling** — Drizzle ORM (`mysql2`) + Drizzle Kit untuk migrasi dan studio
- **MCP Ready** — Endpoint Model Context Protocol di `src/routes/mcp.ts`
- **Design System** — Tailwind CSS v4 (`@theme inline`), `@tailwindcss/typography`, token warna di `src/styles.css`

## Tech Stack

| Layer        | Technology                                           |
| ------------ | ---------------------------------------------------- |
| Framework    | TanStack Start (Vite 8, Nitro adapter), React 19     |
| Routing      | TanStack Router (file-based, `src/routes/`)          |
| State / Data | TanStack Query + SSR hydration                       |
| Styling      | Tailwind CSS v4, `tw-animate-css`, Lucide Icons      |
| Database     | Drizzle ORM, `mysql2`, Drizzle Kit                   |
| Validation   | Zod                                                  |
| Tooling      | TypeScript, ESLint (TanStack config), Prettier, Vite |
| MCP          | `@modelcontextprotocol/sdk`                          |

## Project Structure

```
src/
  components/   # Header, Sidebar, ArticleListItem, DiscoveryRail, dsb.
  db/           # Drizzle client (index.ts) & schema (schema.ts)
  integrations/ # TanStack Query provider & devtools
  lib/          # Utilities (cn, dsb.)
  routes/       # File-based routes (__root.tsx, index.tsx, mcp.ts, ...)
  styles.css    # Tailwind v4 @theme inline & global tokens
  router.tsx    # Router setup
  routeTree.gen.ts # Generated — jangan edit manual

docs/
  DESIGN.md     # Editorial design system
  DATABASE.md   # ERD, tabel, dan relasi
  AGENTS.md     # Panduan arsitektur & operasional untuk agen/dev
```

Path alias: `#/*` dan `@/*` → `./src/*` (contoh: `#/components/ui/button`).

## Getting Started

### Prerequisites

- Node.js 20+ dan npm/pnpm
- MySQL 8+ (atau kompatibel) dan `DATABASE_URL`

### Installation

```bash
npm install
cp .env.example .env.local  # jika tersedia, atau buat manual
npm run dev                 # http://localhost:3000
```

### Environment Variables

Buat `.env` atau `.env.local`:

```env
DATABASE_URL=mysql://user:password@localhost:3306/web_article
```

> Format: `mysql://user:pass@host:port/dbname` — wajib untuk Drizzle. Lihat `AGENTS.md:60`.

## Database

Skema utama: `users`, `blogs`, `comments` (self-referencing `parent_id` untuk reply), `likes`, `saves`. ERD dan definisi kolom lengkap di [`DATABASE.md`](./DATABASE.md).

```bash
npm run db:generate  # generate SQL migrations dari schema
npm run db:push      # push schema langsung ke DB (dev)
npm run db:migrate   # jalankan migrasi
npm run db:studio    # buka Drizzle Studio
```

Schema source: `src/db/schema.ts` · Client: `src/db/index.ts` · Config: `drizzle.config.ts`.

## Available Scripts

| Script                       | Description                                      |
| ---------------------------- | ------------------------------------------------ |
| `npm run dev`                | Start dev server di port 3000                    |
| `npm run generate-routes`    | Generate `src/routeTree.gen.ts` (`tsr generate`) |
| `npm run build`              | Build production (Vite + Nitro)                  |
| `npm run preview`            | Preview build                                    |
| `node dist/server/index.mjs` | Jalankan artifact production                     |
| `npm run check`              | Cek format Prettier                              |
| `npm run format`             | Format Prettier + fix ESLint                     |
| `npm run lint`               | ESLint (TanStack config)                         |

**Verifikasi sebelum PR:**

```bash
npm run generate-routes && npm run check && npm run lint && npm run build
```

## Styling & Design System

- Tailwind v4 tanpa `tailwind.config.js` — konfigurasi via `@theme inline` di `src/styles.css`
- Palet: `bg #FFFFFF`, `surface #FAFAFA`, `text #171717`, `border #E6E6E6`, `accent #FFC017`
- Border 1px, radius restrained (2–4px), shadow minimal — baca [`DESIGN.md`](./DESIGN.md) untuk skala tipografi, spacing 4px, dan anti-pattern

Menambah komponen UI:

```bash
pnpm dlx shadcn@latest add button
# atau
npx shadcn@latest add button
```

## Deployment (Nitro)

Build menghasilkan server Node self-contained di `dist/server/index.mjs`. Deploy ke host Node-compatible (VPS, Render, Fly.io, dsb.):

```bash
npm run build
node dist/server/index.mjs
```

Untuk preset host spesifik (Vercel, Netlify, Cloudflare, AWS Lambda) lihat https://v3.nitro.build/deploy.

## Documentation

- [`AGENTS.md`](./AGENTS.md) — Arsitektur, path alias, gotchas, dan session rules
- [`DATABASE.md`](./DATABASE.md) — Skema, ERD (ASCII + Mermaid), dan aturan FK
- [`DESIGN.md`](./DESIGN.md) — Visual language, color, typography, layout, dan checklist

## Contributing

1. Buat branch dari `main`
2. Jalankan sequence verifikasi di atas sebelum membuka PR
3. Ikuti editorial aesthetic — hindari heavy shadow, gradient berlebihan, dan SaaS card pattern
4. **Git Operations:** Jangan auto-commit/push/PR tanpa izin eksplisit — minta konfirmasi terlebih dahulu (lihat `AGENTS.md:67`)

## License

Private — untuk keperluan tugas/internal. Sesuaikan lisensi sebelum publikasi.
