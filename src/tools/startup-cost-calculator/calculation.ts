import type { StartupCostInput, StartupCostResult, StartupCostItem } from './types';

/**
 * 창업비용 계산 함수
 * 각 항목을 합산하고 예비비를 추가하여 총 창업비용 산출
 */
export function calculateStartupCost(input: StartupCostInput): StartupCostResult {
  const items: StartupCostItem[] = [
    { label: '보증금', amount: input.deposit },
    { label: '권리금', amount: input.premiumFee },
    { label: '인테리어', amount: input.interiorCost },
    { label: '설비/집기', amount: input.equipmentCost },
    { label: '초기 재고', amount: input.initialInventory },
    { label: '간판/사인물', amount: input.signageCost },
    { label: '인허가 비용', amount: input.licenseFee },
    { label: '기타', amount: input.miscCost },
  ].filter((item) => item.amount > 0);

  const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
  const contingency = Math.round(subtotal * (input.contingencyRate / 100));
  const totalCost = subtotal + contingency;

  // 상위 3개 항목
  const topItems = [...items]
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 3);

  return {
    items,
    subtotal,
    contingency,
    totalCost,
    topItems,
  };
}
