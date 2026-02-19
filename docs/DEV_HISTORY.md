# 툴사장 개발 히스토리 (DEV_HISTORY)

개발·배포·문서화 등 진행한 작업을 날짜별로 기록하는 로그입니다.

---

## 이 파일 사용법

- **언제**: 작업을 마친 뒤(커밋 전후 무관) 해당 날짜 섹션에 추가합니다.
- **형식**:
  1. **날짜**를 `## YYYY-MM-DD` 제목으로 넣습니다. (같은 날이 이미 있으면 그 아래에 이어서 적습니다.)
  2. **항목별**로 짧은 제목 + 설명을 적습니다. 필요하면 하위 목록으로 세부 내용을 씁니다.
  3. **커밋 해시**나 PR 번호가 있으면 끝에 `(commit: abc123)` 처럼 적어 두면 나중에 추적하기 좋습니다.
- **무엇을 적을지**:
  - 기능 추가·수정·삭제
  - 버그 수정
  - UI/스타일 변경
  - 문서 추가·수정 (스펙, WORK_STATUS, 배포 가이드 등)
  - 배포·환경 설정 (Vercel, GitHub, 환경 변수 등)
  - 의존성 추가·업그레이드
- **예시**:
  ```markdown
  ## 2026-02-20
  - **새 툴 추가**: 매출 목표 계산기 (slug: sales-target-calculator). 입력: 목표 순이익, 고정비, 마진율 → 필요 매출 역산. (commit: xyz789)
  - **문서**: WORK_STATUS.md에 Phase 4 진행 상황 반영.
  ```

---

## 2026-02-20

### 신규 툴 5종 추가
- **매출 목표 계산기** (slug: `sales-target-calculator`): 고정비·목표 순이익·마진율 → 필요 매출 역산. 카테고리: 재무/회계, 아이콘: Target.
- **임대료 비율 계산기** (slug: `rent-ratio-calculator`): 월 매출·월 임대료 → 임대료 비율(%) 및 10~20% 적정/높음 안내. 카테고리: 매장운영, 아이콘: Building2.
- **할인가 역산 계산기** (slug: `discount-price-calculator`): 정가·할인율(%) → 할인 금액·할인가. 카테고리: 재무/회계, 아이콘: Percent.
- **QR코드 생성기** (slug: `qr-generator`): URL/텍스트 입력 → QR 이미지 표시 + PNG 다운로드. `qrcode.react` 사용. 카테고리: 유틸리티, 아이콘: QrCode.
- **D-day / 기간 계산기** (slug: `dday-calculator`): 목표일 선택 → D-day, 요일, "D-n (n일 남음)" 등 표시. 카테고리: 유틸리티, 아이콘: CalendarDays.
- **등록**: `src/tools/index.ts`에 5개 모듈 추가, `ToolCard.tsx`에 Target·Building2·Percent·QrCode·CalendarDays 아이콘 매핑. (commit: fe094cc)

### UI·표시
- **NEW 뱃지**: 신규 툴 5종 메타에 `isNew: true` 추가. (commit: 3c2bcdd)
- **툴 그리드**: 홈·전체 툴 페이지 그리드를 항상 2열로 고정(sm 3열 제거). (commit: 0453189)

### 문서 보정 및 카테고리 필터
- **WORK_STATUS.md**: 툴 7개→12개, Phase 4 카테고리 필터·신규 5툴 완료 반영, 현재 상태 요약 갱신.
- **PROJECT_OVERVIEW.md**: 사이트 구조·폴더 구조에 신규 툴 5종 반영, 구현된 툴 테이블 12개로 확장.
- **툴 목록 카테고리 필터**: `ToolsListWithFilter.tsx` 추가. 전체·재무/회계·매장운영·마케팅·유틸리티 탭으로 필터, `/tools` 페이지에 적용.

### SEO 강화 및 검색 등록 준비
- **루트 레이아웃**: keywords, openGraph(title/description/url/images), twitter card, robots.googleBot, alternates.canonical, Google/Naver 사이트 검증 메타 태그(환경 변수 주입).
- **툴·팁 상세**: generateMetadata에서 openGraph.url, alternates.canonical, 팁은 openGraph.type article·publishedTime 반영.
- **docs/SEO_SUBMIT.md**: 신규 작성. Google Search Console·네이버 서치어드바이저 사이트 등록, 소유 확인(HTML/메타 태그), sitemap 제출, OG 이미지 설정, 점검 체크리스트.
- **docs/DEPLOY.md**: 환경 변수 예시에 검색엔진 검증·OG 이미지·메뉴명 아이디어 툴용 서버 전용 변수 추가, SEO_SUBMIT 링크.

### 메뉴명 아이디어 AI 툴
- **lib/llm**: `src/lib/llm/types.ts`, `providers/gemini.ts`(Gemini REST), `providers/groq.ts`, `providers/openrouter.ts`, `index.ts`의 `suggestMenuNames()` — Gemini → Groq → OpenRouter 순차 폴백.
- **API**: `POST /api/tools/menu-ideas` — body 검증(category, menuType, keywords, tone, count), 400/503 처리.
- **툴 모듈**: `src/tools/menu-name-ideas/` (types, README, MenuNameIdeas.tsx, index.ts). 업종·메뉴 종류·키워드·톤·개수 입력, 추천 리스트·복사·사용 프로바이더 표시. slug: `menu-name-ideas`, 카테고리: 마케팅, 아이콘: Lightbulb.
- **등록**: `tools/index.ts`, ToolCard에 Lightbulb 아이콘 추가.
- **개인정보처리방침**: "3. AI 툴 이용 시 제3자 전송" — 메뉴명 아이디어 등 AI 툴 사용 시 입력이 Google/Groq/OpenRouter로 전송·미보관 안내. 섹션 번호 4~6으로 밀어서 정리.
- **환경 변수 문서**: TOOLSAJANG_SPEC.md 19장, docs/DEPLOY.md에 서버 전용 `GEMINI_API_KEY`, `GROQ_API_KEY`, `OPENROUTER_API_KEY` 설명 추가.

---

## 2026-02-19

### 배포·저장소
- **GitHub 연결**: 원격 저장소 `https://github.com/PseudomonasFriend/Toolsajang.git` 연결, `main` 브랜치 푸시. (이전에 푸시 시 비공개 이메일 정책으로 거절됨 → no-reply 이메일로 커밋 재작성 후 푸시 성공)
- **Vercel 배포**: GitHub 연동으로 main 푸시 시 자동 배포되도록 설정됨. Phase 2·3 커밋 푸시 후 실제 배포 반영 확인(장사 팁 18개 노출).

### Phase 2: 장사 팁 섹션
- **경로**: `/tips`(목록), `/tips/[slug]`(상세). `/blog`는 `/tips`로 리다이렉트.
- **기술**: `next-mdx-remote`, `gray-matter` 설치. `src/lib/tips.ts`에서 MDX 파일 읽기·프론트매터 파싱. `getTipsList`, `getTipBySlug`, `getLatestTips`, `getAllTipSlugs` 제공.
- **데이터**: `src/data/tips/`에 MDX 콘텐츠. 초기 3편(margin-vs-markup, vat-simple-guide, delivery-fee-tips) 후 15편 추가해 **총 18편**.
- **페이지**: `app/tips/page.tsx`(목록, TipCard, 3개마다 광고 슬롯), `app/tips/[slug]/page.tsx`(상세, MDX 렌더, 광고·하단 홍보·관련 글). `generateStaticParams`로 빌드 타임 정적 생성.
- **컴포넌트**: `components/tips/TipCard.tsx`. 상세 본문은 `globals.css`의 `.tip-content`로 스타일 적용.
- **홈·네비**: 홈에 "장사 팁" 섹션 + 최신 3개 미리보기. Header·MobileNav에 "장사 팁" 메뉴 추가(기존 "콘텐츠" 대체).

### 장사 팁 가독성
- **스타일**: `globals.css`에 `.tip-content` 추가. 줄간격(1.85), 단락 여백(1.25em~1.35em), h2/h3 여백·하단 보더, 목록·강조·링크 스타일 정리.
- **본문**: 기존 3편 MDX에 단락 구분(빈 줄) 추가. 15편 신규 글도 동일 톤·길이·단락 구분으로 작성.

### Phase 2: SEO
- **sitemap**: `app/sitemap.ts`에서 `/`, `/tools`, `/tips`, 툴·팁 slug, about/privacy/terms URL 생성.
- **robots**: `app/robots.ts`에서 allow `/`, sitemap URL 반환.
- **JSON-LD**: `components/common/JsonLd.tsx` 추가. 루트 `layout.tsx`에 WebSite·Organization. 장사 팁 상세에 Article.

### Phase 3: 수익화 인프라
- **GA4**: `NEXT_PUBLIC_GA_ID` 설정 시 `layout.tsx`의 `<head>`에 gtag 스크립트 주입.
- **AdSense**: 기존대로 `NEXT_PUBLIC_ADSENSE_ID` 설정 시 AdSense 스크립트 로드.
- **자사 배너**: `src/data/ads.ts`에 커스텀 배너 추가 방법 주석으로 정리. 푸터·홈 하단 등 슬롯 사용.

### 문서
- **WORK_STATUS.md**: Phase 1~3 완료로 갱신. 장사 팁 18개, SEO, GA4/AdSense, 배포 상태 요약. 미완성은 Phase 4·5·AdSense 승인 등으로 정리.
- **PROJECT_OVERVIEW.md**: 상태를 "Vercel 배포 중"으로 수정. 사이트 구조·폴더 구조에 `/tips`, `data/tips`, `lib/tips`, sitemap/robots, 장사 팁 18개 요약 반영.
- **CLAUDE.md**: Key Directories에 tips 관련 경로·`JsonLd` 추가. "장사 팁(Tips)" 섹션 추가. 720px 기준을 tips로 수정.
- **docs/DEPLOY.md**: 상단에 현재 배포 상태( GitHub 연동·main 푸시 시 자동 배포) 문구 추가.
- **TOOLSAJANG_SPEC.md**: 로드맵 Phase 1·2·3 체크박스 완료 처리 및 설명 보강(장사 팁 18개, sitemap/robots/JSON-LD, GA4·AdSense 등).

### 기타
- **next.config.ts**: `transpilePackages: ['next-mdx-remote']` 추가(Turbopack 대응).
- **타입**: `types/index.ts`에 `TipPost`(BlogPost와 동일 구조) 추가.

---

## 2026-02-17 ~ 2026-02-18 (이전 세션 요약)

- **명세**: TOOLSAJANG_SPEC.md에 "장사 팁" 섹션 추가. 사이트맵·네비를 "콘텐츠" → "장사 팁"(/tips)으로 변경. Phase 2 로드맵에 장사 팁 구축·콘텐츠 15개 이상·SEO 등 반영. 향후 툴에 "가게명 아이디어", "메뉴명 아이디어"(AI 툴) 추가.
- **Git**: .gitignore 추가(Next.js·IDE). 저장소 초기화, 첫 커밋. GitHub 원격 연결(HTTPS). 푸시 시 비공개 이메일 거절 → no-reply 이메일로 커밋 재작성 후 푸시 성공.
- **배포 가이드**: docs/DEPLOY.md 작성(GitHub 저장소 생성·푸시, Vercel 연동·배포 절차).

---

## 추가로 할 일 (다음 세션 참고)

- **메뉴명 아이디어 툴**: 배포 환경에 `GEMINI_API_KEY`(필수), `GROQ_API_KEY`·`OPENROUTER_API_KEY`(선택) 설정 후 동작 확인. 미설정 시 "설정된 AI API가 없습니다" 메시지 노출.
- **검색 등록**: Google Search Console·네이버 서치어드바이저에 사이트 등록, 소유 확인 메타 태그(`NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`, `NEXT_PUBLIC_NAVER_SITE_VERIFICATION`) 설정 후 sitemap 제출. 절차는 `docs/SEO_SUBMIT.md` 참고.
- **속도 제한**: 메뉴명 API 남용 시 Upstash 등으로 IP당 N회/분 제한 검토.
- **WORK_STATUS.md** "미완성/추후 진행" 항목: 글자수 카운터·가게명 AI, AdSense 승인·자사 배너, 테스트·og:image 등.

---

*새 작업을 할 때마다 위 "이 파일 사용법"을 참고해 해당 날짜 섹션에 이어서 기록하면 됩니다.*
