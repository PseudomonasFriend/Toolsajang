# PROJECT.md — Toolsajang (툴사장)

> LLM-중립 실내용 문서. Claude/Codex/Gemini 모두 이 파일을 기준으로 동일하게 작동한다.
>
> 상세 기획서(PRD + Tech Spec) 전문은 [`TOOLSAJANG_SPEC.md`](TOOLSAJANG_SPEC.md) 참조.

## 프로젝트 개요

한국 소상공인·자영업자가 로그인 없이 3초 만에 비즈니스 계산 결과를 얻을 수 있는 무료 플랫폼. 계산기 25종 + 장사 팁 52개를 제공하며 Google AdSense로 수익화한다.

- 도메인: https://toolsajang.com
- 배포: Vercel (GitHub main 브랜치 자동 배포)
- 수익 모델: Google AdSense + 자사 서비스 크로스 프로모션 배너

**핵심 기능**:
- 비즈니스 계산기 25종 (마진·부가세·손익분기점·급여·배달수수료·대출·카드수수료·인건비비율·창업비용·매출예측 등 순수 계산기 23종 + AI 툴 2종)
- 장사 팁 MDX 콘텐츠 52개 (SEO 유입 + 계산기 연계)
- AI 아이디어 툴: 메뉴명·가게명 추천 (Gemini/Groq/OpenRouter, IP당 분당 5회 Rate Limit)
- 동적 OG 이미지 자동 생성 (홈 + 툴 25개 + 팁 52개)
- Google Search Console·네이버 서치어드바이저 등록 완료

**아키텍처**: Next.js 16 App Router + Tool Registry(`src/tools/index.ts`) 패턴. 각 툴은 `src/tools/[slug]/` 폴더에 calculation.ts·types.ts·UI 컴포넌트·index.ts로 캡슐화. 순수 계산기는 클라이언트 동기 계산, AI 툴은 `/api/tools/*` 서버 API 경유. 장사 팁은 MDX SSG. 외부 DB 없음.

## 기술 스택

| 항목 | 내용 |
|------|------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript strict (`any` 금지) |
| Styling | Tailwind CSS only (inline styles, CSS Modules 금지) |
| Content | MDX via `next-mdx-remote` |
| Package | pnpm |
| Icons/Font | Lucide React / Pretendard |
| 배포 | Vercel |

## 빌드 & 실행

```bash
pnpm dev     # 개발 서버
pnpm build   # 프로덕션 빌드
pnpm lint    # 린트
pnpm test    # Vitest (22파일 269개 테스트)
pnpm start   # 프로덕션 서버
```

## 핵심 파일 구조

```
src/
├── tools/                            # 계산기별 독립 모듈
│   ├── [slug]/README.md              # 계산기별 스펙
│   ├── [slug]/calculation.ts         # 순수 계산 로직
│   ├── [slug]/types.ts               # 타입
│   ├── [slug]/*.tsx                  # 계산기 UI
│   ├── [slug]/index.ts               # meta, seo, Component export
│   └── index.ts                      # 중앙 tool registry (getToolModule, getAllToolSlugs)
├── data/
│   ├── tools.ts                      # 홈/목록 노출용 tool list (isActive 플래그)
│   └── tips/                         # 장사 팁 MDX files (*.mdx), 52개
├── lib/
│   ├── tips.ts                       # getTipsList, getTipBySlug, getAllTipSlugs
│   └── rate-limit.ts                 # API rate limiting (in-memory)
├── components/common/
│   ├── CalculatorLayout.tsx          # 계산기 공통 레이아웃
│   ├── AdBanner.tsx                  # AdSense | custom 두 타입
│   └── JsonLd.tsx                    # JSON-LD 구조화 데이터
├── app/
│   ├── tools/[slug]/page.tsx         # 동적 계산기 라우트
│   ├── tips/page.tsx                 # 팁 목록
│   ├── tips/[slug]/page.tsx          # 팁 상세 (MDX)
│   ├── sitemap.ts                    # SEO sitemap
│   ├── robots.ts                     # SEO robots
│   ├── opengraph-image.tsx           # 홈 OG 이미지
│   └── api/tools/                    # AI 툴 서버 API (rate limit 적용)
```

## 코딩 규칙 (Non-Negotiable)

1. UI 텍스트와 코드 주석은 한국어
2. 함수형 컴포넌트 + React Hooks only
3. Mobile-first 설계 — 계산기 본문 max-width 480px, 팁/목록 720px
4. 최소 터치 대상 44x44px. 본문 텍스트 ≥ 16px, 입력 ≥ 18px, 결과 숫자 ≥ 24px bold
5. Server Components 기본 — Client Components 최소화
6. 모든 페이지에 Next.js Metadata API 기반 SEO
7. AdSense 스크립트는 root `layout.tsx`에서만 관리
8. 이미지는 `/public/images/`에 두고 Next.js `Image` 사용
9. 인터랙티브 요소에 접근성 label 필수
10. 색상: primary=blue-600, accent=amber-500, success=green-600, danger=red-500, bg=gray-50

## 신규 툴 추가

`.claude/skills/toolsajang-new-tool.md` 읽기.

## 환경 변수

`.env.local.example` 참고. 주요 변수:

```
NEXT_PUBLIC_SITE_URL
NEXT_PUBLIC_GA_ID
NEXT_PUBLIC_ADSENSE_ID
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
NEXT_PUBLIC_NAVER_SITE_VERIFICATION
```

## 현재 작업 현황

`WORK_STATUS.md` 참조.

## 관련 노트

- Obsidian: `C:\Users\Hayeon\Projects_local\_HQ\Projects\Toolsajang.md`
- HQ 지시사항: `.claude/skills/toolsajang-hq.md`
- 기획 상세(PRD): `TOOLSAJANG_SPEC.md` (35.5KB)
