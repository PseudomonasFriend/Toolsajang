# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 개요

한국 소상공인·자영업자가 로그인 없이 3초 만에 비즈니스 계산 결과를 얻을 수 있는 무료 플랫폼. 계산기 19종 + 장사 팁 28개를 제공하며 Google AdSense로 수익화한다.
- 도메인: https://toolsajang.com
- 배포: Vercel (GitHub main 브랜치 자동 배포)
- 수익 모델: Google AdSense + 자사 서비스 크로스 프로모션 배너

**핵심 기능**:
- 비즈니스 계산기 19종 (마진·부가세·손익분기점·급여·배달수수료·대출 등 순수 계산기 17종 + AI 툴 2종)
- 장사 팁 MDX 콘텐츠 28개 (SEO 유입 + 계산기 연계)
- AI 아이디어 툴: 메뉴명·가게명 추천 (Gemini/Groq/OpenRouter, IP당 분당 5회 Rate Limit)
- 동적 OG 이미지 자동 생성 (홈 + 툴 19개 + 팁 28개)
- Google Search Console·네이버 서치어드바이저 등록 완료

**아키텍처**: Next.js 16 App Router + Tool Registry(`src/tools/index.ts`) 패턴. 각 툴은 `src/tools/[slug]/` 폴더에 calculation.ts·types.ts·UI 컴포넌트·index.ts로 캡슐화. 순수 계산기는 클라이언트 동기 계산, AI 툴은 `/api/tools/*` 서버 API 경유. 장사 팁은 MDX SSG. 외부 DB 없음.

## Project Overview

ToolSajang (툴사장) is a B2C web platform providing free business calculators and tools for Korean small business owners. No login required — users get instant results. The master specification is `TOOLSAJANG_SPEC.md` (single source of truth for all development).

## Tech Stack

- **Framework**: Next.js 16 (App Router)
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

- `src/tools/` — **all tool modules** (calculation, types, UI, README per tool)
- `src/tools/index.ts` — central tool registry (getToolModule, getAllToolSlugs)
- `src/data/tools.ts` — tool list for homepage/listing (from tools/index + upcoming)
- `src/data/ads.ts` — custom banner data
- `src/data/tips/` — **장사 팁 MDX files** (*.mdx), 28 articles
- `src/lib/tips.ts` — getTipsList, getTipBySlug, getLatestTips, getAllTipSlugs
- `src/lib/format.ts`, `src/lib/utils.ts`, `src/lib/calculations.ts`
- `src/lib/rate-limit.ts` — API rate limiting (RateLimiter interface + in-memory 구현, Upstash 교체 가능)
- `src/components/common/CalculatorLayout.tsx`, `AdBanner.tsx`, `JsonLd.tsx`
- `src/components/tips/TipCard.tsx` — tip list card
- `src/app/tips/page.tsx` — tip list; `app/tips/[slug]/page.tsx` — tip detail (MDX)
- `src/app/sitemap.ts`, `src/app/robots.ts` — SEO
- `src/app/opengraph-image.tsx` — 홈 OG 이미지 (Edge Runtime)
- `src/app/tools/[slug]/opengraph-image.tsx` — 툴별 OG 이미지 (Node.js Runtime)
- `src/app/tips/[slug]/opengraph-image.tsx` — 팁별 OG 이미지 (Node.js Runtime)
- `src/types/index.ts` — Tool, BlogPost/TipPost, CustomAd

### 장사 팁 (Tips)

- **URL**: `/tips` (list), `/tips/[slug]` (detail). Content in `src/data/tips/*.mdx`.
- **List**: `getTipsList()` from `src/lib/tips.ts`. TipCard, ad slots every 3 items.
- **Detail**: `getTipBySlug(slug)`, MDX via `next-mdx-remote/rsc`, `.tip-content` styling in `globals.css`.
- **Home**: `getLatestTips(3)` for preview. Nav: "장사 팁" → `/tips`.

### Ad Slot System

Two ad types (`adsense` | `custom`) managed through `AdBanner.tsx`. Slot positions are defined in spec section 9.2. Ad slots must not break layout when empty (pre-AdSense approval).

## Coding Rules (Non-Negotiable)

1. **All UI text and code comments in Korean**
2. **Function components + React Hooks only**
3. **Mobile-first design** — desktop is just mobile layout with `max-width` centering (480px for tools, 720px for tips)
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

템플릿: `.env.local.example` 참고 (`.env.local`로 복사 후 값 입력)

```
NEXT_PUBLIC_SITE_URL                  # https://toolsajang.com
NEXT_PUBLIC_SITE_NAME                 # 툴사장
NEXT_PUBLIC_GA_ID                     # Google Analytics 4 (G-XXXXXXXXXX)
NEXT_PUBLIC_ADSENSE_ID                # Google AdSense (ca-pub-XXXXXXXXXXXXXXXX)
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION  # Google Search Console 소유 확인 content 값
NEXT_PUBLIC_NAVER_SITE_VERIFICATION   # 네이버 서치어드바이저 소유 확인 content 값
```
