/** 배달앱 종류 */
export type DeliveryApp = 'baemin' | 'yogiyo' | 'coupangeats';

/** 배달 순이익 계산기 입력 */
export interface DeliveryProfitInput {
  /** 주문금액 */
  orderAmount: number;
  /** 배달앱 */
  deliveryApp: DeliveryApp;
  /** 수수료율 (%) — 기본값 앱별 상이 */
  commissionRate: number;
  /** 배달비 사장님 부담금 */
  deliveryFee: number;
  /** 원가율 (%) */
  costRate: number;
}

/** 배달 순이익 계산기 출력 */
export interface DeliveryProfitResult {
  /** 앱 수수료 */
  appCommission: number;
  /** 결제 수수료 (PG 수수료) */
  paymentFee: number;
  /** 원가 */
  costAmount: number;
  /** 배달비 부담금 */
  deliveryFee: number;
  /** 총 차감액 */
  totalDeduction: number;
  /** 실수령액 */
  netRevenue: number;
  /** 순이익 */
  netProfit: number;
  /** 순이익률 (%) */
  netProfitRate: number;
  /** 진단 메시지 */
  diagnosis: string;
  /** 진단 등급 */
  diagnosisLevel: 'good' | 'warning' | 'danger';
}
