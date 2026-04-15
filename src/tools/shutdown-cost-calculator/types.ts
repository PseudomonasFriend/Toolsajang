/** 폐업비용 계산기 — 입력 타입 */
export interface ShutdownCostInput {
  /** 보증금 (원) */
  deposit: number;
  /** 원상복구 비율 (%) — 보증금의 N% */
  restorationRate: number;
  /** 권리금 손실 (원) */
  premiumLoss: number;
  /** 재고 잔액 (원) */
  inventoryBalance: number;
  /** 재고 회수율 (%) */
  inventoryRecoveryRate: number;
  /** 설비/인테리어 철거비 (원) */
  demolitionCost: number;
  /** 직원 월급 (원) */
  employeeSalary: number;
  /** 직원 근속연수 (년, 소수점 가능) */
  employeeTenure: number;
  /** 임대차 해지 위약금 (원) */
  leasePenalty: number;
  /** 기타 비용 (원) */
  miscCost: number;
}

export interface ShutdownCostItem {
  label: string;
  amount: number;
}

export interface ShutdownCostResult {
  items: ShutdownCostItem[];
  totalCost: number;
  depositReturn: number;
  /** 실질 손실액 = totalCost - depositReturn */
  netLoss: number;
}
