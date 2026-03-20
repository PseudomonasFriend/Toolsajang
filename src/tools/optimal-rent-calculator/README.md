# 적정 임대료 계산기 (optimal-rent-calculator)

## 개요

기존 `rent-ratio-calculator`(현재 임대료/매출 비율)의 **반대 방향** 계산기.
목표 수익을 달성하려면 최대 임대료를 얼마까지 감당할 수 있는지 역산한다.

## 입력

| 필드 | 타입 | 설명 |
|------|------|------|
| monthlySales | number | 월 매출 (원) |
| costRate | number | 원가율 (%) — 식재료·상품 원가 / 매출 |
| laborCost | number | 인건비 월 합계 (원) |
| otherFixedCost | number | 기타 고정비 (원) — 공과금·통신비·보험료 등 임대료 제외 |
| currentRent | number | 현재 임대료 (원, 선택) — 입력 시 비교 분석 제공 |

## 출력

| 필드 | 설명 |
|------|------|
| grossProfit | 매출총이익 = 매출 - 원가 |
| costAmount | 원가 금액 |
| totalOtherCost | 인건비 + 기타고정비 합계 |
| maxAffordableRent | 최대 임대료 (수익 0 기준) |
| stableRent | 안정 임대료 = 매출 × 10% |
| recommendedRent | 권장 임대료 = 매출 × 9% |
| rentMargin | 현재 임대료 여유금 (currentRent 입력 시) |
| rentStatus | safe / caution / danger (currentRent 입력 시) |
| operatingProfitWithCurrentRent | 임대료 지불 후 예상 영업이익 |
| breakEvenSales | 손익분기 매출 |

## 핵심 계산 로직

```
원가금액 = monthlySales × costRate / 100
매출총이익 = monthlySales - 원가금액
최대 임대료 = 매출총이익 - laborCost - otherFixedCost  (수익 0 기준)
안정 임대료 = monthlySales × 0.10
권장 임대료 = monthlySales × 0.09

rentStatus:
  currentRent <= 안정 임대료 → 'safe'
  currentRent <= 최대 임대료 → 'caution'
  else                       → 'danger'

손익분기 매출 = (currentRent + laborCost + otherFixedCost) / (1 - costRate/100)
```

## 업종별 벤치마크

| 업종 | 권장 임대료 비율 |
|------|----------------|
| 음식점 | 8~12% |
| 카페 | 10~15% |
| 편의점·소매 | 5~10% |
| 미용실·네일 | 8~12% |
| 의류·잡화 | 10~15% |
| 일반 (기본값) | 8~12% |
