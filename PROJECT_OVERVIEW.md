# 툴사장 (Toolsajang) — 소상공인 비즈니스 계산기 플랫폼

> 로그인 없이 3초 만에 결과를 얻는 무료 비즈니스 계산기 + 장사 팁 콘텐츠

---

## 프로젝트 개요

- **서비스명**: 툴사장
- **목적**: 한국 소상공인·자영업자를 위한 비즈니스 계산기 + 장사 팁 콘텐츠
- **수익 모델**: Google AdSense 광고 + 크로스 프로모션 배너
- **상태**: **Phase 1~3 완료, Vercel 배포 중** (main 푸시 시 자동 배포)

---

## 기술 스택

| 구분 | 기술 |
|------|------|
| 프레임워크 | Next.js 16.x (App Router + Turbopack) |
| 언어 | TypeScript 5.x (strict, `any` 금지) |
| 스타일링 | Tailwind CSS 4.x only (인라인/CSS Modules 금지) |
| 콘텐츠 | MDX (`next-mdx-remote`, `gray-matter`) — 장사 팁 |
| 아이콘 | Lucide React |
| 폰트 | Pretendard Variable (CDN) |
| 패키지 관리 | pnpm |
| 배포 | Vercel (GitHub 연동, 자동 배포) |

---

## 사이트 구조

| 경로 | 설명 |
|------|------|
| `/` | 홈 (툴 카드 + 장사 팁 최신 3개 + 광고 슬롯) |
| `/tools` | 툴 전체 목록 |
| `/tools/[slug]` | 개별 툴 (마진, 부가세, 손익분기, 급여, 할인, 대출, 배달 수수료) |
| `/tips` | 장사 팁 목록 |
| `/tips/[slug]` | 장사 팁 상세 (MDX, 18개 글) |
| `/about` | 서비스 소개 |
| `/privacy` | 개인정보처리방침 |
| `/terms` | 이용약관 |
| `/blog` | `/tips` 로 리다이렉트 |

---

## 폴더 구조

```
src/
├── app/
│   ├── layout.tsx           루트 레이아웃 (GA4·AdSense 스크립트, JSON-LD)
│   ├── page.tsx             홈 (툴 + 장사 팁 미리보기)
│   ├── sitemap.ts           동적 sitemap.xml
│   ├── robots.ts            robots.txt
│   ├── tools/
│   │   ├── page.tsx         툴 목록
│   │   └── [slug]/page.tsx  동적 툴 라우트
│   ├── tips/
│   │   ├── page.tsx         장사 팁 목록
│   │   └── [slug]/page.tsx  장사 팁 상세 (MDX)
│   ├── blog/page.tsx        → /tips 리다이렉트
│   ├── about/, privacy/, terms/
│   └── globals.css          전역 + .tip-content 가독성 스타일
│
├── tools/                   계산기 모듈 (1폴더 = 1툴)
│   ├── index.ts             slug → 모듈 레지스트리
│   ├── margin-calculator/
│   ├── vat-calculator/
│   ├── break-even-calculator/
│   ├── salary-calculator/
│   ├── discount-calculator/
│   ├── loan-calculator/
│   └── delivery-fee-calculator/
│
├── components/
│   ├── layout/              Header, Footer, MobileNav
│   ├── common/              AdBanner, CalculatorLayout, JsonLd
│   └── tips/                TipCard
│
├── data/
│   ├── tools.ts             툴 메타 (구현 툴은 tools/index에서 가져옴)
│   ├── ads.ts               자사 배너 데이터
│   └── tips/                장사 팁 MDX 파일 (*.mdx)
│
├── lib/
│   ├── tips.ts              장사 팁 목록·상세 조회 (getTipsList, getTipBySlug 등)
│   ├── format.ts, utils.ts
│   └── calculations.ts      공유 수학 헬퍼
│
└── types/index.ts           Tool, BlogPost/TipPost, CustomAd 등
```

---

## 구현된 툴 (7개)

| 계산기 | slug | 비고 |
|--------|------|------|
| 마진 계산기 | `margin-calculator` | 순이익, 마진율, 마크업율 (부가세/수수료/배송비) |
| 부가세 계산기 | `vat-calculator` | 공급가↔부가세 포함 금액 |
| 손익분기점 계산기 | `break-even-calculator` | BEP 수량·매출 |
| 급여 계산기 | `salary-calculator` | 4대보험·실수령·사업주 부담 (2025 요율) |
| 할인 계산기 | `discount-calculator` | 할인 전후 비교 |
| 대출 계산기 | `loan-calculator` | 원금균등/원리금균등 + 월별 스케줄 |
| 배달 수수료 계산기 | `delivery-fee-calculator` | 배민/쿠팡이츠/요기요 등 수익 비교 |

---

## 장사 팁 (18개)

- **경로**: `/tips`, `/tips/[slug]`
- **저장 위치**: `src/data/tips/*.mdx`
- **주제**: 마진·마크업, 부가세·간이과세, 배달 수수료, 손익분기점, 할인·마진, 급여·실수령, 대출 상환, 매출 목표, 임대료 비율, 카드 수수료, 메뉴 원가, 일일 매출, 인건비율, 세금 체크리스트, 가격 인상·마진, 개업 비용 등
- **스타일**: `.tip-content` (줄간격·단락 여백·제목 구분)

---

## 문서

| 파일 | 내용 |
|------|------|
| `TOOLSAJANG_SPEC.md` | 마스터 스펙 (사이트 구조, 장사 팁, 툴, SEO, 로드맵) |
| `WORK_STATUS.md` | 작업 현황 (이 파일과 동기화) |
| `CLAUDE.md` | AI 에이전트 가이드 |
| `docs/TOOL_MODULE_PARALLEL_DESIGN.md` | 툴 병렬 개발 설계 |
| `docs/DEPLOY.md` | GitHub·Vercel 배포 가이드 |
| `src/tools/*/README.md` | 툴별 상세 스펙 |
