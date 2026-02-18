# 툴사장 (ToolSajang) — AI 빌드용 마스터 기획서

> **이 문서는 AI 에이전트가 읽고 바로 개발에 착수할 수 있는 프로젝트 명세서(PRD + Tech Spec)입니다.**
> 모든 개발 작업은 이 문서를 기준으로 진행합니다.
> 문서 내 지시사항은 사람 개발자가 아닌 **AI 코드 생성 에이전트**를 대상으로 작성되었습니다.

---

## 1. 프로젝트 개요

| 항목 | 내용 |
|------|------|
| **프로젝트명** | 툴사장 (ToolSajang) |
| **도메인(예정)** | toolsajang.com (또는 toolsajang.kr) |
| **한줄 소개** | 소상공인/자영업자를 위한 초간단 웹 기반 계산·운영 툴 모음 플랫폼 |
| **핵심 가치** | 로그인 없이, 클릭 한 번으로, 3초 안에 결과를 보여주는 무료 툴 |
| **타겟 유저** | 소상공인, 자영업자, 1인 사업자, 스타트업 대표 |
| **수익 모델** | Google AdSense + 자사 서비스 배너(크로스 프로모션) |
| **브랜딩 문구(예시)** | "사장님 계산은 툴사장에서 끝" · "복잡한 엑셀 대신 3초 계산" |

---

## 2. 타겟 페르소나

| 항목 | 내용 |
|------|------|
| **연령대** | 30~50대 |
| **직업** | 온·오프라인 매장 운영자, 배달 전문점, 온라인 쇼핑몰 셀러 |
| **특징** | 엑셀 계산이 어렵거나 귀찮음. 복잡한 앱 싫어함 |
| **디바이스** | **스마트폰이 주력** (매장/이동 중 사용) |
| **기대** | 숫자 몇 개 넣으면 바로 답이 나오는 것 |

> **핵심 UX 원칙**: 노안이 있는 50대 사장님도 직관적으로 쓸 수 있는 극도로 단순한 UI.
> 텍스트는 큼직하게, 여백은 넉넉하게, 버튼은 크게.

---

## 3. 핵심 컨셉

- **회원가입 없음** — 모든 툴은 즉시 사용 가능
- **모바일 전용 수준의 설계** — 데스크탑은 모바일 레이아웃이 넓어지는 정도로 충분
- **모듈형 확장** — 각 툴은 독립 모듈. 추가/제거가 다른 코드에 영향 없음
- **실시간 계산** — 입력 즉시 결과 표시 (버튼 클릭 방식도 병행)
- **광고 친화적 구조** — AdSense + 자사 배너 슬롯이 설계 단계부터 반영
- **SEO 최적화** — 콘텐츠 탭으로 검색 유입 확보
- **DB 없이 시작** — 서버 비용 최소화, 정적 생성 우선

---

## 4. 기술 스택

| 분류 | 기술 | 비고 |
|------|------|------|
| **프레임워크** | Next.js 14+ (App Router) | React 기반, SSR/SSG 지원 |
| **언어** | TypeScript (strict mode) | `any` 타입 사용 금지 |
| **스타일링** | Tailwind CSS | 인라인 스타일, CSS Modules 사용 금지 |
| **콘텐츠** | MDX (`next-mdx-remote` 또는 `contentlayer2`) | 마크다운 기반 블로그 |
| **배포** | Vercel | Next.js 최적 배포 환경 |
| **패키지 매니저** | pnpm (권장) 또는 npm | — |
| **광고** | Google AdSense + 커스텀 배너 컴포넌트 | 콘텐츠 + 툴 페이지 |
| **분석** | Google Analytics 4 | 유저 행동 분석 |
| **SEO** | next-sitemap, Next.js Metadata API | 검색 엔진 최적화 |
| **아이콘** | Lucide React | 가볍고 일관된 아이콘셋 |
| **폰트** | Pretendard (한글+영문 겸용) | Google Fonts 또는 CDN |

---

## 5. 사이트 구조 (Site Map)

```
toolsajang.com/
│
├── /                          (홈 — 툴 카드 목록 + 최신 콘텐츠 미리보기)
│
├── /tools                     (툴 전체 목록 페이지)
│   ├── /tools/margin-calculator   (마진 계산기) ← 첫 번째 모듈
│   ├── /tools/[tool-slug]         (추후 추가될 툴들)
│   └── ...
│
├── /tips                      (장사 팁 — 간단한 블로그/게시판)
│   ├── /tips/[slug]               (개별 글 상세)
│   └── ...
│
├── /about                     (서비스 소개)
├── /privacy                   (개인정보처리방침 — AdSense 필수)
├── /terms                     (이용약관 — AdSense 필수)
│
└── /sitemap.xml, /robots.txt  (SEO)
```

---

## 6. 페이지별 상세 기획

### 6.1 공통 레이아웃

#### 헤더 (Header)
- **로고**: "툴사장" 텍스트 로고 (좌측, 클릭 시 홈으로)
- **내비게이션**: 모바일 기준 하단 탭 바 또는 상단 햄버거 메뉴
  - `홈` · `툴` · `장사 팁` · `소개`
- 데스크탑에서는 상단 가로 메뉴로 자연스럽게 전환
- **심플하게** — 메뉴 항목은 4개 이하로 유지

#### 푸터 (Footer)
- 서비스명, 저작권 표시
- 개인정보처리방침 · 이용약관 링크
- 간단한 문의처 (이메일)
- **자사 배너 광고 슬롯 1개** (크로스 프로모션용)

### 6.2 홈페이지 (`/`)

```
┌─────────────────────────────┐
│  🔧 툴사장                    │ ← 헤더
├─────────────────────────────┤
│                             │
│  사장님 계산은                │
│  툴사장에서 끝 ✨             │ ← 히어로 (간결하게)
│                             │
├─────────────────────────────┤
│  📌 인기 툴                  │
│  ┌───────────┐ ┌──────────┐ │
│  │ 🧮 마진    │ │ 💰 부가세 │ │ ← 툴 카드 그리드 (2열)
│  │ 계산기     │ │ 계산기   │ │
│  └───────────┘ └──────────┘ │
│                             │
├── [광고 슬롯 A] ────────────┤ ← AdSense 또는 자사 배너
│                             │
│  📝 장사 팁                  │
│  ┌─────────────────────────┐│
│  │ 마진율과 마크업률 차이... ││ ← 최신 장사 팁 카드 (1열)
│  └─────────────────────────┘│
│  ┌─────────────────────────┐│
│  │ 부가세 간이과세 총정리... ││
│  └─────────────────────────┘│
│                             │
├── [광고 슬롯 B] ────────────┤ ← AdSense 또는 자사 배너
│                             │
│  홈 · 툴 · 장사 팁 · 소개   │ ← 푸터
└─────────────────────────────┘
```

- 툴 카드: 아이콘 + 이름 + 한줄 설명. 탭하면 해당 툴로 이동
- 모바일 2열 그리드, 카드는 터치하기 편한 크기 (최소 높이 80px)

### 6.3 툴 목록 페이지 (`/tools`)
- 전체 툴 카드 그리드 (모바일 2열)
- 상단에 카테고리 탭 (재무/회계, 매장운영, 마케팅, 유틸리티 등)
- `isActive: false`인 툴은 "준비 중" 뱃지로 표시

### 6.4 개별 툴 페이지 (`/tools/[slug]`)

```
┌─────────────────────────────┐
│  ← 뒤로   툴사장             │ ← 헤더
├─────────────────────────────┤
│                             │
│  🧮 마진 계산기               │ ← 툴 제목
│  판매 마진을 한번에 계산하세요  │ ← 한줄 설명
│                             │
│  ┌─────────────────────────┐│
│  │  [툴 UI 컴포넌트 영역]   ││ ← 계산기 본체
│  │  (상세는 섹션 7 참조)    ││
│  └─────────────────────────┘│
│                             │
├── [광고 슬롯] ──────────────┤ ← 결과 하단 광고
│                             │
│  💡 관련 장사 팁             │
│  · 마진율 vs 마크업률 차이   │ ← 장사 팁 글 링크
│  · 배달앱 수수료 완전정복    │
│                             │
├── [자사 배너 슬롯] ─────────┤ ← 크로스 프로모션
└─────────────────────────────┘
```

### 6.5 장사 팁 섹션 (목적 및 운영)

**장사 팁**은 운영자가 간간히 콘텐츠를 발행하는 **간단한 블로그/게시판**이다.

| 목적 | 설명 |
|------|------|
| **콘텐츠 발행** | MDX로 글 작성 후 배포. 가끔 들어가서 새 글 올리는 용도 |
| **AdSense 통과** | 독창적 콘텐츠 확보로 Google AdSense 심사 대비 |
| **유저 가치** | 사장님 대상 실무 팁·정리글 제공 |
| **하단 홍보** | 글 하단에 자사 서비스·배너 등 홍보 영역 활용 |

- 기술적으로는 **블로그**와 동일: 목록 페이지 + 상세 페이지, MDX 본문, 광고 슬롯.
- URL: `/tips` (목록), `/tips/[slug]` (상세). 콘텐츠 파일은 `src/data/tips/` 또는 `src/data/blog/` 에 MDX로 관리.

### 6.6 장사 팁 목록 페이지 (`/tips`)
- 세로 카드 리스트 (모바일 1열)
- 각 카드: 썸네일 + 제목 + 요약 + 날짜
- 카테고리 필터 (가로 스크롤 칩, 선택)
- 글 사이마다 **광고 슬롯** 배치 (매 3~4번째 카드 사이)

### 6.7 장사 팁 상세 페이지 (`/tips/[slug]`)
- MDX 렌더링된 본문
- 본문 중간 광고 (3~4 문단마다 1개)
- 하단: 관련 글 추천 + **광고 슬롯** + **자사 홍보 영역**(배너/크로스 프로모션)
- 공유 버튼 (카카오톡, 링크 복사)
- 목차(TOC)는 글이 길 때만 표시

### 6.8 기타 페이지
- `/about` — 서비스 소개, 만든 이유, 문의처
- `/privacy` — 개인정보처리방침 (AdSense 필수)
- `/terms` — 이용약관 (AdSense 필수)

---

## 7. 첫 번째 모듈: 마진 계산기

### 7.1 기능 요구사항

자영업자가 상품 하나를 팔 때 **실제로 남는 돈**을 계산하는 툴.

#### 입력 항목 (Input)

| 필드명 | 타입 | 필수 | 설명 |
|--------|------|------|------|
| 판매가 | 숫자 (원) | ✅ | 소비자에게 파는 가격 |
| 매입 원가 | 숫자 (원) | ✅ | 상품을 매입하는 비용 |
| 마켓/카드 수수료 | 숫자 (%) | ❌ | 플랫폼·카드사 수수료 (기본값: 0) |
| 배송비 | 숫자 (원) | ❌ | 내가 부담하는 배송비 (기본값: 0) |
| 포장비/기타 비용 | 숫자 (원) | ❌ | 포장재, 부대비용 (기본값: 0) |
| 부가세 포함 여부 | 토글 | ❌ | 판매가에 부가세(10%) 포함 여부 |

#### 출력 항목 (Output)

| 항목 | 계산식 |
|------|--------|
| **순이익 (마진 금액)** | 판매가 - 원가 - 수수료액 - 배송비 - 기타비용 (부가세 고려) |
| **마진율 (%)** | (순이익 / 판매가) × 100 |
| **마크업률 (%)** | (순이익 / 원가) × 100 |
| **수수료 금액** | 판매가 × (수수료율 / 100) |
| **실수령액** | 순이익 (부가세 차감 후) |

### 7.2 계산 로직

```typescript
// /lib/calculations.ts 에 분리하여 관리

interface MarginInput {
  sellingPrice: number;      // 판매가
  costPrice: number;         // 매입 원가
  commissionRate: number;    // 마켓/카드 수수료 (%, 기본값 0)
  shippingCost: number;      // 배송비 (원, 기본값 0)
  otherCost: number;         // 포장비/기타 (원, 기본값 0)
  includeVAT: boolean;       // 부가세 포함 여부
}

interface MarginOutput {
  netProfit: number;         // 순이익
  marginRate: number;        // 마진율 (%)
  markupRate: number;        // 마크업률 (%)
  commissionAmount: number;  // 수수료 금액
  vatAmount: number;         // 부가세 금액
  actualRevenue: number;     // 실수령액
}

function calculateMargin(input: MarginInput): MarginOutput {
  const { sellingPrice, costPrice, commissionRate, shippingCost, otherCost, includeVAT } = input;
  
  // 부가세 포함된 경우, 공급가액 역산
  const supplyPrice = includeVAT ? Math.round(sellingPrice / 1.1) : sellingPrice;
  const vatAmount = includeVAT ? sellingPrice - supplyPrice : 0;
  
  // 수수료 금액 (판매가 기준)
  const commissionAmount = Math.round(sellingPrice * (commissionRate / 100));
  
  // 순이익
  const netProfit = supplyPrice - costPrice - commissionAmount - shippingCost - otherCost;
  
  // 마진율 (판매가 대비)
  const marginRate = supplyPrice > 0 ? (netProfit / supplyPrice) * 100 : 0;
  
  // 마크업률 (원가 대비)
  const markupRate = costPrice > 0 ? (netProfit / costPrice) * 100 : 0;
  
  return {
    netProfit,
    marginRate: Math.round(marginRate * 10) / 10,
    markupRate: Math.round(markupRate * 10) / 10,
    commissionAmount,
    vatAmount,
    actualRevenue: netProfit,
  };
}
```

### 7.3 UI 레이아웃 (모바일 기준)

```
┌─────────────────────────────┐
│  🧮 마진 계산기               │
│  상품 하나 팔면 얼마 남을까?   │
├─────────────────────────────┤
│                             │
│  판매가 *                    │
│  ┌─────────────────────┐    │
│  │ ₩              10,000│    │ ← 큰 입력칸, 숫자 키패드
│  └─────────────────────┘    │
│                             │
│  매입 원가 *                 │
│  ┌─────────────────────┐    │
│  │ ₩               5,000│    │
│  └─────────────────────┘    │
│                             │
│  ▼ 추가 비용 (선택)          │ ← 접이식 영역 (기본 접힘)
│  ┌─────────────────────┐    │
│  │ 수수료      [    3] %│    │
│  │ 배송비  ₩ [  2,500] │    │
│  │ 기타비용 ₩ [    500] │    │
│  └─────────────────────┘    │
│                             │
│  ☐ 판매가에 부가세(10%) 포함  │
│                             │
│  [ 🔄 초기화 ]               │
│                             │
├─ 📊 계산 결과 ──────────────┤
│                             │
│  순이익        ₩ 3,700      │ ← 가장 크고 굵게
│  마진율          37.0%      │
│  마크업률        74.0%      │
│  ─────────────────────      │
│  수수료 금액    ₩ 300       │ ← 보조 정보
│  부가세          ₩ 0        │
│                             │
│  [ 📋 결과 복사 ]            │
│                             │
├── [광고 슬롯] ──────────────┤
│                             │
│  💡 관련 콘텐츠              │
└─────────────────────────────┘
```

### 7.4 UI 동작 규칙
- **실시간 계산**: 판매가 + 원가가 입력되면 즉시 결과 영역에 표시
- **숫자 입력**: 모바일에서 `inputMode="numeric"` 사용, 천단위 콤마 자동 포맷
- **추가 비용 섹션**: 기본 접혀있고, 탭하면 펼쳐짐 (Accordion)
- **결과 복사**: 클립보드에 텍스트로 복사 (예: "판매가 10,000원 / 순이익 3,700원 / 마진율 37.0%")
- **초기화**: 모든 입력값을 기본값으로 리셋
- **음수 결과**: 순이익이 마이너스면 빨간색으로 표시하고 "⚠️ 적자" 메시지

---

## 8. 디자인 가이드라인

### 8.1 디자인 원칙

1. **모바일 퍼스트** — 모바일 레이아웃을 먼저 설계. 데스크탑은 max-width 제한으로 자연스럽게 대응
2. **큰 텍스트, 큰 버튼** — 최소 터치 영역 44px × 44px
3. **여백 넉넉하게** — 답답하지 않은 화면. 콘텐츠 간 간격 충분히
4. **심플** — 장식 요소 최소화. 정보 전달에 집중
5. **광고 공간 확보** — 콘텐츠 흐름을 해치지 않으면서 광고 슬롯 자연스럽게 배치

### 8.2 컬러 팔레트

| 용도 | 색상 | Tailwind 클래스 |
|------|------|----------------|
| Primary | 파란색 | `blue-600` (#2563EB) |
| Primary Hover | 진한 파란 | `blue-700` (#1D4ED8) |
| Accent / CTA | 노란색-주황 | `amber-500` (#F59E0B) |
| 성공/이익 | 초록색 | `green-600` (#16A34A) |
| 경고/적자 | 빨간색 | `red-500` (#EF4444) |
| Background | 밝은 회색 | `gray-50` (#F9FAFB) |
| Surface (카드) | 흰색 | `white` (#FFFFFF) |
| Text Primary | 거의 검정 | `gray-900` (#111827) |
| Text Secondary | 중간 회색 | `gray-500` (#6B7280) |
| Border | 연한 회색 | `gray-200` (#E5E7EB) |

### 8.3 타이포그래피

- **폰트**: Pretendard (한글+영문 겸용)
- **본문**: 16px (1rem) — 모바일에서도 편안하게
- **입력 필드 내 텍스트**: 18px 이상 (사장님 가독성)
- **계산 결과 숫자**: 24px 이상, bold
- **제목 계층**: h1(28px) > h2(22px) > h3(18px)

### 8.4 레이아웃

- **모바일 (기본)**: 단일 컬럼, 최대 너비 100%, 패딩 16px
- **데스크탑**: `max-width: 480px` 중앙 정렬 (모바일 앱 느낌 유지)
  - 블로그 페이지만 `max-width: 720px`로 확장
- **카드**: `rounded-xl`, `shadow-sm`, 패딩 16~20px
- **버튼**: `rounded-lg`, 높이 48px 이상, 폰트 16px bold

### 8.5 반응형 전략

```
모바일 (~767px)     : 기본 레이아웃. 모든 것이 여기에 맞춰짐
태블릿+ (768px~)    : 중앙 정렬 + 좌우 여백 증가. 레이아웃 변화 최소
데스크탑 (1024px~)  : 블로그에서만 2컬럼 (본문 + 사이드 광고) 고려
```

> **핵심**: 데스크탑에서 별도의 복잡한 레이아웃을 만들 필요 없음.
> 모바일 레이아웃이 넓은 화면에서 자연스럽게 보이면 충분함.

---

## 9. 광고 시스템 설계

### 9.1 광고 슬롯 타입

두 가지 타입의 광고를 지원하는 공통 컴포넌트를 만든다.

```typescript
// 광고 슬롯 타입 정의
type AdSlotType = 'adsense' | 'custom';

interface AdSlot {
  type: AdSlotType;
  position: string;        // 예: 'home-mid', 'tool-bottom', 'blog-inline'
  // AdSense인 경우
  adClient?: string;
  adSlot?: string;
  // Custom 배너인 경우
  imageUrl?: string;
  linkUrl?: string;
  altText?: string;
}
```

### 9.2 광고 배치 맵

| 위치 | 페이지 | 슬롯 ID | 기본 타입 | 설명 |
|------|--------|---------|----------|------|
| 홈 중간 | `/` | `home-mid` | AdSense | 툴 카드와 콘텐츠 섹션 사이 |
| 홈 하단 | `/` | `home-bottom` | Custom | 자사 서비스 배너 |
| 툴 결과 하단 | `/tools/*` | `tool-result-bottom` | AdSense | 계산 결과 아래 |
| 툴 페이지 하단 | `/tools/*` | `tool-page-bottom` | Custom | 자사 서비스 배너 |
| 장사 팁 인라인 | `/tips/*` | `tips-inline-{n}` | AdSense | 본문 3~4문단마다 |
| 장사 팁 하단 | `/tips/*` | `tips-bottom` | AdSense | 글 끝 |
| 장사 팁 목록 사이 | `/tips` | `tips-list-{n}` | AdSense | 카드 3~4개마다 |
| 푸터 위 | 공통 | `footer-banner` | Custom | 자사 서비스 크로스 프로모션 |

### 9.3 AdBanner 컴포넌트

```typescript
// /components/common/AdBanner.tsx
// - type이 'adsense'면 Google AdSense 스크립트 렌더링
// - type이 'custom'면 이미지 배너 + 링크 렌더링
// - 모바일에서 화면 폭에 맞는 반응형 사이즈
// - 광고 로딩 전에는 최소 높이 확보 (레이아웃 시프트 방지)
// - '광고' 또는 'AD' 라벨 표시 (정책 준수)
```

### 9.4 커스텀 배너 관리

```typescript
// /data/ads.ts — 자사 배너 데이터 중앙 관리
export const customAds = [
  {
    id: 'my-other-service',
    imageUrl: '/images/ads/other-service-banner.png',
    linkUrl: 'https://my-other-site.com',
    altText: '다른 서비스 홍보 배너',
    position: ['home-bottom', 'footer-banner'],
  },
];
```

> **AI 에이전트 참고**: 광고 슬롯은 빈 상태로 두어도 레이아웃이 깨지지 않도록 설계할 것.
> AdSense 승인 전에는 자사 배너 또는 빈 상태로 운영 가능해야 함.

---

## 10. 툴 모듈 시스템

### 10.1 설계 원칙

- 각 툴은 **독립 모듈**로 설계
- 모든 계산 로직은 **`/lib/calculations.ts`에 분리**
- 모든 툴은 공통 **`CalculatorLayout`** 컴포넌트를 사용
- 새 툴 추가 시 홈 화면과 네비게이션에 **자동 반영**

### 10.2 디렉토리 구조

```
src/
├── app/
│   ├── page.tsx                        # 홈
│   ├── layout.tsx                      # 루트 레이아웃 (AdSense 스크립트 여기서 관리)
│   ├── tools/
│   │   ├── page.tsx                    # 툴 목록
│   │   └── margin-calculator/
│   │       └── page.tsx                # 마진 계산기 페이지
│   ├── tips/
│   │   ├── page.tsx                    # 장사 팁 목록
│   │   └── [slug]/
│   │       └── page.tsx                # 장사 팁 상세
│   ├── about/
│   │   └── page.tsx
│   ├── privacy/
│   │   └── page.tsx
│   └── terms/
│       └── page.tsx
│
├── components/
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── MobileNav.tsx               # 모바일 내비게이션
│   ├── common/
│   │   ├── Card.tsx
│   │   ├── Button.tsx
│   │   ├── Input.tsx                   # 숫자 입력 전용 (콤마 포맷 내장)
│   │   ├── AdBanner.tsx                # 광고 컴포넌트 (AdSense + Custom)
│   │   ├── ShareButton.tsx             # 공유 버튼
│   │   └── CalculatorLayout.tsx        # ★ 툴 공통 레이아웃
│   ├── tools/
│   │   ├── ToolCard.tsx                # 홈/목록용 카드
│   │   └── margin-calculator/
│   │       └── MarginCalculator.tsx     # 마진 계산기 UI
│   └── tips/
│       ├── TipCard.tsx                 # 장사 팁 목록용 카드
│       └── TipContent.tsx              # 장사 팁 본문(MDX) 렌더
│
├── data/
│   ├── tools.ts                        # 툴 메타 정보 (중앙 관리)
│   ├── ads.ts                          # 자사 배너 데이터
│   └── tips/                           # 장사 팁 MDX 콘텐츠
│       └── *.mdx
│
├── lib/
│   ├── calculations.ts                 # ★ 모든 계산 로직 집중
│   ├── mdx.ts                          # MDX 파싱 유틸
│   ├── format.ts                       # 숫자 포맷, 콤마 등
│   └── utils.ts                        # 공통 유틸
│
├── types/
│   └── index.ts                        # 공통 타입 정의
│
└── styles/
    └── globals.css                     # Tailwind 설정 + 글로벌 스타일
```

### 10.3 CalculatorLayout (공통 툴 레이아웃)

모든 툴 페이지는 이 레이아웃을 감싸서 일관된 구조를 유지한다.

```typescript
// /components/common/CalculatorLayout.tsx
interface CalculatorLayoutProps {
  title: string;
  description: string;
  icon: string;
  children: React.ReactNode;          // 툴 본체 UI
  relatedPosts?: BlogPost[];          // 관련 콘텐츠
}

// 렌더링 구조:
// 1. 툴 제목 + 설명
// 2. {children} — 각 툴의 고유 UI
// 3. 광고 슬롯 (tool-result-bottom)
// 4. 관련 콘텐츠 링크
// 5. 광고 슬롯 (tool-page-bottom, 자사 배너)
```

### 10.4 툴 등록 (중앙 관리)

```typescript
// /data/tools.ts
export interface Tool {
  slug: string;          // URL 경로 (예: "margin-calculator")
  name: string;          // 표시 이름 (예: "마진 계산기")
  description: string;   // 한줄 설명
  icon: string;          // Lucide 아이콘명 (예: "Calculator")
  category: ToolCategory;
  isNew?: boolean;       // NEW 뱃지
  isActive: boolean;     // false → "준비 중" 표시
}

export type ToolCategory = '재무/회계' | '매장운영' | '마케팅' | '유틸리티';

export const tools: Tool[] = [
  {
    slug: "margin-calculator",
    name: "마진 계산기",
    description: "상품 하나 팔면 얼마 남는지 바로 계산",
    icon: "Calculator",
    category: "재무/회계",
    isNew: true,
    isActive: true,
  },
  // ⬇️ 새 툴 추가는 여기에 객체만 추가
];
```

### 10.5 새 툴 추가 체크리스트 (AI 에이전트 필독)

새로운 툴을 추가할 때는 반드시 아래 순서를 따른다:

1. `/lib/calculations.ts`에 계산 함수 추가 (입력/출력 인터페이스 포함)
2. `/data/tools.ts`에 툴 메타 정보 객체 추가
3. `/app/tools/[tool-slug]/page.tsx` 생성 — `CalculatorLayout` 사용
4. `/components/tools/[tool-slug]/` 디렉토리에 UI 컴포넌트 작성
5. 페이지에 SEO 메타태그 설정 (`generateMetadata` 또는 `metadata` export)
6. 모바일 화면에서 테스트 (데스크탑은 자연스럽게 따라옴)
7. 광고 슬롯 배치 확인 (`tool-result-bottom`, `tool-page-bottom`)
8. 관련 콘텐츠 연결

---

## 11. 장사 팁(콘텐츠) 시스템

### 11.1 기술 구현
- **포맷**: MDX (Markdown + JSX 컴포넌트 사용 가능)
- **라이브러리**: `next-mdx-remote` 또는 `contentlayer2`
- **파일 위치**: `src/data/tips/` 폴더 내 `.mdx` 파일
- **정적 생성(SSG)**: 빌드 시 HTML 생성 → SEO 최적화

### 11.2 MDX 프론트매터 구조

```yaml
---
title: "마진율과 마크업률의 차이, 사장님이 꼭 알아야 할 것"
description: "마진율과 마크업률 개념을 쉽게 설명합니다."
date: "2025-01-15"
category: "경영 기초"
tags: ["마진", "마크업", "가격 설정", "원가 관리"]
thumbnail: "/images/tips/margin-vs-markup.png"
author: "툴사장"
published: true
relatedTools: ["margin-calculator"]
---
```

### 11.3 콘텐츠 전략 (AdSense 승인 기준)

- **최소 15~20개** 양질의 콘텐츠 확보 후 AdSense 신청
- 각 글 **최소 1,000자 이상**
- **독창적 콘텐츠만** 발행 (복사/무편집 AI 생성 금지)
- 타겟 키워드 예시:
  - "마진 계산기", "자영업 마진 계산", "배달 수수료 계산"
  - "손익분기점 계산법", "부가세 계산", "간이과세 부가세"
- 카테고리:
  - 경영 기초 (마진, 손익분기점, 가격 전략)
  - 세금/회계 (부가세, 종소세, 간이과세)
  - 매장 운영 (배달앱, 임대료, 인건비)
  - 마케팅 (인스타그램, 네이버 플레이스)

---

## 12. SEO 전략

### 12.1 기본 설정
- 모든 페이지에 `title`, `description`, `og:image` 메타태그 설정 (Next.js Metadata API 사용)
- `next-sitemap`으로 sitemap.xml 자동 생성
- `robots.txt` 설정
- 시맨틱 HTML 태그 사용 (h1~h6, article, section, nav, main)

### 12.2 페이지별 SEO

| 페이지 | title 패턴 | description 예시 |
|--------|-----------|------------------|
| 홈 | 툴사장 - 사장님을 위한 무료 비즈니스 툴 | 마진 계산기 등 소상공인에게 필요한 무료 비즈니스 도구 |
| 툴 상세 | {툴이름} - 무료 온라인 계산기 ㅣ 툴사장 | {툴 설명} |
| 장사 팁 글 | {글 제목} ㅣ 툴사장 | {글 description} |

### 12.3 구조화된 데이터 (JSON-LD)
- 홈: `WebSite` + `Organization` 스키마
- 장사 팁: `Article` 스키마
- 툴: `WebApplication` 스키마
- 브레드크럼: `BreadcrumbList` 스키마

---

## 13. Google AdSense 준비 체크리스트

- [ ] 개인정보처리방침 페이지 (`/privacy`)
- [ ] 이용약관 페이지 (`/terms`)
- [ ] 독창적 콘텐츠 15~20개 이상
- [ ] 명확한 사이트 네비게이션
- [ ] 모바일 반응형 디자인
- [ ] About 페이지
- [ ] HTTPS 적용 (Vercel 기본 제공)
- [ ] 빠른 로딩 속도
- [ ] 충분한 운영 기간 (최소 2~4주)

---

## 14. 비기능 요구사항 (성능 기준)

| 항목 | 목표 |
|------|------|
| **Lighthouse 점수** | 90점 이상 (Performance, Accessibility, SEO 모두) |
| **페이지 로딩** | 2초 이내 (FCP 기준) |
| **모바일 최적화** | Google Mobile-Friendly Test 통과 |
| **서버 비용** | Vercel 무료 플랜으로 시작 |
| **DB** | 없음 (1단계에서는 DB 사용하지 않음) |
| **접근성** | 모든 인터랙티브 요소에 aria 레이블 |

---

## 15. 경쟁 사이트 참고

| 사이트 | 특징 | 우리가 차별화할 점 |
|--------|------|-------------------|
| 계산기닷컴 류 | 범용 계산기. 자영업 특화 아님 | 사장님 맞춤 입력값 (수수료, 배송비 등) |
| 네이버 계산기 | 단순 계산만 가능 | 복합 비용 구조 반영 |
| 세무사 블로그 | 정보는 있으나 도구 없음 | 설명 + 바로 쓰는 계산기 결합 |

---

## 16. 개발 로드맵

### 전체 구현 계획 요약

| 단계 | 내용 | 비고 |
|------|------|------|
| **Phase 1** | MVP (툴 + 레이아웃 + 배포) | 툴사장 뼈대, 첫 툴·홈·Vercel |
| **Phase 2** | **장사 팁** + 콘텐츠·SEO·약관 | 간단 블로그/게시판, AdSense 대비 |
| **Phase 3** | 수익화 (GA, AdSense, 자사 배너) | 광고 연동·배치 |
| **Phase 4** | 툴 확장 (부가세, 손익분기점 등) | 카테고리·추가 툴 |
| **Phase 5** | 장기 (로그인, 유료, 커뮤니티 등) | 선택 확장 |

- **장사 팁**: 운영자가 가끔 글 올리는 게시판형 콘텐츠. AdSense 통과용 + 하단 홍보용.

### Phase 1: MVP (최소 기능 제품)
- [ ] Next.js 프로젝트 초기 세팅 (TypeScript, Tailwind, 폴더 구조)
- [ ] 공통 레이아웃 (Header, Footer, MobileNav)
- [ ] 공통 컴포넌트 (Button, Input, Card, AdBanner, CalculatorLayout)
- [ ] 홈페이지
- [ ] 마진 계산기 개발
- [ ] 툴 목록 페이지
- [ ] 모바일 최적화 확인
- [ ] Vercel 배포

### Phase 2: 장사 팁 + 콘텐츠 기반 구축
- [ ] **장사 팁 섹션** 구축
  - [ ] `/tips` 목록 페이지 (카드 리스트, 카테고리 필터)
  - [ ] `/tips/[slug]` 상세 페이지 (MDX 렌더, 광고 슬롯, 하단 홍보 영역)
  - [ ] MDX 파싱·메타 관리 (`src/data/tips/*.mdx`)
  - [ ] 홈에 "장사 팁" 최신 글 미리보기 연동
  - [ ] 네비게이션에 "장사 팁" 메뉴 반영
- [ ] 장사 팁 콘텐츠 15개 이상 작성 (AdSense 심사용)
- [ ] SEO 설정 (sitemap, robots.txt, JSON-LD)
- [ ] 개인정보처리방침 / 이용약관 페이지
- [ ] About 페이지

### Phase 3: 수익화
- [ ] Google Analytics 4 연동
- [ ] Google AdSense 신청 및 연동
- [ ] 자사 배너 시스템 세팅
- [ ] 광고 배치 최적화

### Phase 4: 툴 확장
- [ ] 부가세 계산기
- [ ] 손익분기점 계산기
- [ ] 인건비/4대보험 계산기
- [ ] 카테고리 필터 기능 활성화

### Phase 5 (장기): 성장
- [ ] 로그인 기능 (계산 결과 저장)
- [ ] 유료 프리미엄 툴
- [ ] 사장님 커뮤니티
- [ ] 대출 이자 계산기, 매출 목표 계산기 등 확장

---

## 17. 향후 추가 고려 툴

| 툴 이름 | 설명 | 카테고리 |
|---------|------|----------|
| 부가세 계산기 | 공급가액 ↔ 부가세 포함 금액 변환 | 세금/회계 |
| 손익분기점 계산기 | 고정비, 변동비 기반 BEP 산출 | 재무/회계 |
| 배달앱 수수료 계산기 | 배민/쿠팡이츠 수수료 시뮬레이션 | 매장 운영 |
| 직원 급여 계산기 | 4대보험, 실수령액 계산 | 인사/급여 |
| 대출 이자 계산기 | 원금균등/원리금균등 상환 비교 | 재무/회계 |
| 매출 목표 계산기 | 목표 순이익 → 필요 매출 역산 | 재무/회계 |
| 임대료 비율 계산기 | 매출 대비 임대료 적정 비율 | 매장 운영 |
| QR코드 생성기 | URL → QR코드 이미지 생성 | 마케팅 |
| 글자수 카운터 | 텍스트 글자수/바이트 수 확인 | 유틸리티 |
| **가게명 아이디어** | AI로 업종·키워드 기반 가게명 후보 제안 (무료 API) | 마케팅 |
| **메뉴명 아이디어** | AI로 메뉴/상품 이름 후보 제안 (무료 API) | 마케팅 |

> **AI 툴 참고**: 가게명/메뉴명 아이디어는 무료 AI API(Gemini 등) 호출. 서버에서만 API 키 사용, IP당 요청 제한, 개인정보처리방침에 제3자 AI 이용 명시.

---

## 18. 핵심 규칙 (AI 에이전트 최우선 준수사항)

> 아래 규칙은 모든 코드 생성 시 반드시 따라야 합니다.

1. **모든 텍스트는 한국어**로 작성한다. 코드 주석도 한국어.
2. **TypeScript strict mode**. `any` 타입 사용 금지.
3. **컴포넌트는 함수형** + React Hooks 패턴만 사용.
4. **Tailwind CSS**로만 스타일링. 인라인 스타일, CSS Modules 금지.
5. **모바일 퍼스트**. 데스크탑 별도 레이아웃 불필요. `max-width`로 중앙 정렬만.
6. **모든 계산 로직**은 `/lib/calculations.ts`에 분리.
7. **모든 툴**은 `CalculatorLayout` 공통 레이아웃을 사용.
8. 새 툴 추가 시 반드시 **섹션 10.5의 체크리스트**를 따른다.
9. **SEO metadata**를 각 페이지에 반드시 설정 (Next.js Metadata API).
10. **AdSense 스크립트** 삽입은 `layout.tsx`에서 관리.
11. **광고 슬롯**은 섹션 9.2의 배치 맵을 따른다. 빈 상태에서도 레이아웃 안 깨져야 함.
12. 이미지는 `/public/images/` 하위. Next.js `Image` 컴포넌트 사용.
13. **접근성**: 인터랙티브 요소에 aria 레이블 추가.
14. **성능**: 가능한 서버 컴포넌트 사용. 클라이언트 컴포넌트 최소화.
15. **커밋 메시지**: 한국어, `feat:`, `fix:`, `docs:` prefix 사용.

---

## 19. 환경 변수

```env
# .env.local
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX          # Google Analytics 4
NEXT_PUBLIC_ADSENSE_ID=ca-pub-XXXXXXX   # Google AdSense Publisher ID
NEXT_PUBLIC_SITE_URL=https://toolsajang.com
NEXT_PUBLIC_SITE_NAME=툴사장
```

---

*이 문서는 프로젝트의 단일 진실 원천(Single Source of Truth)입니다.*
*모든 AI 에이전트는 이 문서를 읽고 개발을 시작합니다.*
*최종 수정일: 2025-02-17*
