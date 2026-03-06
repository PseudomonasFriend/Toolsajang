import type { DeliveryProfitInput, DeliveryProfitResult, DeliveryApp } from './types';

/**
 * 배달앱별 기본 수수료율 (2024년 기준)
 */
export const DEFAULT_COMMISSION_RATES: Record<DeliveryApp, number> = {
  baemin: 6.8,
  yogiyo: 12.5,
  coupangeats: 9.8,
};

/** 배달앱 이름 */
export const DELIVERY_APP_NAMES: Record<DeliveryApp, string> = {
  baemin: '배달의민족',
  yogiyo: '요기요',
  coupangeats: '쿠팡이츠',
};

/** PG(결제대행) 수수료율 (%) */
const PG_FEE_RATE = 3.3;

/**
 * 배달 순이익 계산 함수
 */
export function calculateDeliveryProfit(input: DeliveryProfitInput): DeliveryProfitResult {
  const { orderAmount, commissionRate, deliveryFee, costRate } = input;

  // 앱 수수료
  const appCommission = Math.round(orderAmount * (commissionRate / 100));

  // 결제 수수료 (PG)
  const paymentFee = Math.round(orderAmount * (PG_FEE_RATE / 100));

  // 원가
  const costAmount = Math.round(orderAmount * (costRate / 100));

  // 총 차감액
  const totalDeduction = appCommission + paymentFee + costAmount + deliveryFee;

  // 실수령액 (주문금액 - 앱수수료 - 결제수수료)
  const netRevenue = orderAmount - appCommission - paymentFee;

  // 순이익 (실수령액 - 원가 - 배달비)
  const netProfit = netRevenue - costAmount - deliveryFee;

  // 순이익률
  const netProfitRate = orderAmount > 0
    ? Math.round((netProfit / orderAmount) * 100 * 10) / 10
    : 0;

  // 진단
  let diagnosis: string;
  let diagnosisLevel: 'good' | 'warning' | 'danger';

  if (netProfitRate >= 20) {
    diagnosis = '순이익률이 양호합니다. 배달 채널이 수익에 기여하고 있습니다.';
    diagnosisLevel = 'good';
  } else if (netProfitRate >= 10) {
    diagnosis = '순이익률이 보통 수준입니다. 원가 절감이나 메뉴 가격 조정을 검토해 보세요.';
    diagnosisLevel = 'warning';
  } else if (netProfitRate >= 0) {
    diagnosis = '순이익률이 낮습니다. 배달 전용 메뉴 가격 인상이나 원가 절감이 필요합니다.';
    diagnosisLevel = 'warning';
  } else {
    diagnosis = '배달 주문에서 손실이 발생하고 있습니다. 수수료 부담을 재검토하세요.';
    diagnosisLevel = 'danger';
  }

  return {
    appCommission,
    paymentFee,
    costAmount,
    deliveryFee,
    totalDeduction,
    netRevenue,
    netProfit,
    netProfitRate,
    diagnosis,
    diagnosisLevel,
  };
}
