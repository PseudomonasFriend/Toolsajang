# Toolsajang — 작업 현황

> 최종 업데이트: 2026-02-18

---

## 완료된 작업

### 코어 구조
- [x] Next.js 16 프로젝트 스캐폴드 + 모든 라우팅
- [x] 계산기 모듈 시스템 아키텍처 (5파일 독립 모듈)
- [x] 동적 라우트 + generateStaticParams 빌드 타임 생성
- [x] 중앙 레지스트리 (slug → 모듈 매핑)

### 계산기 (7개)
- [x] 마진 계산기 — UI 완전 구현 (실시간 계산, 아코디언, 클립보드 복사, 리셋, 손실 경고)
- [x] 부가세 계산기 — 계산 엔진 구현
- [x] 손익분기 계산기 — 계산 엔진 구현
- [x] 급여 계산기 — 계산 엔진 구현 (2025년 4대보험 요율)
- [x] 할인 계산기 — 계산 엔진 구현
- [x] 대출 계산기 — 계산 엔진 구현 (원금균등/원리금균등 + 월별 스케줄)
- [x] 배달비 계산기 — 계산 엔진 구현

### 레이아웃
- [x] Header (sticky, 데스크톱 내비), Footer (법적 링크, 배너 슬롯), MobileNav (하단 탭바)
- [x] AdBanner — AdSense ID 미설정 시 안전하게 null 반환
- [x] SEO 메타데이터 패턴 (Next.js Metadata API)

### 페이지
- [x] 홈페이지, 계산기 목록, 소개, 개인정보처리방침, 이용약관

### 문서화
- [x] 19섹션 마스터 스펙 (TOOLSAJANG_SPEC.md)
- [x] AI 에이전트 가이드 (CLAUDE.md)
- [x] 병렬 개발 설계 문서
- [x] 각 계산기별 README.md

---

## 미완성 / 진행 필요 사항

### 최우선순위: 블로그 시스템 (AdSense 승인 차단)
- [ ] MDX 패키지 설치 (`next-mdx-remote` 또는 `contentlayer2`)
- [ ] `src/data/blog/` 디렉토리 + MDX 콘텐츠 파일 작성
- [ ] `/blog/[slug]` 동적 라우트 생성
- [ ] PostCard, PostContent 컴포넌트 제작
- [ ] **최소 15~20개 블로그 글** 작성 (AdSense 승인 요건)

### SEO 인프라
- [ ] `next-sitemap` 설치 → `sitemap.xml` 생성
- [ ] `robots.txt` 파일 추가 (`/public/`)
- [ ] JSON-LD 구조화 데이터 (WebSite, WebApplication, BreadcrumbList)
- [ ] `og:image` 설정

### 광고/분석
- [ ] Google Analytics 연동 (layout.tsx에 GA 스크립트 태그 추가)
- [ ] AdSense ID 환경변수 설정
- [ ] `src/data/ads.ts`에 커스텀 배너 최소 1개 등록

### UI/UX
- [ ] 6개 계산기 UI 구현 확인/완성 (마진 계산기만 확인됨)
- [ ] 공용 `Input.tsx` 컴포넌트 추출 (숫자 콤마 포맷 중복 제거)
- [ ] 계산기 목록 페이지에 카테고리 필터 탭 추가
- [ ] Header와 MobileNav 메뉴 통일 (Header에 "콘텐츠" 누락)

### 설정
- [ ] `next.config.ts` 최적화 설정 추가 (현재 빈 객체)
- [ ] ToolCard 아이콘 맵 동적화 (현재 하드코딩)

---

## 부족한 점

- **블로그 시스템 전무** — AdSense 수익화의 전제 조건이 완전 미구현
- **테스트 코드 없음**
- **6/7 계산기 UI 미확인** — 계산 엔진은 있으나 UI가 스펙대로 완성되었는지 불분명
- **공용 컴포넌트 미완** — spec에 명시된 Button, Card, Input, ShareButton 미존재
- **배포 전 설정 부재** — GA, AdSense, sitemap, robots.txt 모두 미설정
