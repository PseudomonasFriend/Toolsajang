# 배달앱 수수료 계산기 (delivery-fee-calculator)

> 배달앱 플랫폼별 수수료를 비교하고, 메뉴 하나 팔았을 때 **실제 수령액**을 계산하는 툴.

## 공통 규칙

- `CalculatorLayout` 래퍼 사용 (페이지에서 감싸므로 컴포넌트 내부에서는 불필요)
- 모바일 퍼스트 (max-width 480px)
- Tailwind CSS only, TypeScript strict, `any` 금지
- 모든 텍스트/주석 한국어
- 컬러: Primary `blue-600`, 이익 `green-600`, 적자 `red-500`, BG `gray-50`, 카드 `white`, 텍스트 `gray-900`, 보조 `gray-500`, 테두리 `gray-200`

## 기능 설명

배달 전문점 사장님이 메뉴 가격과 원가를 입력하면, 배민/쿠팡이츠/요기요 각 플랫폼 수수료를 적용한 실수령액을 비교한다. 플랫폼 프리셋을 제공하되 직접 수수료율 입력도 가능.

## 플랫폼 수수료 프리셋 (2025년 기준 참고값)

| 플랫폼 | 중개 수수료 | 비고 |
|--------|-------------|------|
| 배달의민족 (배민1) | 6.8% | 단건 배달 기준 |
| 쿠팡이츠 | 9.8% | 기본 수수료 |
| 요기요 | 12.5% | 기본 수수료 |
| 직접 입력 | 사용자 지정 | 커스텀 |

> 실제 수수료는 광고 상품, 계약 조건에 따라 다를 수 있다는 안내 문구 필수.

## 입력 필드

| 필드명 | 키 | 타입 | 필수 | 단위 | 기본값 |
|--------|-----|------|------|------|--------|
| 메뉴 판매가 | menuPrice | number | O | 원 | 0 |
| 메뉴 원가 | menuCost | number | O | 원 | 0 |
| 배달비 (고객 부담) | deliveryFee | number | X | 원 | 0 |
| 추가 비용 (포장비 등) | additionalCost | number | X | 원 | 0 |

수수료율은 플랫폼 선택 시 자동 설정. "직접 입력" 시 수수료율 필드 표시.

## 출력 항목 (플랫폼별)

| 항목 | 키 | 계산식 |
|------|-----|--------|
| 수수료 금액 | commissionAmount | round(메뉴판매가 × 수수료율 / 100) |
| 실수령액 | netRevenue | 메뉴판매가 - 수수료금액 |
| 순이익 | netProfit | 실수령액 - 원가 - 추가비용 |
| 순이익률 | profitRate | (순이익 / 메뉴판매가) × 100 |

## 계산 로직

```
플랫폼별로 각각 계산:
  수수료금액 = round(메뉴판매가 × 수수료율 / 100)
  실수령액 = 메뉴판매가 - 수수료금액
  순이익 = 실수령액 - 원가 - 추가비용
  순이익률 = 메뉴판매가 > 0 ? (순이익 / 메뉴판매가) × 100 : 0  (소수점 1자리)
```

## UI 요구사항

- **입력 영역**: 카드(`rounded-xl bg-white p-5 shadow-sm`)
  - 메뉴 판매가, 메뉴 원가: ₩ 접두사, `inputMode="numeric"`, 콤마 포맷, 높이 48px
  - 추가 비용 섹션: 접이식 (기본 접힘, Accordion)
    - 배달비(고객 부담), 추가 비용 (포장비 등): ₩ 접두사
- **플랫폼 비교 결과**: 핵심 UI
  - 플랫폼별 카드를 세로로 나열 (배민, 쿠팡이츠, 요기요, 직접 입력)
  - 각 카드: 플랫폼명 + 수수료율 + 수수료금액 + 실수령액 + 순이익
    - 순이익: 가장 크게 `text-xl font-bold`
    - 순이익 마이너스면 `text-red-500`
  - **가장 유리한 플랫폼**에 `border-blue-500 border-2` + "가장 유리" 뱃지 표시
  - "직접 입력" 카드에는 수수료율 입력 필드 포함 (% 접미사, `inputMode="decimal"`)
- **안내 문구**: `text-xs text-gray-400` "실제 수수료는 광고 상품, 계약 조건에 따라 다를 수 있습니다"
- **초기화 버튼**: 모든 입력값 기본값으로 리셋
- **결과 복사**: "메뉴 ₩X / 배민 순이익 ₩A / 쿠팡 순이익 ₩B / 요기요 순이익 ₩C" 형태

## index.ts export 형식

```typescript
import type { Tool } from '@/types';
import DeliveryFeeCalculator from './DeliveryFeeCalculator';

export const meta: Tool = {
  slug: 'delivery-fee-calculator',
  name: '배달앱 수수료 계산기',
  description: '배달앱별 수수료 비교하고 실수령액 확인',
  icon: 'Bike',
  category: '매장운영',
  isNew: true,
  isActive: true,
};

export const seo = {
  title: '배달앱 수수료 계산기 - 배민/쿠팡이츠/요기요 비교',
  description: '배달앱 플랫폼별 수수료를 비교하고 메뉴 하나 팔았을 때 실수령액과 순이익을 계산합니다.',
};

export const Component = DeliveryFeeCalculator;
```

## 참고: 사용하는 공통 유틸

- `@/lib/format` — `formatNumber`, `parseNumber`, `formatPercent`
- `@/lib/utils` — `cn`

## 파일 구조

```
src/tools/delivery-fee-calculator/
  README.md                    ← 이 파일
  types.ts                     ← DeliveryFeeInput, PlatformResult 등 타입
  calculation.ts               ← calculateDeliveryFee() 함수
  DeliveryFeeCalculator.tsx    ← UI 컴포넌트 ('use client')
  index.ts                     ← meta, seo, Component export
```
