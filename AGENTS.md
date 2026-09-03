# AGENTS.md

## common rules
- **Explain Language**: use indonesian to only when explain something
- **git/github**: always confirm before commit,merge,push etc

## mode agent
- do not add comment in code build mode except it is important

## Overview & Architecture

- **Framework**: TanStack Start (React 19, Vite 8, Nitro adapter).
- **Routing**: TanStack Router (file-based in `src/routes/`). Generates `src/routeTree.gen.ts`.
- **Data & State**: TanStack Query with SSR hydration via `@tanstack/react-router-ssr-query`.
- **Styling**: Tailwind CSS v4 (`@tailwindcss/vite`, `@tailwindcss/typography`, `tw-animate-css`). Theme tokens defined in `src/styles.css`.
- **Database**: Drizzle ORM (`mysql2`) with schema reference in `DATABASE.md`, schema definitions in `src/db/schema.ts`, and client in `src/db/index.ts`.
- **MCP Integration**: Model Context Protocol endpoints in `src/routes/mcp.ts` and `src/utils/mcp-handler.ts`.
- **Design System**: Editorial reading experience following `DESIGN.md` (content-first, high contrast typography, neutral palette, minimal decorative UI).

## Path Aliases

- Both `#/*` and `@/*` resolve to `./src/*` (e.g. `#/lib/utils` or `@/components/ui/button`).

## Key Developer Commands

```bash
# Development server (port 3000)
npm run dev

# Generate TanStack route tree (required for typecheck if dev server isn't running)
npm run generate-routes

# Build for production & preview
npm run build
npm run preview
# Run production server artifact
node dist/server/index.mjs

# Code quality & formatting
npm run check          # Check formatting with Prettier
npm run format         # Auto-format Prettier & fix ESLint
npm run lint           # Run ESLint (TanStack config)

# Database operations (Drizzle Kit + MySQL)
npm run db:generate    # Generate SQL migrations
npm run db:push        # Push schema directly to DB
npm run db:migrate     # Apply migrations
npm run db:studio      # Open Drizzle Studio web interface

# Add Shadcn UI components
pnpm dlx shadcn@latest add <component>
# or
npx shadcn@latest add <component>
```

## Recommended Verification Sequence

When verifying code changes, execute in order:

```bash
npm run generate-routes && npm run check && npm run lint && npm run build
```

## Gotchas & Operational Notes

1. **Route Generation**: If TypeScript complains about missing routes or invalid path arguments in `src/routes/`, run `npm run generate-routes` (`tsr generate`) to sync `src/routeTree.gen.ts`.
2. **Database Config**: Drizzle requires `DATABASE_URL` configured in `.env.local` or `.env` (`mysql://user:pass@host:port/dbname`).
3. **Tailwind v4 Setup**: Uses CSS-based `@theme inline` configurations in `src/styles.css` instead of `tailwind.config.js`.
4. **Editorial Aesthetic**: Follow guidelines in `DESIGN.md`—prioritize typography, 1px subtle borders, neutral backgrounds (`#FFFFFF`, `#FAFAFA`), and restrained accent color (`#FFC017`). Avoid heavy shadows, excessive gradients, or SaaS card patterns.
5. **Session Rules**:
   - Use Bahasa Indonesia during Plan Mode.
   - Avoid adding unnecessary comments in code during Build Mode.
   - Use `frontend-design` skill prior to implementing new UI pages or visual components.
   - **Git Operations**: Dilarang melakukan auto-commit, push, atau create Pull Request (PR). Selalu minta izin dan konfirmasi eksplisit dari pengguna sebelum menjalankan git commit atau PR.

## Agent skills

### Issue tracker

GitHub issues via `gh` CLI. See `docs/agents/issue-tracker.md`.

### Triage labels

Canonical 5-role vocabulary. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context (`CONTEXT.md` + `docs/adr/`). See `docs/agents/domain.md`.
