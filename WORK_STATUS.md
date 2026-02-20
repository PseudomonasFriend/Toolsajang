# 툴사장 — 작업 현황 (WORK STATUS)

> 최종 업데이트: 2026-02-20 (단위 테스트 210개 완료)

---

## 완료된 작업

### Phase 1: MVP
- [x] Next.js 16 프로젝트 (App Router, TypeScript strict, Tailwind)
- [x] 공통 레이아웃: Header, Footer, MobileNav (홈 · 툴 · 장사 팁 · 소개)
- [x] 공통 컴포넌트: AdBanner, CalculatorLayout, ToolCard
- [x] 툴 모듈 시스템: `src/tools/[slug]/` (README, types, calculation, UI, index)
- [x] 동적 라우트 `app/tools/[slug]/page.tsx` + generateStaticParams
- [x] 계산기 13개: 마진, 부가세, 손익분기, 급여, 할인, 대출, 배달 수수료, 매출 목표, 임대료 비율, 할인가 역산, QR코드, D-day, **메뉴명 아이디어(AI)** (모두 UI·계산/API 완료)
- [x] 홈페이지, 툴 목록(카테고리 필터), 소개, 개인정보처리방침, 이용약관
- [x] GitHub 연결 (PseudomonasFriend/Toolsajang), Vercel 배포

### Phase 2: 장사 팁 + 콘텐츠·SEO
- [x] **장사 팁 섹션** (`/tips`, `/tips/[slug]`)
  - MDX: `next-mdx-remote`, `gray-matter`, `src/data/tips/*.mdx`
  - 목록 페이지 (TipCard, 3개마다 광고 슬롯)
  - 상세 페이지 (MDX 렌더, 광고·하단 홍보·관련 글)
  - 홈에 "장사 팁" 최신 3개 미리보기
  - 네비 "장사 팁" 메뉴 반영
- [x] **장사 팁 글 28개** (18개 기존 + 10개 추가)
- [x] `/blog` → `/tips` 리다이렉트
- [x] **SEO**: `app/sitemap.ts`, `app/robots.ts`, JSON-LD (WebSite, Organization, Article)
- [x] **OG 이미지**: `app/opengraph-image.tsx` (홈), `app/tools/[slug]/opengraph-image.tsx` (툴), `app/tips/[slug]/opengraph-image.tsx` (팁) — next/og ImageResponse 동적 생성
- [x] About, Privacy, Terms 페이지 (기존 유지)

### Phase 3: 수익화 인프라
- [x] **Google Analytics 4**: `NEXT_PUBLIC_GA_ID` 설정 시 layout.tsx에 gtag 스크립트
- [x] **AdSense**: `NEXT_PUBLIC_ADSENSE_ID` 설정 시 layout.tsx에 스크립트
- [x] **자사 배너**: `src/data/ads.ts` 구조 및 주석 (배너 추가 방법 명시)
- [x] 광고 슬롯 배치: 홈, 툴 페이지, 장사 팁 목록·상세, 푸터

### 문서화
- [x] TOOLSAJANG_SPEC.md (마스터 스펙, 장사 팁·AI 툴·로드맵 반영)
- [x] CLAUDE.md (AI 에이전트 가이드)
- [x] docs/TOOL_MODULE_PARALLEL_DESIGN.md (병렬 개발 설계)
- [x] docs/DEPLOY.md (GitHub·Vercel 배포 가이드)
- [x] docs/SEO_SUBMIT.md (Google/네이버 사이트 등록, sitemap 제출, 동적 OG 이미지 안내 — 보완 완료)
- [x] 각 툴 폴더별 README.md

### 테스트
- [x] Vitest 설치 및 설정 (`vitest.config.ts`, package.json test 스크립트)
- [x] 마진 계산기 단위 테스트 (`src/tools/margin-calculator/calculation.test.ts`) — 11개 테스트
- [x] 부가세 계산기 단위 테스트 (`src/tools/vat-calculator/calculation.test.ts`) — 14개 테스트
- [x] 손익분기점 계산기 단위 테스트 (`src/tools/break-even-calculator/calculation.test.ts`) — 12개 테스트
- [x] 급여 계산기 단위 테스트 (`src/tools/salary-calculator/calculation.test.ts`) — 12개 테스트
- [x] 할인율 계산기 단위 테스트 (`src/tools/discount-calculator/calculation.test.ts`) — 14개 테스트
- [x] 대출 이자 계산기 단위 테스트 (`src/tools/loan-calculator/calculation.test.ts`) — 12개 테스트
- [x] 배달앱 수수료 계산기 단위 테스트 (`src/tools/delivery-fee-calculator/calculation.test.ts`) — 14개 테스트
- [x] 매출 목표 계산기 단위 테스트 (`src/tools/sales-target-calculator/calculation.test.ts`) — 10개 테스트
- [x] 임대료 비율 계산기 단위 테스트 (`src/tools/rent-ratio-calculator/calculation.test.ts`) — 13개 테스트
- [x] 할인가 역산 계산기 단위 테스트 (`src/tools/discount-price-calculator/calculation.test.ts`) — 10개 테스트
- [x] D-day 계산기 단위 테스트 (`src/tools/dday-calculator/calculation.test.ts`) — 15개 테스트
- [x] 원가율 계산기 단위 테스트 (`src/tools/food-cost-calculator/calculation.test.ts`) — 14개 테스트
- [x] 글자수 카운터 단위 테스트 (`src/tools/character-counter/calculation.test.ts`) — 21개 테스트
- [x] 재고 회전율 계산기 단위 테스트 (`src/tools/inventory-turnover/calculation.test.ts`) — 12개 테스트
- [x] 평당 임대료 계산기 단위 테스트 (`src/tools/rent-per-pyeong/calculation.test.ts`) — 12개 테스트
- [x] 단가 비교 계산기 단위 테스트 (`src/tools/unit-price-calculator/calculation.test.ts`) — 14개 테스트
- **전체 테스트: 210개 통과 (16개 파일), `pnpm test` 전부 통과 확인**
- 스킵: QR코드 생성기(calculation.ts 없음, UI 전용), 메뉴명 아이디어·가게명 AI (API 의존)

---

## 미완성 / 추후 진행

### Phase 4: 툴 확장 (선택)
- [x] 카테고리 필터 (툴 목록 페이지)
- [x] 매출 목표·임대료 비율·할인가 역산·QR코드·D-day 계산기 (5종 추가 완료)
- [x] 메뉴명 아이디어 툴 (Gemini/Groq/OpenRouter 무료 API 연동, POST /api/tools/menu-ideas)
- [x] 글자수 카운터 (실시간 글자수·바이트수·단어수·줄수 표시, 제한 기준 프로그레스바)
- [x] 가게명 AI 아이디어 (Gemini/Groq/OpenRouter 무료 API 연동, POST /api/tools/shop-name-ideas)
- [x] AI 툴 API Rate Limiting (IP당 분당 5회, in-memory Map 기반, 429 응답 + 한국어 에러)

### Phase 5: 장기 (선택)
- [ ] 로그인·계산 결과 저장
- [ ] **네이버 로그인 (OAuth)** — 추후 구현 예정 (참고: docs/NAVER_LOGIN.md)
- [ ] 유료 프리미엄 툴
- [ ] 사장님 커뮤니티

### 기타
- [ ] AdSense 승인 후 슬롯 ID·환경 변수 설정
- [ ] 자사 배너 이미지·링크 실제 등록 (ads.ts)
- [x] 테스트 코드 — 계산 가능한 툴 16종 단위 테스트 210개 완료 (2026-02-20)
- [x] og:image per page — 홈/툴/팁 동적 OG 이미지 (next/og ImageResponse, 2026-02-19)
- [x] 메뉴명·가게명 API 속도 제한 (IP당 분당 5회, in-memory — 추후 Upstash 전환 가능)
- [ ] Google Search Console·네이버 서치어드바이저 사이트 등록 및 sitemap 제출 (docs/SEO_SUBMIT.md 참고, 코드 측 준비 완료 — 수동 작업 필요)

---

## 현재 상태 요약

| 항목 | 상태 |
|------|------|
| **배포** | Vercel 연동 완료, main 푸시 시 자동 배포 |
| **툴** | 19개 구현 (글자수 카운터, 가게명 AI 아이디어 포함), AI 툴 Rate Limiting 적용 |
| **장사 팁** | 28개 글, 목록/상세/홈 미리보기·가독성 스타일 적용 |
| **OG 이미지** | 홈/툴(19개)/팁(28개) 동적 OG 이미지 자동 생성 (next/og) |
| **SEO** | sitemap.xml, robots.txt, JSON-LD, 동적 OG 이미지, verification meta 슬롯, 전 페이지 OG·canonical 완비 — Search Console/서치어드바이저 등록만 남음 |
| **광고/분석** | GA4·AdSense 스크립트 준비됨 (환경 변수 설정 시 동작) |
| **테스트** | Vitest 설치, 계산기 16종 단위 테스트 210개 전부 통과 (마진·부가세·손익분기점·급여·할인율·대출·배달수수료·매출목표·임대료비율·할인가역산·D-day·원가율·글자수·재고회전율·평당임대료·단가비교) |
