# DEV_HISTORY.md — 툴사장 (Toolsajang) 개발 저널

> **목적:** 개발 과정의 의사결정, 시행착오, 기술적 논리를 기록하는 저널.
> 포트폴리오 및 회고 자료로 활용.

---

## 기록 규칙 (모든 프로젝트 공통)

> **서브에이전트는 작업 완료 후 반드시 이 규칙에 따라 기록할 것.**

### 엔트리 형식

```markdown
## YYYY-MM-DD: [작업 제목]

### 무엇을 했는가 (What)
- 구현/변경한 내용을 구체적으로 기술
- 수정된 파일 목록 포함

### 왜 이렇게 했는가 (Why)
- 이 작업이 필요했던 배경/이유
- 사용자 요구사항 또는 기술적 필요성

### 의사결정 & 논리 (Decision)
- 여러 선택지 중 왜 이 방법을 선택했는지
- 대안과 비교한 트레이드오프
- 참고한 자료나 근거

### 시도했지만 폐기한 것 (Rejected Alternatives)
- (해당 시) 시도했다가 실패하거나 폐기한 접근법
- 왜 안 됐는지, 무엇을 배웠는지

### 결과 & 배운 점 (Outcome)
- 최종 결과물 상태
- 향후 주의사항이나 개선 포인트
```

### 기록 원칙

1. **즉시 기록** — 작업 완료 직후 기록. 기억이 선명할 때 남긴다.
2. **WHY 중심** — "무엇을 했는가"보다 "왜 이렇게 했는가"가 더 중요.
3. **실패도 기록** — 시도했다가 안 된 것도 가치 있는 기록. 같은 실수를 반복하지 않기 위해.
4. **구체적으로** — "성능 개선함" ✗ → "Supabase 쿼리를 배치 처리로 변경하여 API 호출 14→3회로 감소" ✓
5. **날짜 역순** — 최신 기록이 위로.

---

## 2026-02-20: 단위 테스트 확장 — 계산기 16종 210개 테스트 완성

### 무엇을 했는가 (What)

- 기존 3종(마진·부가세·손익분기점) 37개 테스트에서 13종 추가, 총 16종 210개로 확장
- 신규 테스트 파일 13개 생성:
  - `src/tools/salary-calculator/calculation.test.ts` — 12개 (급여·4대보험·실수령액)
  - `src/tools/discount-calculator/calculation.test.ts` — 14개 (할인율·마진변화·필요판매량)
  - `src/tools/loan-calculator/calculation.test.ts` — 12개 (원리금균등·원금균등·스케줄)
  - `src/tools/delivery-fee-calculator/calculation.test.ts` — 14개 (플랫폼별 수수료·findBestPlatformIndex)
  - `src/tools/sales-target-calculator/calculation.test.ts` — 10개 (필요매출 역산·엣지케이스)
  - `src/tools/rent-ratio-calculator/calculation.test.ts` — 13개 (비율·low/normal/high 판정)
  - `src/tools/discount-price-calculator/calculation.test.ts` — 10개 (할인가·소수점 반올림)
  - `src/tools/dday-calculator/calculation.test.ts` — 15개 (미래/과거/오늘·요일·잘못된 날짜)
  - `src/tools/food-cost-calculator/calculation.test.ts` — 14개 (원가율·권장가·diagnosisLevel)
  - `src/tools/character-counter/calculation.test.ts` — 21개 (한글바이트·줄수·단어수)
  - `src/tools/inventory-turnover/calculation.test.ts` — 12개 (회전율·보유일수·진단등급)
  - `src/tools/rent-per-pyeong/calculation.test.ts` — 12개 (평↔m² 환산·평당임대료·비율)
  - `src/tools/unit-price-calculator/calculation.test.ts` — 14개 (단가·최저가·차이율)
- `WORK_STATUS.md` 테스트 현황 업데이트

### 왜 이렇게 했는가 (Why)

- 19개 툴 중 계산 로직이 있는 16종에 대해 회귀 테스트 커버리지 확보
- 향후 요율 변경(급여), 수수료 변경(배달앱), 공식 수정 시 빠른 검증이 가능하도록
- QR코드 생성기(UI 전용, calculation.ts 없음)와 AI 툴 2종(API 의존)은 스킵

### 의사결정 & 논리 (Decision)

- 기존 3개 테스트 파일의 패턴을 완전히 동일하게 따름: `describe` 중첩 + 한국어 설명 + 엣지케이스
- 각 테스트에 실제 소상공인 시나리오 1~2개 포함하여 현실성 확보
- 반올림 오차가 있는 케이스는 `toBeCloseTo` 대신 구체적 계산값을 직접 검증

### 시도했지만 폐기한 것 (Rejected Alternatives)

- `rent-per-pyeong` 테스트에서 `sqm` 입력값을 그대로 expect했으나, 계산 함수가 소수점 1자리로 반올림하여 33.06 → 33.1이 됨. 실제 함수 동작에 맞게 수정.

### 결과 & 배운 점 (Outcome)

- `pnpm test` 실행 결과: 16개 파일, 210개 테스트 전체 통과
- 계산 함수 내부에서 `Math.round(x * 10) / 10` 패턴(소수점 1자리)이 일관되게 사용되므로, 테스트 작성 시 반올림 결과를 미리 수동 계산하여 검증해야 함

---

## 2026-02-20: SEO 제출 준비 — 페이지별 OG 태그, canonical, sitemap 개선

### 무엇을 했는가 (What)

- `src/app/page.tsx` — 홈 페이지에 `metadata` export 추가 (canonical URL)
- `src/app/tools/page.tsx` — `openGraph` (title, description, url, type) + `alternates.canonical` 추가
- `src/app/tips/page.tsx` — `openGraph` + `alternates.canonical` 추가
- `src/app/about/page.tsx` — `openGraph` + `alternates.canonical` 추가
- `src/app/privacy/page.tsx` — `robots: { index: false, follow: false }` 추가
- `src/app/terms/page.tsx` — `robots: { index: false, follow: false }` 추가
- `src/app/sitemap.ts` — 팁 `lastModified`를 MDX 프론트매터 `date` 값으로 개선, `privacy`·`terms` 제외, 툴 페이지 changeFrequency `'monthly'`로 조정
- `.env.local.example` 신규 생성 — Google/Naver 검증키 포함 전체 환경변수 템플릿

### 왜 이렇게 했는가 (Why)

- Google Search Console·네이버 서치어드바이저 등록을 앞두고 코드 측 SEO 설정 완비 필요
- 기존 구현을 점검한 결과 목록/소개 페이지에 `openGraph`와 `canonical`이 누락되어 있었음
- `privacy`·`terms`는 검색 유입이 불필요한 법률 고지 페이지이므로 noindex 처리가 표준 관행
- 환경변수 예시 파일이 없어 Vercel 설정 시 어떤 키가 필요한지 문서화가 부족했음

### 의사결정 & 논리 (Decision)

- **canonical은 절대 URL로**: Next.js `alternates.canonical`에 `NEXT_PUBLIC_SITE_URL` 환경변수 기반 절대 경로 사용. 상대 경로는 CDN 앞에서 올바르게 해석되지 않을 수 있음.
- **홈 페이지는 layout.tsx에 이미 메타가 있으나 페이지 레벨 canonical 추가**: 루트 layout의 `alternates.canonical`이 하위 페이지에도 상속될 수 있어 홈 페이지에 명시적으로 재선언.
- **privacy/terms noindex**: 크롤링 예산 낭비 방지 + 검색 결과 노이즈 제거. 사용자가 검색으로 유입될 필요가 없는 페이지.
- **sitemap에서 privacy/terms 제거**: noindex 페이지를 sitemap에 포함하면 Google에 불일치 신호를 줌 — 두 처리를 일관되게 맞춤.
- **팁 lastModified 개선**: MDX 프론트매터의 `date`를 활용하면 실제 콘텐츠 발행일 기반으로 Google이 크롤 우선순위를 정확히 판단 가능. 기존 `new Date()` (빌드 시간)보다 의미 있는 값.
- **changeFrequency 'weekly' → 'monthly' (툴/팁)**: 계산기 툴과 팁 콘텐츠는 자주 변경되지 않으므로 'monthly'가 실제 업데이트 주기와 맞음. Google은 실제 변경을 기준으로 재크롤하므로 hint 값의 정확성이 중요.

### 결과 & 배운 점 (Outcome)

- `pnpm build` 성공 — 60개 페이지 모두 정상 렌더링 확인
- SEO 코드 측 준비 완전 완비: sitemap, robots, JSON-LD, OG 이미지, verification meta 슬롯, 페이지별 OG·canonical
- 남은 작업: Vercel 환경변수에 `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`, `NEXT_PUBLIC_NAVER_SITE_VERIFICATION` 설정 후 Search Console·서치어드바이저에서 소유권 확인 버튼 클릭 (수동)

---

## 2026-02-19: SEO 제출 가이드 보완 + 계산 로직 단위 테스트 추가

### 무엇을 했는가 (What)

**docs/SEO_SUBMIT.md 보완**
- 기존 파일 내용 확인 후 누락된 항목 추가
- 섹션 3: 동적 OG 이미지 안내 — next/og ImageResponse 기반 홈/툴/팁 동적 OG 이미지 적용 현황 정리
- 섹션 4: sitemap.xml 구조 표 추가 — URL 유형별 예시
- 섹션 5(체크리스트): Vercel 환경 변수 항목, view-source 확인 방법, SNS OG 이미지 확인 항목 추가
- 섹션 6(참고 링크): Facebook OG 디버거, 카카오 OG 캐시 초기화 링크 추가

**app/layout.tsx 확인**
- 이미 `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`, `NEXT_PUBLIC_NAVER_SITE_VERIFICATION` 환경 변수 조건부 meta 태그 구현 완료 상태 (추가 코드 변경 불필요)

**Vitest 단위 테스트 추가**
- `vitest`, `@vitest/coverage-v8` dev dependency 설치
- `vitest.config.ts` 신규 생성 — Node 환경, `@/` alias, `src/**/*.test.ts` 패턴
- `package.json` test 스크립트 추가 (`test`, `test:watch`, `test:coverage`)
- `src/tools/margin-calculator/calculation.test.ts` — 11개 테스트
  - 기본 마진(부가세 미포함), 수수료, 배송비·기타비용, 부가세 포함, 마크업률, 실제 시나리오
- `src/tools/vat-calculator/calculation.test.ts` — 14개 테스트
  - toTotal(공급가액→합계), toSupply(합계→공급가액), 왕복 일관성, 실제 시나리오
- `src/tools/break-even-calculator/calculation.test.ts` — 12개 테스트
  - 기본 BEP 수량(올림 처리), 공헌이익률(소수점 반올림), 공헌이익 0 이하 처리, 카페·편의점 시나리오

### 왜 이렇게 했는가 (Why)

- SEO_SUBMIT.md는 이미 존재했지만 동적 OG 이미지(2026-02-19 추가) 내용이 반영되지 않아 문서-코드 간 불일치 상태
- 계산 로직(calculation.ts)은 툴의 핵심 비즈니스 로직이나 테스트 코드가 전혀 없어 변경 시 회귀 오류 위험 존재
- WORK_STATUS.md의 "기타" 섹션에 테스트 코드가 "(선택)" 항목으로 기재되어 있어 이번에 이행

### 의사결정 & 논리 (Decision)

- **Vitest 선택**: Next.js 프로젝트에서 Jest 대비 설정이 간단하고 빠름. `vitest.config.ts`에서 `@/` alias 지원으로 기존 import 경로 그대로 사용 가능.
- **Node 환경 (`environment: 'node'`)**: 계산 로직만 테스트하므로 DOM 불필요. jsdom 대비 빠름.
- **3개 툴 선정**: 마진·부가세·손익분기점은 사용 빈도가 높고 계산 로직이 엣지 케이스(ZeroDivision, 반올림, 음수)를 포함하여 테스트 가치가 높음.
- **실제 소상공인 시나리오 테스트 포함**: 단순 숫자 검증을 넘어 실제 사용 맥락(카페 아메리카노 BEP, 카드 매출 역산 등)에서 계산이 정확한지 검증.
- **`replace_all: false`로 단일 Edit**: 파일 구조 변경 없이 섹션만 추가·수정하여 기존 내용 보존.

### 결과 & 배운 점 (Outcome)

- `pnpm test` 결과: 3개 파일, 37개 테스트 모두 통과 (198ms)
- `pnpm build` 성공 — 테스트 파일이 Next.js 빌드에 영향 없음 (`vitest.config.ts`로 분리)
- `tsconfig.json`의 `include: ["**/*.ts"]` 패턴이 `*.test.ts`도 포함하므로 TypeScript strict mode 적용됨 — 테스트 코드도 타입 안전성 보장

---

## 2026-02-19: OG 이미지 자동 생성 + 장사 팁 콘텐츠 추가 (5개)

### 무엇을 했는가 (What)

**OG 이미지 자동 생성 (next/og ImageResponse API)**
- `src/app/opengraph-image.tsx` 신규 생성 — 홈페이지 기본 OG 이미지
  - blue-600 그라디언트 배경, "🧮 툴사장" 로고, 소개 문구, 태그 배지
  - 1200×630 PNG, edge runtime
- `src/app/tools/[slug]/opengraph-image.tsx` 신규 생성 — 툴 페이지별 동적 OG 이미지
  - 카테고리별 배경색: 재무/회계(파랑), 매장운영(초록), 마케팅(보라), 유틸리티(황갈)
  - 툴 이름(72px) + 설명 + 카테고리 뱃지 + 무료/로그인불필요 배지
  - nodejs runtime (`getToolModule`이 ComponentType 포함하여 edge 불가)
- `src/app/tips/[slug]/opengraph-image.tsx` 신규 생성 — 팁 페이지별 동적 OG 이미지
  - 카테고리별 배경색: 경영기초(파랑), 매장운영(초록), 마케팅(보라), 세금/회계(황갈), 인사/노무(핑크)
  - 글 제목(58~68px, 길이에 따라 조정) + 설명(80자 이상 말줄임) + 날짜 + 카테고리
  - nodejs runtime (`getTipBySlug`가 fs 모듈 사용)

**장사 팁 콘텐츠 5개 추가** (총 18개 → 23개)
- `sns-marketing-beginner.mdx` — 소셜미디어 마케팅 초보 사장님 가이드 (마케팅)
- `delivery-review-management.mdx` — 배달앱 리뷰 관리 노하우 (마케팅)
- `loyal-customer-tips.mdx` — 단골 고객 만드는 실전 방법 (마케팅)
- `seasonal-sales-strategy.mdx` — 계절별 매출 변동 대응 전략 (경영 기초)
- `interior-cost-saving.mdx` — 매장 인테리어 비용 절약 팁 (매장 운영)

### 왜 이렇게 했는가 (Why)

- OG 이미지가 없으면 SNS 공유 시 기본 이미지(또는 없음)로 표시되어 클릭률이 낮아짐
- 페이지별 동적 OG 이미지는 각 툴·팁의 정체성을 SNS 카드에 바로 전달하여 SEO·공유 임팩트 극대화
- 장사 팁 콘텐츠는 SEO 장기 유입(검색)과 재방문 유인을 위한 핵심 자산

### 의사결정 & 논리 (Decision)

- **next/og ImageResponse API 선택**: Vercel에서 공식 지원, 서버 렌더링 PNG 생성. 별도 이미지 파일 관리 불필요. `opengraph-image.tsx` 파일 규칙으로 Next.js가 자동으로 해당 URL에 연결.
- **edge vs nodejs runtime**:
  - 홈 OG 이미지: edge 사용 가능 (외부 데이터 없음)
  - 툴·팁 OG 이미지: nodejs 사용 필요. `getToolModule()`은 ComponentType(React 컴포넌트)을 포함하고, `getTipBySlug()`는 Node.js `fs` 모듈 사용 → edge runtime 불가.
- **카테고리별 배경색**: 툴/팁을 한 눈에 구분 가능하게. 동일한 파란색보다 카테고리 색상이 있으면 SNS 피드에서 식별성 향상.
- **제목 폰트 크기 동적 조정**: 긴 제목(20자 초과)은 58px, 짧은 제목은 68px. OG 이미지 내 텍스트 오버플로 방지.
- **팁 5개 선정 기준**: 마케팅 3개(SNS 입문/배달 리뷰/단골) + 경영1개(계절 매출) + 매장운영1개(인테리어). 기존에 없던 실전 주제로 검색 키워드 다양화.

### 시도했지만 폐기한 것 (Rejected Alternatives)

- **`generateImageMetadata` 사용**: 단일 OG 이미지만 생성할 경우 불필요한 복잡도 추가. 기본 export만으로 충분. `generateImageMetadata`를 쓰면 기본 함수에 `id` prop도 추가 필요.
- **정적 OG 이미지(`/public/og/*.png`)**: 19개 툴 + 23개 팁에 각각 이미지를 만들고 관리해야 해 비효율. 동적 생성이 확장성 면에서 우월.

### 결과 & 배운 점 (Outcome)

- OG 이미지: 홈 1개 + 툴 19개 + 팁 23개 = 총 43개 페이지에 동적 OG 이미지 자동 생성
- 장사 팁: 18개 → 23개로 확대
- next/og의 `ImageResponse`는 JSX 스타일 작성 시 `display: 'flex'`가 기본이며, Tailwind 클래스가 아닌 인라인 style 객체 필수 사용
- edge runtime에서는 Node.js 빌트인 모듈(`fs`, `path`) 사용 불가 — 데이터 파일을 읽는 함수를 포함하는 경우 반드시 nodejs runtime 지정 필요

---

## 2026-02-19: AI 툴 API Rate Limiting 구현

### 무엇을 했는가 (What)

- `src/lib/rate-limit.ts` 신규 생성 — In-memory Map 기반 Rate Limiter 유틸리티
  - `RateLimiter` 인터페이스 정의 (추후 Upstash 교체 가능한 구조)
  - `createRateLimiter({ windowMs, maxRequests })` 팩토리 함수 구현
  - `getClientIp(request)` 함수 — `x-forwarded-for` / `x-real-ip` 헤더 순서로 IP 추출
  - 만료 엔트리 자동 GC (`setInterval`, `windowMs * 2` 주기)
- `src/app/api/tools/menu-ideas/route.ts` — Rate Limiter 적용
  - IP당 분당 5회 제한, 초과 시 429 + `Retry-After` / `X-RateLimit-*` 헤더 포함
  - 한국어 에러 메시지: "요청이 너무 많습니다. 잠시 후 다시 시도해 주세요."
- `src/app/api/tools/shop-name-ideas/route.ts` — 동일 Rate Limiter 적용
- `src/tools/menu-name-ideas/MenuNameIdeas.tsx` — 429 응답 시 `Retry-After` 초를 포함한 사용자 친화적 메시지 표시
- `src/tools/shop-name-ideas/ShopNameIdeas.tsx` — 동일 429 처리 적용

### 왜 이렇게 했는가 (Why)

- 무료 LLM API(Gemini, Groq, OpenRouter)를 사용하는 AI 툴 2개가 남용될 경우 API 쿼터 소진 위험 존재
- 서비스 비용 없이 남용 방지 필요 → 속도 제한 도입

### 의사결정 & 논리 (Decision)

- **In-memory 방식 선택**: Upstash Redis 대비 외부 서비스 가입·환경변수 불필요. Vercel 서버리스에서도 동작.
  - 트레이드오프: 콜드 스타트 시 카운터 리셋 (허용 범위). 동시 인스턴스 간 공유 불가.
  - 추후 Upstash 전환 시 `RateLimiter` 인터페이스만 구현하면 API 라우트 변경 없이 교체 가능하도록 설계.
- **분당 5회 제한**: AI API 응답 시간(5~15초)을 감안하면 정상 사용에서는 거의 도달하지 않는 수치. 봇 남용 방지에 적합.
- **`Retry-After` 헤더 포함**: HTTP 429 표준 권고사항. 프론트엔드에서 정확한 대기 시간을 사용자에게 안내 가능.
- **각 라우트 파일에 개별 인스턴스**: 두 AI 툴은 독립적인 API이므로 제한 카운터를 공유하지 않음 (각각 분당 5회 독립 허용).

### 시도했지만 폐기한 것 (Rejected Alternatives)

- Next.js 미들웨어(`middleware.ts`)에서 전역 처리 → AI 라우트만 선택적으로 적용하기 어렵고, 미들웨어는 Edge Runtime이라 Map 기반 in-memory 상태 유지가 불가능.
- 외부 패키지(`express-rate-limit` 등) 사용 → Next.js App Router와 호환성 문제, 의존성 증가 불필요.

### 결과 & 배운 점 (Outcome)

- `pnpm build` 성공. TypeScript strict mode 통과.
- `/api/tools/menu-ideas`, `/api/tools/shop-name-ideas` 두 라우트 모두 Rate Limiter 적용 확인.
- Vercel 서버리스 특성상 인스턴스가 여러 개 뜰 경우 인스턴스 간 카운터 공유 없음 → 실질적으로 분당 5 * N회 허용될 수 있음. 이는 in-memory 방식의 근본적 한계이며, 엄격한 제한이 필요하면 Upstash 전환 필요.

---

## 2026-02-19: Phase 4 — 글자수 카운터 확인 + 가게명 AI 아이디어 구현

### 무엇을 했는가

- **글자수 카운터** 구현 상태 확인: `CharacterCounter.tsx`, `types.ts`, `calculation.ts`, `index.ts` 모두 기존 완료 상태였음. 추가 작업 불필요.
- **가게명 AI 아이디어** 툴 신규 구현:
  - `src/tools/shop-name-ideas/types.ts` — ShopNameInput, ShopNameOutput, BUSINESS_TYPES, TONES 상수
  - `src/tools/shop-name-ideas/ShopNameIdeas.tsx` — UI 컴포넌트 (`use client`)
  - `src/tools/shop-name-ideas/index.ts` — meta, seo, Component export
  - `src/tools/shop-name-ideas/README.md` — 툴 스펙 문서
  - `src/app/api/tools/shop-name-ideas/route.ts` — POST API 라우트
  - `src/lib/llm/types.ts` — ShopNameRequest, ShopNameResponse 타입 추가
  - `src/lib/llm/index.ts` — suggestShopNames 함수 + SHOP_NAME_SYSTEM_PROMPT 추가
  - `src/tools/index.ts` — shopNameIdeas 레지스트리 등록
  - `src/components/tools/ToolCard.tsx` — Store 아이콘 import 추가

### 왜 이렇게 했는가

- 소상공인이 창업 시 가게명을 결정하는 과정에서 아이디어가 필요한 실제 니즈 존재
- 메뉴명 아이디어 툴과 동일한 AI API 폴백 구조를 재사용하여 개발 효율 극대화

### 의사결정 & 논리

- **기존 LLM lib 확장**: 새 lib 파일을 별도로 만들지 않고 `src/lib/llm/index.ts`에 `suggestShopNames` 함수를 추가했다. `parseSuggestions` 공통 함수를 그대로 재사용할 수 있기 때문.
- **별도 시스템 프롬프트**: 가게명은 메뉴명과 다른 특성(상호명 등록 가능성, 브랜드 이미지 고려)이 있어 별도 `SHOP_NAME_SYSTEM_PROMPT` 작성.
- **`concept` 필드 추가**: 메뉴명 툴에 없는 "컨셉/분위기" 입력 필드를 추가. 가게명은 메뉴명보다 브랜드 이미지가 더 중요하기 때문.
- **복사 완료 피드백 추가**: 메뉴명 툴의 단순 복사 버튼보다 개선하여 복사 후 1.5초간 "완료" 텍스트로 시각 피드백 제공.
- **상표 유의사항 안내 박스**: 가게 상호명은 특허청 등록 여부가 중요하므로 안내 박스 추가 (메뉴명 툴에는 없음).

### 시도했지만 폐기한 것

- LLM lib를 별도 파일(`src/lib/llm/shopName.ts`)로 분리하는 방안 → `parseSuggestions` 공통 함수를 공유하려면 exports를 늘려야 하므로 기존 index.ts 내부 확장이 더 깔끔.

### 결과 & 배운 점

- `pnpm build` 성공. 빌드 출력에서 `ƒ /api/tools/shop-name-ideas` 정상 등록 확인.
- 툴 총 19개 구현 완료 (글자수 카운터 포함).
- 메뉴명 아이디어 툴과 가게명 아이디어 툴은 거의 동일한 UI 패턴이라 컴포넌트 복사 후 수정으로 빠르게 구현 가능.

---

## 2026-02-19: 메뉴명 아이디어 AI 툴 + SEO 기반 완성

### 무엇을 했는가
- 메뉴명 아이디어 툴 구현 (Gemini/Groq/OpenRouter 무료 API 연동)
- POST `/api/tools/menu-ideas` API 라우트 생성
- Google Analytics 4 + AdSense 스크립트 준비
- SEO: sitemap.ts, robots.ts, JSON-LD 적용

### 왜 이렇게 했는가
- 소상공인 사장님들이 메뉴 이름을 고민하는 실제 니즈 존재
- AI 기반 툴을 추가하여 플랫폼 차별화
- 수익화를 위한 광고 인프라 선제 준비

### 의사결정 & 논리
- **무료 AI API 사용**: OpenAI/Claude 유료 API 대신 Gemini Flash/Groq 무료 티어 활용
  - 이유: 툴 자체가 무료 서비스이므로 API 비용 최소화 필수
  - 트레이드오프: 품질은 약간 떨어지지만, 메뉴명 아이디어 수준에서는 충분
- **3개 API 폴백 체인**: Gemini → Groq → OpenRouter 순서로 시도
  - 하나가 실패해도 다른 API로 자동 전환

### 결과 & 배운 점
- 13개 툴 + 18개 장사 팁 콘텐츠로 MVP 완성
- Vercel 배포 완료, GA4/AdSense 환경 변수 설정 시 즉시 동작

---

## 2026-02-18: Phase 2 — 장사 팁 MDX 콘텐츠 시스템

### 무엇을 했는가
- 장사 팁 섹션 구축 (`/tips`, `/tips/[slug]`)
- next-mdx-remote + gray-matter로 MDX 콘텐츠 파이프라인
- 장사 팁 글 18개 작성 (가독성 스타일 적용)
- 홈페이지에 최신 3개 미리보기, 네비게이션 반영

### 왜 이렇게 했는가
- 순수 계산기 툴만으로는 SEO 콘텐츠 부족
- 장사 팁 글로 유기적 트래픽 확보 + 사용자 체류 시간 증가
- AdSense 승인을 위해 충분한 콘텐츠 볼륨 필요

### 의사결정 & 논리
- **MDX 선택**: 마크다운 기반이라 글 작성이 빠르고, React 컴포넌트 삽입 가능
- **next-mdx-remote**: contentlayer2 대비 설정이 간단하고 안정적
- **3개마다 광고 슬롯**: 사용자 경험을 해치지 않으면서 수익화 포인트 확보

### 결과 & 배운 점
- 18개 글 + MDX 파이프라인으로 콘텐츠 확장 용이한 구조 완성
- `.tip-content` CSS 클래스로 MDX 렌더링 스타일 통일

---

## 2026-02-17: Phase 1 — 툴 모듈 시스템 + MVP 8개 툴

### 무엇을 했는가
- 툴 모듈 시스템 설계 및 구현 (`src/tools/[slug]/`)
- 동적 라우트 `app/tools/[slug]/page.tsx` + generateStaticParams
- 초기 8개 계산기: 마진, 부가세, 손익분기, 급여, 할인, 대출, 배달수수료, 매출목표
- 공통 레이아웃 (Header, Footer, MobileNav)
- GitHub + Vercel 배포 파이프라인

### 왜 이렇게 했는가
- 소상공인 대상 무료 비즈니스 툴 플랫폼 필요성
- 기존 서비스들은 영어 기반이거나 한국 세금/규정 미반영

### 의사결정 & 논리
- **툴 모듈 시스템** (폴더당 자체 완결):
  - 이유: 서브에이전트가 독립적으로 병렬 개발 가능
  - 각 툴 폴더에 README.md + types + calculation + UI + index
  - 중앙 레지스트리(`src/tools/index.ts`)에서 한 줄로 등록
- **Mobile-first**: 소상공인 사장님들의 주 사용 환경이 모바일
- **Tailwind only**: 스타일 일관성 + 빠른 개발속도
- **pnpm**: npm 대비 디스크 절약 + 속도 우위

### 시도했지만 폐기한 것
- contentlayer2로 장사 팁 구현 시도 → 설정 복잡성으로 next-mdx-remote로 전환

### 결과 & 배운 점
- 툴 추가가 폴더 생성 + registry 한 줄로 끝나는 확장 가능한 구조
- generateStaticParams로 빌드 타임에 모든 툴 페이지 사전 렌더링

---

## 초기 기획 (2026-02 초)

### 프로젝트 시작 배경
- 한국 소상공인(자영업자)을 위한 실용적인 무료 비즈니스 도구 플랫폼
- 로그인 없이 즉시 결과를 주는 것이 핵심 가치
- 광고 수익 기반 무료 모델

### 기술 스택 선택 사유
- **Next.js (App Router)**: SEO 필수 (검색 유입이 핵심), 정적 생성으로 빠른 응답
- **TypeScript strict**: 계산기 로직의 타입 안정성 보장
- **Tailwind CSS**: 모바일 퍼스트 빠른 UI 개발
- **Vercel**: 무료 배포 + Next.js 최적화
- **Pretendard 폰트**: 한국어 가독성 최적화
