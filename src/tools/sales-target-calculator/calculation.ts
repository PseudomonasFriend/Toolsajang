import type { SalesTargetInput, SalesTargetOutput } from './types';

/**
 * 목표 순이익을 달성하기 위한 필요 매출 역산
 * 필요 매출 = (고정비 + 목표 순이익) / (마진율/100)
 */
export function calculateSalesTarget(input: SalesTargetInput): SalesTargetOutput {
  const { fixedCost, targetProfit, marginRate } = input;

  if (marginRate <= 0 || marginRate > 100) {
    return { requiredSales: 0, breakEvenAmount: fixedCost + targetProfit };
  }

  const breakEvenAmount = fixedCost + targetProfit;
  const requiredSales = Math.round(
    (breakEvenAmount * 100) / marginRate
  );

  return { requiredSales, breakEvenAmount };
}
