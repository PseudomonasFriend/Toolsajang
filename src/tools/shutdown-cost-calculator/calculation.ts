import type { ShutdownCostInput, ShutdownCostResult, ShutdownCostItem } from './types';

export function calculateShutdownCost(input: ShutdownCostInput): ShutdownCostResult {
  // 원상복구비 = 보증금 * 복구율 / 100
  const restorationCost = Math.round(input.deposit * (input.restorationRate / 100));
  // 재고 처리 손실 = 재고잔액 * (1 - 회수율/100)
  const inventoryLoss = Math.round(input.inventoryBalance * (1 - input.inventoryRecoveryRate / 100));
  // 퇴직금 = 1년 미만이면 0, 이상이면 월급 * 근속연수
  const severancePay = input.employeeTenure >= 1
    ? Math.round(input.employeeSalary * input.employeeTenure)
    : 0;

  const items: ShutdownCostItem[] = [
    { label: '원상복구비', amount: restorationCost },
    { label: '권리금 손실', amount: input.premiumLoss },
    { label: '재고 처리 손실', amount: inventoryLoss },
    { label: '설비/인테리어 철거비', amount: input.demolitionCost },
    { label: '직원 퇴직금', amount: severancePay },
    { label: '임대차 해지 위약금', amount: input.leasePenalty },
    { label: '기타 비용', amount: input.miscCost },
  ].filter((item) => item.amount > 0);

  const totalCost = items.reduce((sum, item) => sum + item.amount, 0);
  const depositReturn = Math.max(0, input.deposit - restorationCost);
  const netLoss = totalCost - depositReturn;

  return { items, totalCost, depositReturn, netLoss };
}
