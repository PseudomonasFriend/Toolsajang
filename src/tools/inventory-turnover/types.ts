/** 재고 회전율 계산기 입력 */
export interface InventoryTurnoverInput {
  /** 기간 일수 (30/90/180/365) */
  periodDays: number;
  /** 매출원가 (해당 기간) */
  costOfGoods: number;
  /** 기초 재고금액 */
  beginningInventory: number;
  /** 기말 재고금액 */
  endingInventory: number;
}

/** 재고 회전율 계산기 출력 */
export interface InventoryTurnoverResult {
  /** 평균 재고금액 */
  avgInventory: number;
  /** 재고 회전율 (연환산) */
  turnoverRate: number;
  /** 재고 보유 일수 */
  daysOnHand: number;
  /** 진단 메시지 */
  diagnosis: string;
  /** 진단 등급 (good/warning/danger) */
  diagnosisLevel: 'good' | 'warning' | 'danger';
}
