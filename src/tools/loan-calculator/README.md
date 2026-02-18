# 대출 이자 계산기 (loan-calculator)

> 대출 원금, 이자율, 기간을 입력하면 **월 상환액**과 **총 이자**를 계산하고, 원금균등/원리금균등 **두 방식을 비교**하는 툴.

## 공통 규칙

- `CalculatorLayout` 래퍼 사용 (페이지에서 감싸므로 컴포넌트 내부에서는 불필요)
- 모바일 퍼스트 (max-width 480px)
- Tailwind CSS only, TypeScript strict, `any` 금지
- 모든 텍스트/주석 한국어
- 컬러: Primary `blue-600`, 이익 `green-600`, 적자 `red-500`, BG `gray-50`, 카드 `white`, 텍스트 `gray-900`, 보조 `gray-500`, 테두리 `gray-200`

## 기능 설명

자영업자가 사업 자금, 시설 투자 등 대출을 받을 때 월별 상환 금액과 총 이자 부담을 미리 확인한다. 원금균등과 원리금균등 두 상환 방식을 비교해 볼 수 있다.

## 입력 필드

| 필드명 | 키 | 타입 | 필수 | 단위 | 기본값 |
|--------|-----|------|------|------|--------|
| 대출 원금 | principal | number | O | 원 | 0 |
| 연 이자율 | annualRate | number | O | % | 0 |
| 대출 기간 | loanMonths | number | O | 개월 | 12 |
| 상환 방식 | repaymentType | 'equalPrincipal' \| 'equalPayment' | O | - | 'equalPayment' |

- `equalPrincipal`: 원금균등상환 (매월 원금 동일, 이자 감소)
- `equalPayment`: 원리금균등상환 (매월 상환액 동일)

## 출력 항목

| 항목 | 키 | 설명 |
|------|-----|------|
| 월 상환액 (첫 달) | monthlyPayment | 원금균등은 첫 달 기준, 원리금균등은 매월 동일 |
| 총 상환액 | totalPayment | 원금 + 총 이자 |
| 총 이자 | totalInterest | 전체 기간 이자 합계 |
| 상환 스케줄 | schedule | 월별 [원금, 이자, 상환액, 잔액] 배열 |

## 계산 로직

```
월이율 = 연이자율 / 100 / 12

=== 원리금균등상환 (equalPayment) ===
if 월이율 === 0:
  월상환액 = 원금 / 개월수
else:
  월상환액 = 원금 × 월이율 × (1 + 월이율)^개월수 / ((1 + 월이율)^개월수 - 1)

매월:
  이자 = 남은잔액 × 월이율
  원금상환 = 월상환액 - 이자
  남은잔액 = 남은잔액 - 원금상환

=== 원금균등상환 (equalPrincipal) ===
월원금 = 원금 / 개월수

매월:
  이자 = 남은잔액 × 월이율
  월상환액 = 월원금 + 이자
  남은잔액 = 남은잔액 - 월원금

모든 금액은 round() 처리
```

## UI 요구사항

- **입력 영역**: 카드(`rounded-xl bg-white p-5 shadow-sm`)
  - 대출 원금: ₩ 접두사, `inputMode="numeric"`, 콤마 포맷, 높이 48px
  - 연 이자율: % 접미사, `inputMode="decimal"`, 높이 48px
  - 대출 기간: "개월" 접미사, `inputMode="numeric"`, 높이 48px
  - 상환 방식: 2개 탭 버튼 ("원리금균등", "원금균등")
    - 선택: `bg-blue-600 text-white`, 미선택: `bg-white text-gray-600 border border-gray-200`
    - 최소 높이 44px
- **실시간 계산**: 원금 + 이자율 + 기간 입력 시 즉시 결과 표시
- **결과 요약 카드**:
  - 월 상환액: `text-2xl font-bold` (원금균등은 "첫 달 기준" 표시)
  - 총 상환액, 총 이자: `text-sm` 보조 정보
- **상환 스케줄 테이블**: 접이식 (기본 접힘)
  - 헤더: 회차 / 상환액 / 원금 / 이자 / 잔액
  - 각 행: `text-sm`, 짝수행 `bg-gray-50`
  - 금액은 모두 콤마 포맷
  - 최대 높이 400px, 스크롤 (`overflow-y-auto`)
- **초기화 버튼**: 모든 입력값 기본값으로 리셋
- **결과 복사**: "대출 ₩X / 연 Y% / N개월 / 월상환 ₩Z / 총이자 ₩W" 형태

## index.ts export 형식

```typescript
import type { Tool } from '@/types';
import LoanCalculator from './LoanCalculator';

export const meta: Tool = {
  slug: 'loan-calculator',
  name: '대출 이자 계산기',
  description: '월 상환액과 총 이자를 한눈에 비교',
  icon: 'Landmark',
  category: '재무/회계',
  isNew: true,
  isActive: true,
};

export const seo = {
  title: '대출 이자 계산기 - 원금균등/원리금균등 비교',
  description: '대출 원금, 이자율, 기간을 입력하면 월 상환액과 총 이자를 즉시 계산하고 상환 스케줄을 확인합니다.',
};

export const Component = LoanCalculator;
```

## 참고: 사용하는 공통 유틸

- `@/lib/format` — `formatNumber`, `parseNumber`
- `@/lib/utils` — `cn`

## 파일 구조

```
src/tools/loan-calculator/
  README.md             ← 이 파일
  types.ts              ← LoanInput, LoanOutput, ScheduleRow 타입
  calculation.ts        ← calculateLoan() 함수
  LoanCalculator.tsx    ← UI 컴포넌트 ('use client')
  index.ts              ← meta, seo, Component export
```
