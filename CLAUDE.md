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

## Obsidian 노트
- 기획/아이디어: `C:\Projects_local\_notes\Projects\Toolsajang.md`

## Tech Stack

| 항목 | 내용 |
|------|------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript strict (`any` 금지) |
| Styling | Tailwind CSS only (inline styles, CSS Modules 금지) |
| Content | MDX via `next-mdx-remote` |
| Package | pnpm |
| Icons/Font | Lucide React / Pretendard |

## Common Commands

```bash
pnpm dev     # 개발 서버
pnpm build   # 프로덕션 빌드
pnpm lint    # 린트
pnpm start   # 프로덕션 서버
```

## Architecture

### Tool Module System

각 툴은 `src/tools/[slug]/` 아래 자기완결 모듈: `README.md` (스펙), `types.ts`, `calculation.ts`, `[Tool].tsx` (`'use client'`), `index.ts` (meta·seo·Component export).

- 서브에이전트는 해당 툴의 `README.md` + 툴 폴더만 읽으면 됨
- **Central registry**: `src/tools/index.ts` — `getToolModule()`, `getAllToolSlugs()` 등
- **Dynamic route**: `src/app/tools/[slug]/page.tsx`
- **미구현 툴**: `src/data/tools.ts`의 `isActive: false` 항목

### Key Directories

- `src/tools/` — all tool modules (calculation, types, UI, README per tool)
- `src/tools/index.ts` — central tool registry (getToolModule, getAllToolSlugs)
- `src/data/tools.ts` — tool list for homepage/listing
- `src/data/tips/` — 장사 팁 MDX files (*.mdx), 28 articles
- `src/lib/tips.ts` — getTipsList, getTipBySlug, getLatestTips, getAllTipSlugs
- `src/lib/rate-limit.ts` — API rate limiting (in-memory, Upstash 교체 가능)
- `src/components/common/CalculatorLayout.tsx`, `AdBanner.tsx`, `JsonLd.tsx`
- `src/app/tips/page.tsx`, `app/tips/[slug]/page.tsx` — tip list/detail (MDX)
- `src/app/sitemap.ts`, `src/app/robots.ts` — SEO
- OG 이미지: `src/app/opengraph-image.tsx` (홈), `tools/[slug]/opengraph-image.tsx`, `tips/[slug]/opengraph-image.tsx`

### 장사 팁 (Tips)

URL: `/tips` (list), `/tips/[slug]` (detail). `src/data/tips/*.mdx` → `getTipsList()` / `getTipBySlug()` via `src/lib/tips.ts`. MDX via `next-mdx-remote/rsc`, `.tip-content` styling in `globals.css`. TipCard 목록에서 3개마다 광고 슬롯 삽입.

### Ad Slot System

`AdBanner.tsx`로 `adsense` | `custom` 두 타입 관리. 광고 슬롯은 레이아웃을 깨지 않아야 함 (AdSense 미승인 상태에서도 빈 슬롯 허용).

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
10. **색상**: primary=blue-600, accent=amber-500, success=green-600, danger=red-500, bg=gray-50

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

## Environment Variables

`.env.local.example` 참고. 주요 변수:

```
NEXT_PUBLIC_SITE_URL                  # https://toolsajang.com
NEXT_PUBLIC_GA_ID                     # Google Analytics 4
NEXT_PUBLIC_ADSENSE_ID                # Google AdSense
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION  # Search Console 소유 확인
NEXT_PUBLIC_NAVER_SITE_VERIFICATION   # 네이버 서치어드바이저 소유 확인
```

## HQ 지시사항

> `_HQ/Projects/Toolsajang.md`와 동기화. 변경은 HQ 파일에서 먼저.

**상태**: 활성 (수익 보조 프로젝트)
**목표**: 6월 100K PV, 월 10~15만원 AdSense
**HQ 우선순위**:
1. ESLint v9 마이그레이션 — flat config 전환, `pnpm lint` 에러 0건
2. AdSense 자동 광고 ON + 수동 슬롯 ID 설정 (HY 콘솔 작업 필요)
3. AI 툴 2종 활성화 — menu-name-ideas, shop-name-ideas (`isActive: true`)
4. 4월: 신규 계산기 3~5종 (카드수수료, 인건비비율, 창업비용, 매출예측, 배달순이익)
5. 장사 팁 10편 추가 + 내부 링크 강화 (계산기↔팁 양방향)
**보류/결정**:
- 카카오 미니앱은 6월 조사 후 go/no-go 결정
