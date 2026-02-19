import type { InventoryTurnoverInput, InventoryTurnoverResult } from './types';

/**
 * 재고 회전율 계산 함수
 * 매출원가와 평균 재고금액 기반으로 재고 효율을 분석한다.
 */
export function calculateInventoryTurnover(
  input: InventoryTurnoverInput
): InventoryTurnoverResult {
  const { periodDays, costOfGoods, beginningInventory, endingInventory } =
    input;

  // 평균 재고금액
  const avgInventory = (beginningInventory + endingInventory) / 2;

  if (avgInventory <= 0) {
    return {
      avgInventory: 0,
      turnoverRate: 0,
      daysOnHand: 0,
      diagnosis: '재고 금액을 입력해 주세요.',
      diagnosisLevel: 'warning',
    };
  }

  // 연간 매출원가로 환산
  const annualCostOfGoods = (costOfGoods * 365) / periodDays;

  // 재고 회전율 (연환산)
  const turnoverRate = annualCostOfGoods / avgInventory;

  // 재고 보유 일수
  const daysOnHand = Math.round(365 / turnoverRate);

  // 진단 (일반 소매 기준)
  let diagnosis: string;
  let diagnosisLevel: 'good' | 'warning' | 'danger';

  if (turnoverRate >= 12) {
    diagnosis = '재고 관리가 우수합니다. 재고 소진이 빠릅니다.';
    diagnosisLevel = 'good';
  } else if (turnoverRate >= 6) {
    diagnosis = '양호한 수준입니다. 현재 재고 수준을 유지하세요.';
    diagnosisLevel = 'good';
  } else if (turnoverRate >= 3) {
    diagnosis = '재고가 다소 많습니다. 발주 주기를 조절해 보세요.';
    diagnosisLevel = 'warning';
  } else {
    diagnosis = '재고 과잉입니다. 재고를 줄이고 자금 흐름을 개선하세요.';
    diagnosisLevel = 'danger';
  }

  return {
    avgInventory: Math.round(avgInventory),
    turnoverRate: Math.round(turnoverRate * 10) / 10,
    daysOnHand,
    diagnosis,
    diagnosisLevel,
  };
}
