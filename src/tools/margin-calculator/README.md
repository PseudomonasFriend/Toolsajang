# 마진 계산기 (margin-calculator)

> 자영업자가 상품 하나를 팔 때 **실제로 남는 돈**을 계산하는 툴.

## 공통 규칙

- `CalculatorLayout` 래퍼 사용
- 모바일 퍼스트 (max-width 480px)
- Tailwind CSS only, TypeScript strict, `any` 금지
- 모든 텍스트/주석 한국어

## 입력 필드

| 필드명 | 키 | 타입 | 필수 | 단위 | 기본값 |
|--------|-----|------|------|------|--------|
| 판매가 | sellingPrice | number | O | 원 | 0 |
| 매입 원가 | costPrice | number | O | 원 | 0 |
| 마켓/카드 수수료 | commissionRate | number | X | % | 0 |
| 배송비 | shippingCost | number | X | 원 | 0 |
| 포장비/기타 비용 | otherCost | number | X | 원 | 0 |
| 부가세 포함 여부 | includeVAT | boolean | X | - | false |

## 출력 항목

| 항목 | 키 | 계산식 |
|------|-----|--------|
| 순이익 | netProfit | 공급가액 - 원가 - 수수료액 - 배송비 - 기타비용 |
| 마진율 | marginRate | (순이익 / 공급가액) × 100 |
| 마크업률 | markupRate | (순이익 / 원가) × 100 |
| 수수료 금액 | commissionAmount | 판매가 × (수수료율 / 100) |
| 부가세 | vatAmount | 부가세 포함 시: 판매가 - round(판매가 / 1.1) |
| 실수령액 | actualRevenue | 순이익 |

## 계산 로직 요약

```
공급가액 = 부가세 포함 ? round(판매가 / 1.1) : 판매가
부가세 = 부가세 포함 ? 판매가 - 공급가액 : 0
수수료 금액 = round(판매가 × 수수료율 / 100)
순이익 = 공급가액 - 원가 - 수수료 금액 - 배송비 - 기타비용
마진율 = (순이익 / 공급가액) × 100   (소수점 1자리)
마크업률 = (순이익 / 원가) × 100     (소수점 1자리)
```

## UI 요구사항

- **실시간 계산**: 판매가 + 원가 입력 시 즉시 결과 표시
- **숫자 입력**: `inputMode="numeric"`, 천단위 콤마 자동 포맷
- **추가 비용 섹션**: 기본 접힘 (Accordion), 탭하면 펼쳐짐
- **결과 복사**: 클립보드에 텍스트로 복사
- **초기화**: 모든 입력값 기본값으로 리셋
- **음수 결과**: 순이익이 마이너스면 빨간색(`text-red-500`) + "적자" 경고

## 파일 구조

```
src/tools/margin-calculator/
  README.md           ← 이 파일
  types.ts            ← MarginInput, MarginOutput 타입
  calculation.ts      ← calculateMargin() 함수
  MarginCalculator.tsx ← UI 컴포넌트 ('use client')
  index.ts            ← meta, seo, Component export
```
