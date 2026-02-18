# 부가세 계산기 (vat-calculator)

> 공급가액 ↔ 부가세 포함 금액을 간편하게 변환하는 툴.

## 공통 규칙

- `CalculatorLayout` 래퍼 사용 (페이지에서 감싸므로 컴포넌트 내부에서는 불필요)
- 모바일 퍼스트 (max-width 480px)
- Tailwind CSS only, TypeScript strict, `any` 금지
- 모든 텍스트/주석 한국어
- 컬러: Primary `blue-600`, 이익 `green-600`, 적자 `red-500`, BG `gray-50`, 카드 `white`, 텍스트 `gray-900`, 보조 `gray-500`, 테두리 `gray-200`

## 기능 설명

두 가지 방향 계산을 지원:
1. **공급가액 → 부가세, 합계** (공급가액 입력 시)
2. **합계(부가세 포함) → 공급가액, 부가세** (합계 입력 시)

라디오 버튼 또는 탭으로 방향을 선택한다.

## 입력 필드

| 필드명 | 키 | 타입 | 필수 | 단위 | 기본값 |
|--------|-----|------|------|------|--------|
| 계산 방향 | direction | 'toTotal' \| 'toSupply' | O | - | 'toTotal' |
| 금액 | amount | number | O | 원 | 0 |

- `direction = 'toTotal'`: 금액 = 공급가액 → 부가세, 합계를 계산
- `direction = 'toSupply'`: 금액 = 합계(VAT 포함) → 공급가액, 부가세를 역산

## 출력 항목

| 항목 | 키 | 계산식 |
|------|-----|--------|
| 공급가액 | supplyPrice | toTotal: 입력값 / toSupply: round(금액 / 1.1) |
| 부가세 | vatAmount | 공급가액 × 0.1 (toTotal) / 금액 - 공급가액 (toSupply) |
| 합계 | totalPrice | 공급가액 + 부가세 |

## 계산 로직

```
if direction === 'toTotal':
  공급가액 = amount
  부가세 = round(amount × 0.1)
  합계 = amount + 부가세

if direction === 'toSupply':
  공급가액 = round(amount / 1.1)
  부가세 = amount - 공급가액
  합계 = amount
```

## UI 요구사항

- **방향 선택**: 상단에 2개 탭/라디오 ("공급가액 → 합계", "합계 → 공급가액")
  - 탭 스타일: 선택된 탭은 `bg-blue-600 text-white`, 미선택은 `bg-white text-gray-600 border border-gray-200`
  - 최소 높이 44px (터치 타겟)
- **금액 입력**: `inputMode="numeric"`, 천단위 콤마 자동 포맷, ₩ 접두사
  - 입력 필드 높이 48px, 텍스트 18px+
- **실시간 계산**: 금액 입력 즉시 결과 표시
- **결과 영역**: 카드(`rounded-xl bg-white shadow-sm p-5`) 안에 표시
  - 공급가액, 부가세, 합계 각 행: 라벨(좌) + 금액(우, bold)
  - 합계는 가장 크게 (`text-2xl font-bold`)
- **결과 복사**: 클립보드에 텍스트 복사 (예: "공급가액 100,000원 / 부가세 10,000원 / 합계 110,000원")
- **초기화**: 모든 입력값 기본값으로 리셋

## index.ts export 형식

```typescript
import type { Tool } from '@/types';
import VatCalculator from './VatCalculator';

export const meta: Tool = {
  slug: 'vat-calculator',
  name: '부가세 계산기',
  description: '공급가액과 부가세를 간편하게 계산',
  icon: 'Receipt',
  category: '재무/회계',
  isNew: true,
  isActive: true,
};

export const seo = {
  title: '부가세 계산기 - 무료 온라인 부가가치세 계산',
  description: '공급가액에서 부가세와 합계를 계산하거나, 합계 금액에서 공급가액과 부가세를 역산합니다.',
};

export const Component = VatCalculator;
```

## 참고: 사용하는 공통 유틸

- `@/lib/format` — `formatNumber`, `parseNumber`, `formatPercent`
- `@/lib/utils` — `cn` (Tailwind 클래스 조건부 결합)

## 파일 구조

```
src/tools/vat-calculator/
  README.md             ← 이 파일
  types.ts              ← VatInput, VatOutput 타입
  calculation.ts        ← calculateVat() 함수
  VatCalculator.tsx     ← UI 컴포넌트 ('use client')
  index.ts              ← meta, seo, Component export
```
