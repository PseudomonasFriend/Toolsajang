# Toolsajang (툴사장) — 소상공인 비즈니스 계산기 플랫폼

> 로그인 없이 3초 만에 결과를 얻는 무료 비즈니스 계산기 모음 웹서비스

---

## 프로젝트 개요

- **서비스명**: 툴사장
- **목적**: 한국 소상공인·자영업자를 위한 비즈니스 계산기 플랫폼
- **수익 모델**: Google AdSense 광고 + 크로스 프로모션 배너
- **상태**: **개발 완료, 미배포** (Vercel 배포 예정)

---

## 기술 스택

| 구분 | 기술 |
|------|------|
| 프레임워크 | Next.js 16.x (App Router + Turbopack) |
| 언어 | TypeScript 5.x (strict, `any` 금지) |
| 스타일링 | Tailwind CSS 4.x only (인라인/CSS Modules 금지) |
| 아이콘 | Lucide React |
| 폰트 | Pretendard Variable (CDN) |
| 패키지 관리 | pnpm |
| 배포 | Vercel (예정) |
| 블로그 | MDX (계획, 미설치) |

---

## 폴더 구조

```
src/
├── app/                         Next.js App Router 페이지
│   ├── layout.tsx               루트 레이아웃 (조건부 AdSense 스크립트)
│   ├── page.tsx                 홈페이지
│   ├── tools/
│   │   ├── page.tsx             계산기 목록
│   │   └── [slug]/page.tsx      동적 계산기 라우트 (generateStaticParams)
│   ├── blog/page.tsx            블로그 (플레이스홀더 — "coming soon")
│   ├── about/page.tsx           소개
│   ├── privacy/page.tsx         개인정보처리방침
│   └── terms/page.tsx           이용약관
│
├── tools/                       핵심 — 계산기 모듈 (1 폴더 = 1 계산기)
│   ├── index.ts                 중앙 레지스트리 (slug → 모듈 매핑)
│   ├── margin-calculator/       마진 계산기
│   ├── vat-calculator/          부가세 계산기
│   ├── break-even-calculator/   손익분기 계산기
│   ├── salary-calculator/       급여 계산기
│   ├── discount-calculator/     할인 계산기
│   ├── loan-calculator/         대출 계산기
│   └── delivery-fee-calculator/ 배달비 계산기
│
├── components/
│   ├── layout/                  Header, Footer, MobileNav
│   ├── common/                  AdBanner, CalculatorLayout
│   └── tools/                   ToolCard
│
├── data/
│   ├── tools.ts                 계산기 목록 (구현 + 예정)
│   └── ads.ts                   커스텀 배너 데이터 (현재 빈 배열)
│
├── lib/
│   ├── format.ts                숫자/통화/퍼센트 포맷팅
│   ├── utils.ts                 cn() Tailwind 유틸
│   └── calculations.ts          공유 수학 헬퍼 (roundTo)
│
└── types/index.ts               Tool, AdSlot, BlogPost 타입
```

---

## 핵심 아키텍처: 계산기 모듈 시스템

각 계산기는 **5개 파일의 독립 모듈**:

```
src/tools/[slug]/
├── README.md           # 계산기 스펙 (입력, 출력, UI 규칙)
├── types.ts            # TypeScript 인터페이스
├── calculation.ts      # 순수 계산 함수
├── [ToolName].tsx      # React UI ('use client')
└── index.ts            # exports: meta, seo, Component
```

- 중앙 레지스트리 (`tools/index.ts`)가 slug → 모듈 매핑
- 단일 동적 라우트 `[slug]/page.tsx`가 `getToolModule(slug)` 호출 → `CalculatorLayout` 래핑
- `generateStaticParams()`로 빌드 타임 정적 생성
- **AI 에이전트 병렬 개발에 최적화** — 서로 다른 에이전트가 서로 다른 폴더에서 독립 작업 가능

---

## 구현된 7개 계산기

| 계산기 | slug | 기능 |
|--------|------|------|
| 마진 계산기 | `margin-calculator` | 순이익, 마진율, 마크업율 (부가세/수수료/배송비 포함) |
| 부가세 계산기 | `vat-calculator` | 양방향: 공급가→총액, 총액→공급가 |
| 손익분기 계산기 | `break-even-calculator` | BEP 수량·매출 (고정비/변동비/판매가) |
| 급여 계산기 | `salary-calculator` | 4대보험 공제 + 실수령액 + 사업주 부담금 (2025 요율) |
| 할인 계산기 | `discount-calculator` | 할인 전후 마진 비교 + 필요 판매량 증가율 |
| 대출 계산기 | `loan-calculator` | 원금균등/원리금균등 비교 + 월별 스케줄 |
| 배달비 계산기 | `delivery-fee-calculator` | 배민(6.8%)/쿠팡이츠(9.8%)/요기요(12.5%) 수익 비교 |

---

## 문서

| 파일 | 내용 |
|------|------|
| `TOOLSAJANG_SPEC.md` | 19섹션 마스터 스펙 |
| `CLAUDE.md` | AI 에이전트 가이드 |
| `docs/TOOL_MODULE_PARALLEL_DESIGN.md` | 병렬 개발 설계 문서 |
| 각 `tools/*/README.md` | 계산기별 상세 스펙 |
