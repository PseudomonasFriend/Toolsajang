# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

ToolSajang (툴사장) is a B2C web platform providing free business calculators and tools for Korean small business owners. No login required — users get instant results. The master specification is `TOOLSAJANG_SPEC.md` (single source of truth for all development).

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript (strict mode, `any` forbidden)
- **Styling**: Tailwind CSS only (no inline styles, no CSS Modules)
- **Content**: MDX via `next-mdx-remote` or `contentlayer2`
- **Package Manager**: pnpm (preferred) or npm
- **Deployment**: Vercel
- **Icons**: Lucide React
- **Font**: Pretendard (Korean + English)

## Common Commands

```bash
pnpm dev          # Start dev server
pnpm build        # Production build
pnpm lint         # Run linter
pnpm start        # Start production server
```

## Architecture

### Tool Module System (per-tool folder)

Each tool is a **self-contained module** under `src/tools/[tool-slug]/`:

```
src/tools/margin-calculator/
  README.md            # Tool-specific spec (inputs, outputs, calculation, UI rules)
  types.ts             # Tool-specific types
  calculation.ts       # Calculation logic
  MarginCalculator.tsx # UI component ('use client')
  index.ts             # meta, seo, Component export
```

- **Tool-specific spec**: Each tool folder contains a `README.md` with all info needed to implement/modify that tool. Subagents only need to read this file + the tool folder.
- **Central registry**: `src/tools/index.ts` imports all tool modules and provides `getToolModule()`, `getAllToolSlugs()`, etc.
- **Dynamic route**: `src/app/tools/[slug]/page.tsx` loads tools by slug from the registry.
- **Upcoming tools** (not yet implemented): Listed in `src/data/tools.ts` with `isActive: false`.

### Key Directories

- `src/tools/` — **all tool modules live here** (calculation, types, UI, README per tool)
- `src/tools/index.ts` — central tool registry (imports from each tool folder)
- `src/data/tools.ts` — combined tool list (implemented + upcoming) for homepage/listing
- `src/data/ads.ts` — custom banner data
- `src/lib/format.ts` — number/currency/percent formatting
- `src/lib/utils.ts` — cn() and shared utilities
- `src/lib/calculations.ts` — shared calculation helpers only (tool-specific logic is in each tool folder)
- `src/components/common/CalculatorLayout.tsx` — shared wrapper for all tool pages
- `src/components/common/AdBanner.tsx` — unified ad component (AdSense + custom)
- `src/types/index.ts` — common types only (Tool, AdSlot, BlogPost)

### Ad Slot System

Two ad types (`adsense` | `custom`) managed through `AdBanner.tsx`. Slot positions are defined in spec section 9.2. Ad slots must not break layout when empty (pre-AdSense approval).

## Coding Rules (Non-Negotiable)

1. **All UI text and code comments in Korean**
2. **Function components + React Hooks only**
3. **Mobile-first design** — desktop is just mobile layout with `max-width` centering (480px for tools, 720px for blog)
4. **Minimum touch target**: 44x44px. Body text >= 16px, input text >= 18px, result numbers >= 24px bold
5. **Server Components by default** — minimize Client Components
6. **SEO metadata on every page** using Next.js Metadata API (`generateMetadata` or `metadata` export)
7. **AdSense script** managed in root `layout.tsx`, not inline
8. **Images** in `/public/images/`, always use Next.js `Image` component
9. **Accessibility**: aria labels on all interactive elements

## Adding a New Tool (Checklist)

1. Create folder `src/tools/[tool-slug]/`
2. Write `README.md` with tool spec (inputs, outputs, calculation logic, UI requirements)
3. Create `types.ts` with tool-specific input/output interfaces
4. Create `calculation.ts` with calculation function
5. Create `[ToolName].tsx` UI component (`'use client'`)
6. Create `index.ts` exporting `meta`, `seo`, `Component`
7. Register in `src/tools/index.ts` (one import + one map entry)
8. Move tool from `upcomingTools` to remove from `src/data/tools.ts` (if it was listed there)
9. Verify: mobile layout, ad slots (`tool-result-bottom`, `tool-page-bottom`), `pnpm build`

## Design Tokens

| Purpose | Tailwind Class |
|---------|---------------|
| Primary | `blue-600` |
| Primary Hover | `blue-700` |
| Accent/CTA | `amber-500` |
| Success/Profit | `green-600` |
| Warning/Loss | `red-500` |
| Background | `gray-50` |
| Card Surface | `white` |
| Text Primary | `gray-900` |
| Text Secondary | `gray-500` |
| Border | `gray-200` |

## Git Conventions

- Commit messages in Korean with prefixes: `feat:`, `fix:`, `docs:`

## Environment Variables

```
NEXT_PUBLIC_GA_ID         # Google Analytics 4
NEXT_PUBLIC_ADSENSE_ID    # Google AdSense Publisher ID
NEXT_PUBLIC_SITE_URL      # https://toolsajang.com
NEXT_PUBLIC_SITE_NAME     # 툴사장
```
