import type { DiscountInput, DiscountOutput } from './types';

/**
 * 할인율 계산 함수
 * 정상 판매가, 매입 원가, 할인율을 기반으로
 * 할인 후 마진 변화 및 필요 판매량 증가율을 계산한다.
 */
export function calculateDiscount(input: DiscountInput): DiscountOutput {
  const { originalPrice, costPrice, discountRate } = input;

  // 할인 금액 및 할인 판매가
  const discountAmount = Math.round(originalPrice * discountRate / 100);
  const discountedPrice = originalPrice - discountAmount;

  // 원래 마진
  const originalMargin = originalPrice - costPrice;
  const originalMarginRate =
    originalPrice > 0
      ? Math.round(((originalMargin / originalPrice) * 100) * 10) / 10
      : 0;

  // 할인 후 마진
  const discountedMargin = discountedPrice - costPrice;
  const discountedMarginRate =
    discountedPrice > 0
      ? Math.round(((discountedMargin / discountedPrice) * 100) * 10) / 10
      : 0;

  // 마진 감소
  const marginDrop = originalMargin - discountedMargin;
  const marginDropRate =
    originalMargin > 0
      ? Math.round(((marginDrop / originalMargin) * 100) * 10) / 10
      : 0;

  // 동일 이익 필요 판매량 증가율
  const requiredSalesIncrease =
    discountedMargin > 0
      ? Math.round(((originalMargin / discountedMargin - 1) * 100) * 10) / 10
      : 0;

  return {
    discountAmount,
    discountedPrice,
    originalMargin,
    originalMarginRate,
    discountedMargin,
    discountedMarginRate,
    marginDrop,
    marginDropRate,
    requiredSalesIncrease,
  };
}
