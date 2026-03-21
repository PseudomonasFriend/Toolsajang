# 원천세 계산기 (tax-withholding-calculator)

## 개요

소상공인이 프리랜서·알바·직원에게 돈을 줄 때 원천징수해야 하는 세금을 계산합니다.

## 소득 유형별 계산 방식

### 사업소득 (프리랜서, 3.3%)
- 과세표준 = 지급액
- 소득세 = 지급액 × 3%
- 지방소득세 = 소득세 × 10%
- 총 원천징수율 = 3.3%

### 기타소득 (강연료·원고료·상금)
- 필요경비 = 지급액 × 필요경비율 (기본 60%)
- 과세표준 = 지급액 - 필요경비
- 소득세 = 과세표준 × 20%
- 지방소득세 = 소득세 × 10%
- 총 원천징수율(기본) = 8.8% (지급액 기준)
- 소액 부징수: 과세표준 ≤ 5만원이면 비과세

### 일용근로소득 (일당제 알바·일용직)
- 비과세 공제 = 1일 15만원
- 과세표준 = max(0, 지급액 - 150,000)
- 소득세 = 과세표준 × 45% × 6% (근로소득공제 55% 반영)
- 지방소득세 = 소득세 × 10%

## 파일 구조

```
tax-withholding-calculator/
├── README.md          — 이 파일 (스펙)
├── types.ts           — IncomeType, TaxWithholdingInput, TaxWithholdingOutput
├── calculation.ts     — INCOME_TYPE_INFO, calculateTaxWithholding()
├── TaxWithholdingCalculator.tsx  — 'use client' UI 컴포넌트
└── index.ts           — meta, seo, Component export
```

## 입력

| 필드 | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| paymentAmount | number | 0 | 지급액 (원) |
| incomeType | IncomeType | 'business' | 소득 유형 |
| expenseRate | number | 60 | 필요경비율 (기타소득 전용) |

## 출력

| 필드 | 설명 |
|------|------|
| taxableIncome | 과세표준 |
| expenseAmount | 필요경비 금액 |
| incomeTax | 소득세 |
| localTax | 지방소득세 |
| totalTax | 원천세 합계 |
| netPayment | 실지급액 |
| effectiveRate | 실효 원천징수율 (%) |
