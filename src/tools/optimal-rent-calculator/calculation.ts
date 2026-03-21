import type { OptimalRentInput, OptimalRentOutput, IndustryBenchmark } from './types';

/** 업종별 임대료 비율 벤치마크 (한국 소상공인 기준) */
export const INDUSTRY_BENCHMARKS: IndustryBenchmark[] = [
  { name: '음식점', minRate: 8, maxRate: 12 },
  { name: '카페', minRate: 10, maxRate: 15 },
  { name: '편의점·소매', minRate: 5, maxRate: 10 },
  { name: '미용실·네일', minRate: 8, maxRate: 12 },
  { name: '의류·잡화', minRate: 10, maxRate: 15 },
  { name: '일반 (기본값)', minRate: 8, maxRate: 12 },
];

/**
 * 목표 수익 달성을 위한 적정 임대료 역산 계산
 */
export function calculateOptimalRent(input: OptimalRentInput): OptimalRentOutput {
  const { monthlySales, costRate, laborCost, otherFixedCost, currentRent } = input;

  // 원가 금액
  const costAmount = Math.round(monthlySales * costRate / 100);

  // 매출총이익 = 매출 - 원가
  const grossProfit = monthlySales - costAmount;

  // 인건비 + 기타고정비 합계
  const totalOtherCost = laborCost + otherFixedCost;

  // 임대료 제외 영업비용
  const operatingCostExcludeRent = costAmount + laborCost + otherFixedCost;

  // 최대 임대료 (수익 0 기준) = 매출총이익 - 인건비 - 기타고정비
  const maxAffordableRent = Math.max(0, grossProfit - laborCost - otherFixedCost);

  // 안정 임대료 = 매출의 10%
  const stableRent = Math.round(monthlySales * 0.10);

  // 권장 임대료 = 매출의 9% (안전마진 확보)
  const recommendedRent = Math.round(monthlySales * 0.09);

  // currentRent가 유효할 때만 비교 계산
  if (currentRent > 0) {
    const rentMargin = maxAffordableRent - currentRent;

    let rentStatus: OptimalRentOutput['rentStatus'];
    if (currentRent <= stableRent) {
      rentStatus = 'safe';
    } else if (currentRent <= maxAffordableRent) {
      rentStatus = 'caution';
    } else {
      rentStatus = 'danger';
    }

    // 영업이익 = 매출총이익 - 인건비 - 기타고정비 - 현재임대료
    const operatingProfitWithCurrentRent = grossProfit - laborCost - otherFixedCost - currentRent;

    // 손익분기 매출 = (임대료 + 인건비 + 기타고정비) / (1 - 원가율/100)
    const costRatio = costRate / 100;
    const breakEvenSales = costRatio < 1
      ? Math.round((currentRent + laborCost + otherFixedCost) / (1 - costRatio))
      : null;

    return {
      grossProfit,
      costAmount,
      totalOtherCost,
      operatingCostExcludeRent,
      maxAffordableRent,
      stableRent,
      recommendedRent,
      rentMargin,
      rentStatus,
      operatingProfitWithCurrentRent,
      breakEvenSales,
    };
  }

  return {
    grossProfit,
    costAmount,
    totalOtherCost,
    operatingCostExcludeRent,
    maxAffordableRent,
    stableRent,
    recommendedRent,
    rentMargin: null,
    rentStatus: null,
    operatingProfitWithCurrentRent: null,
    breakEvenSales: null,
  };
}
