import type { FoodCostInput, FoodCostResult } from './types';

/**
 * 원가율 계산 함수 (F&B 식음료 기준)
 */
export function calculateFoodCost(input: FoodCostInput): FoodCostResult {
  const { ingredientCost, sellingPrice, targetCostRate } = input;

  // 현재 원가율
  const currentCostRate =
    sellingPrice > 0
      ? Math.round((ingredientCost / sellingPrice) * 100 * 10) / 10
      : 0;

  // 원가 이익
  const grossProfit = sellingPrice - ingredientCost;

  // 총 이익률
  const grossProfitRate =
    sellingPrice > 0
      ? Math.round((grossProfit / sellingPrice) * 100 * 10) / 10
      : 0;

  // 목표 원가율 기준 권장 판매가
  const recommendedPrice =
    targetCostRate > 0
      ? Math.ceil(ingredientCost / (targetCostRate / 100) / 100) * 100
      : 0;

  // 진단
  let diagnosis: string;
  let diagnosisLevel: 'good' | 'warning' | 'danger';

  if (currentCostRate <= targetCostRate) {
    diagnosis = `원가율이 목표(${targetCostRate}%) 이하입니다. 수익성이 양호합니다.`;
    diagnosisLevel = 'good';
  } else if (currentCostRate <= targetCostRate + 10) {
    diagnosis = `원가율이 목표(${targetCostRate}%)보다 다소 높습니다. 권장 가격으로 인상을 검토해 보세요.`;
    diagnosisLevel = 'warning';
  } else {
    diagnosis = `원가율이 너무 높습니다. 식재료 원가 절감 또는 가격 인상이 필요합니다.`;
    diagnosisLevel = 'danger';
  }

  return {
    currentCostRate,
    grossProfit,
    grossProfitRate,
    recommendedPrice,
    diagnosis,
    diagnosisLevel,
  };
}
