import type { DiscountPriceInput, DiscountPriceOutput } from './types';

/**
 * 정가와 할인율로 할인가·할인 금액 계산
 */
export function calculateDiscountPrice(input: DiscountPriceInput): DiscountPriceOutput {
  const { originalPrice, discountRate } = input;

  const discountAmount = Math.round((originalPrice * discountRate) / 100);
  const discountedPrice = originalPrice - discountAmount;

  return { discountAmount, discountedPrice };
}
