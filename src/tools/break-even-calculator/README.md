# 손익분기점 계산기 (break-even-calculator)

> 고정비와 변동비를 기반으로 **몇 개 팔아야 본전인지** 계산하는 툴.

## 공통 규칙

- `CalculatorLayout` 래퍼 사용 (페이지에서 감싸므로 컴포넌트 내부에서는 불필요)
- 모바일 퍼스트 (max-width 480px)
- Tailwind CSS only, TypeScript strict, `any` 금지
- 모든 텍스트/주석 한국어
- 컬러: Primary `blue-600`, 이익 `green-600`, 적자 `red-500`, BG `gray-50`, 카드 `white`, 텍스트 `gray-900`, 보조 `gray-500`, 테두리 `gray-200`

## 기능 설명

자영업자가 월 고정비(임대료, 인건비 등)와 상품당 변동비를 입력하면, 손익분기점(BEP) 판매 수량과 매출액을 계산한다.

## 입력 필드

| 필드명 | 키 | 타입 | 필수 | 단위 | 기본값 |
|--------|-----|------|------|------|--------|
| 상품 판매가 | sellingPrice | number | O | 원 | 0 |
| 상품당 변동비 | variableCost | number | O | 원 | 0 |
| 월 고정비 | fixedCost | number | O | 원 | 0 |

- 판매가: 소비자에게 파는 개당 가격
- 변동비: 상품 1개당 원가 + 수수료 + 포장 등 변동 비용
- 고정비: 월 임대료 + 인건비 + 공과금 등 고정 지출

## 출력 항목

| 항목 | 키 | 계산식 |
|------|-----|--------|
| 개당 공헌이익 | contributionMargin | 판매가 - 변동비 |
| 공헌이익률 | contributionRate | (공헌이익 / 판매가) × 100 |
| BEP 수량 | breakEvenQuantity | ceil(고정비 / 공헌이익) |
| BEP 매출액 | breakEvenRevenue | BEP 수량 × 판매가 |

## 계산 로직

```
공헌이익 = 판매가 - 변동비
공헌이익률 = (공헌이익 / 판매가) × 100  (소수점 1자리)

if 공헌이익 <= 0:
  BEP 수량 = 0 (계산 불가 — 경고 표시)
  BEP 매출 = 0
else:
  BEP 수량 = ceil(고정비 / 공헌이익)
  BEP 매출 = BEP 수량 × 판매가
```

## UI 요구사항

- **입력 영역**: 3개 필드를 카드(`rounded-xl bg-white p-5 shadow-sm`) 안에 배치
  - 각 필드: 라벨 + ₩ 접두사 입력칸, `inputMode="numeric"`, 콤마 자동 포맷
  - 입력 필드 높이 48px, 텍스트 18px+
  - 각 필드 아래 작은 힌트 텍스트 (`text-xs text-gray-400`)
    - 판매가: "개당 판매 가격"
    - 변동비: "원가 + 수수료 + 포장비 등"
    - 고정비: "임대료 + 인건비 + 공과금 등 (월)"
- **실시간 계산**: 판매가 + 변동비 + 고정비 모두 입력 시 즉시 결과 표시
- **경고**: 공헌이익이 0 이하면 `bg-red-50 text-red-600` 경고 ("판매가가 변동비보다 높아야 합니다")
- **결과 영역**: 카드 안에 표시
  - BEP 수량: 가장 크게 `text-2xl font-bold` + "개" 단위
  - BEP 매출액: `text-xl font-bold` + ₩ 포맷
  - 공헌이익, 공헌이익률: 보조 정보 (`text-sm`)
  - 구분선 `<hr>` 으로 주요/보조 결과 분리
- **초기화 버튼**: 모든 입력값 기본값으로 리셋
- **결과 복사**: "손익분기점 N개 / BEP 매출 ₩X / 공헌이익 ₩Y (Z%)" 형태

## index.ts export 형식

```typescript
import type { Tool } from '@/types';
import BreakEvenCalculator from './BreakEvenCalculator';

export const meta: Tool = {
  slug: 'break-even-calculator',
  name: '손익분기점 계산기',
  description: '얼마나 팔아야 본전인지 계산',
  icon: 'TrendingUp',
  category: '재무/회계',
  isNew: true,
  isActive: true,
};

export const seo = {
  title: '손익분기점 계산기 - 무료 온라인 BEP 계산',
  description: '고정비와 변동비를 입력하면 손익분기점 판매 수량과 매출액을 즉시 계산합니다.',
};

export const Component = BreakEvenCalculator;
```

## 참고: 사용하는 공통 유틸

- `@/lib/format` — `formatNumber`, `parseNumber`, `formatPercent`
- `@/lib/utils` — `cn` (Tailwind 클래스 조건부 결합)

## 파일 구조

```
src/tools/break-even-calculator/
  README.md                ← 이 파일
  types.ts                 ← BreakEvenInput, BreakEvenOutput 타입
  calculation.ts           ← calculateBreakEven() 함수
  BreakEvenCalculator.tsx  ← UI 컴포넌트 ('use client')
  index.ts                 ← meta, seo, Component export
```
