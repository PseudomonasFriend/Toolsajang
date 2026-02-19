# 툴사장 — 작업 현황 (WORK STATUS)

> 최종 업데이트: 2026-02-20 (메뉴명 아이디어 툴·SEO·히스토리 반영)

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
- [x] **장사 팁 글 18개** (가독성 스타일 적용, 단락·줄간격 정리)
- [x] `/blog` → `/tips` 리다이렉트
- [x] **SEO**: `app/sitemap.ts`, `app/robots.ts`, JSON-LD (WebSite, Organization, Article)
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
- [x] 각 툴 폴더별 README.md

---

## 미완성 / 추후 진행

### Phase 4: 툴 확장 (선택)
- [x] 카테고리 필터 (툴 목록 페이지)
- [x] 매출 목표·임대료 비율·할인가 역산·QR코드·D-day 계산기 (5종 추가 완료)
- [x] 메뉴명 아이디어 툴 (Gemini/Groq/OpenRouter 무료 API 연동, POST /api/tools/menu-ideas)
- [ ] 명세 17장 향후 툴: 글자수 카운터, 가게명 AI 아이디어 등

### Phase 5: 장기 (선택)
- [ ] 로그인·계산 결과 저장
- [ ] **네이버 로그인 (OAuth)** — 추후 구현 예정 (참고: docs/NAVER_LOGIN.md)
- [ ] 유료 프리미엄 툴
- [ ] 사장님 커뮤니티

### 기타
- [ ] AdSense 승인 후 슬롯 ID·환경 변수 설정
- [ ] 자사 배너 이미지·링크 실제 등록 (ads.ts)
- [ ] 테스트 코드 (선택)
- [ ] og:image per page (선택)
- [ ] 메뉴명 API 속도 제한 (IP당 N회/분, Upstash 등 — 남용 시 도입)
- [ ] Google Search Console·네이버 서치어드바이저 사이트 등록 및 sitemap 제출 (docs/SEO_SUBMIT.md 참고)

---

## 현재 상태 요약

| 항목 | 상태 |
|------|------|
| **배포** | Vercel 연동 완료, main 푸시 시 자동 배포 |
| **툴** | 13개 구현·배포 (카테고리 필터, 메뉴명 AI 툴 포함) |
| **장사 팁** | 18개 글, 목록/상세/홈 미리보기·가독성 스타일 적용 |
| **SEO** | sitemap.xml, robots.txt, JSON-LD 적용 |
| **광고/분석** | GA4·AdSense 스크립트 준비됨 (환경 변수 설정 시 동작) |
