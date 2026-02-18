import type { BreakEvenInput, BreakEvenOutput } from './types';

/**
 * 손익분기점 계산 함수
 * 고정비, 변동비, 판매가를 기반으로
 * 공헌이익, 공헌이익률, BEP 수량, BEP 매출액을 계산한다.
 */
export function calculateBreakEven(input: BreakEvenInput): BreakEvenOutput {
  const { sellingPrice, variableCost, fixedCost } = input;

  // 공헌이익 = 판매가 - 변동비
  const contributionMargin = sellingPrice - variableCost;

  // 공헌이익률 = (공헌이익 / 판매가) × 100 (소수점 1자리)
  const contributionRate =
    sellingPrice > 0
      ? Math.round(((contributionMargin / sellingPrice) * 100) * 10) / 10
      : 0;

  // 공헌이익이 0 이하이면 계산 불가
  if (contributionMargin <= 0) {
    return {
      contributionMargin,
      contributionRate,
      breakEvenQuantity: 0,
      breakEvenRevenue: 0,
    };
  }

  // BEP 수량 = ceil(고정비 / 공헌이익)
  const breakEvenQuantity = Math.ceil(fixedCost / contributionMargin);

  // BEP 매출액 = BEP 수량 × 판매가
  const breakEvenRevenue = breakEvenQuantity * sellingPrice;

  return {
    contributionMargin,
    contributionRate,
    breakEvenQuantity,
    breakEvenRevenue,
  };
}
