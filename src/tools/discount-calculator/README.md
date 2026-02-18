# 할인율 계산기 (discount-calculator)

> 할인 적용 시 **실제 마진이 얼마나 줄어드는지** 시뮬레이션하는 툴.

## 공통 규칙

- `CalculatorLayout` 래퍼 사용 (페이지에서 감싸므로 컴포넌트 내부에서는 불필요)
- 모바일 퍼스트 (max-width 480px)
- Tailwind CSS only, TypeScript strict, `any` 금지
- 모든 텍스트/주석 한국어
- 컬러: Primary `blue-600`, 이익 `green-600`, 적자 `red-500`, CTA `amber-500`, BG `gray-50`, 카드 `white`, 텍스트 `gray-900`, 보조 `gray-500`, 테두리 `gray-200`

## 기능 설명

사장님이 상품을 할인할 때, 원래 마진 대비 할인 후 마진이 얼마나 줄어드는지 한눈에 비교한다.

## 입력 필드

| 필드명 | 키 | 타입 | 필수 | 단위 | 기본값 |
|--------|-----|------|------|------|--------|
| 정상 판매가 | originalPrice | number | O | 원 | 0 |
| 매입 원가 | costPrice | number | O | 원 | 0 |
| 할인율 | discountRate | number | O | % | 0 |

## 출력 항목

| 항목 | 키 | 계산식 |
|------|-----|--------|
| 할인 금액 | discountAmount | round(정상가 × 할인율 / 100) |
| 할인 판매가 | discountedPrice | 정상가 - 할인금액 |
| 원래 마진 | originalMargin | 정상가 - 원가 |
| 원래 마진율 | originalMarginRate | (원래마진 / 정상가) × 100 |
| 할인 후 마진 | discountedMargin | 할인판매가 - 원가 |
| 할인 후 마진율 | discountedMarginRate | (할인후마진 / 할인판매가) × 100 |
| 마진 감소액 | marginDrop | 원래마진 - 할인후마진 |
| 마진 감소율 | marginDropRate | (마진감소액 / 원래마진) × 100 |
| 동일 이익 필요 판매량 증가율 | requiredSalesIncrease | (원래마진 / 할인후마진 - 1) × 100 (할인후마진 > 0일 때) |

## 계산 로직

```
할인금액 = round(정상가 × 할인율 / 100)
할인판매가 = 정상가 - 할인금액

원래마진 = 정상가 - 원가
원래마진율 = (원래마진 / 정상가) × 100   (소수점 1자리)

할인후마진 = 할인판매가 - 원가
할인후마진율 = 할인판매가 > 0 ? (할인후마진 / 할인판매가) × 100 : 0  (소수점 1자리)

마진감소액 = 원래마진 - 할인후마진
마진감소율 = 원래마진 > 0 ? (마진감소액 / 원래마진) × 100 : 0  (소수점 1자리)

필요판매량증가율 = 할인후마진 > 0 ? (원래마진 / 할인후마진 - 1) × 100 : 0  (소수점 1자리)
```

## UI 요구사항

- **입력 영역**: 카드(`rounded-xl bg-white p-5 shadow-sm`) 안에 3개 필드
  - 정상 판매가, 매입 원가: ₩ 접두사, `inputMode="numeric"`, 콤마 자동 포맷
  - 할인율: % 접미사, `inputMode="decimal"`
  - 입력 필드 높이 48px, 텍스트 18px+
- **실시간 계산**: 3개 필드 모두 입력 시 즉시 결과 표시
- **결과 영역**: 두 파트로 구성
  - **비교 카드**: 원래 vs 할인 후를 나란히 비교
    - 왼쪽: "정상가" — 판매가, 마진, 마진율
    - 오른쪽: "할인 후" — 할인판매가, 마진, 마진율
    - 할인 후 마진이 마이너스면 `text-red-500`
  - **핵심 인사이트 카드**:
    - 마진 감소액/감소율
    - "같은 이익을 내려면 판매량을 N% 더 늘려야 합니다" 문구 (할인후마진 > 0일 때)
    - 할인후마진 <= 0이면 `bg-red-50 text-red-600` 경고 ("할인하면 적자입니다")
- **초기화 버튼**: 모든 입력값 기본값으로 리셋
- **결과 복사**: "정상가 ₩X (마진 Y%) → 할인 후 ₩Z (마진 W%) / 마진 감소 N%" 형태

## index.ts export 형식

```typescript
import type { Tool } from '@/types';
import DiscountCalculator from './DiscountCalculator';

export const meta: Tool = {
  slug: 'discount-calculator',
  name: '할인율 계산기',
  description: '할인하면 마진이 얼마나 줄어드는지 비교',
  icon: 'Tag',
  category: '재무/회계',
  isNew: true,
  isActive: true,
};

export const seo = {
  title: '할인율 계산기 - 할인 시 마진 변화 시뮬레이션',
  description: '할인 적용 시 마진이 얼마나 줄어드는지 원래 가격과 비교해 한눈에 확인합니다.',
};

export const Component = DiscountCalculator;
```

## 참고: 사용하는 공통 유틸

- `@/lib/format` — `formatNumber`, `parseNumber`, `formatPercent`
- `@/lib/utils` — `cn`

## 파일 구조

```
src/tools/discount-calculator/
  README.md                ← 이 파일
  types.ts                 ← DiscountInput, DiscountOutput 타입
  calculation.ts           ← calculateDiscount() 함수
  DiscountCalculator.tsx   ← UI 컴포넌트 ('use client')
  index.ts                 ← meta, seo, Component export
```
