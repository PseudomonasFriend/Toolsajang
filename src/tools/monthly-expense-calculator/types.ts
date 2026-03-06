/** 월 고정비 계산기 입력 */
export interface MonthlyExpenseInput {
  /** 월 임대료 */
  rent: number;
  /** 관리비 */
  maintenanceFee: number;
  /** 인건비 (직원 급여 합계) */
  laborCost: number;
  /** 4대보험 사업자 부담분 */
  insuranceCost: number;
  /** 전기/가스/수도 */
  utilityCost: number;
  /** 통신비 (인터넷/전화/POS) */
  telecomCost: number;
  /** 대출 이자 */
  loanInterest: number;
  /** 카드 수수료 */
  cardFee: number;
  /** 배달앱 수수료 */
  deliveryFee: number;
  /** 기타 고정비 */
  miscCost: number;
}

/** 고정비 항목 */
export interface ExpenseItem {
  label: string;
  amount: number;
  category: '임대' | '인건비' | '운영비' | '금융비';
}

/** 월 고정비 계산기 출력 */
export interface MonthlyExpenseResult {
  /** 항목별 내역 */
  items: ExpenseItem[];
  /** 총 월 고정비 */
  totalExpense: number;
  /** 일 고정비 (30일 기준) */
  dailyExpense: number;
  /** 카테고리별 소계 */
  categoryTotals: { category: string; total: number; percentage: number }[];
  /** 가장 큰 비용 카테고리 */
  largestCategory: string;
}
