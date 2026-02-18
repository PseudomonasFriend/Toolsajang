import type { VatInput, VatOutput } from './types';

/**
 * 부가세 계산 함수
 * 공급가액 → 부가세/합계 또는 합계 → 공급가액/부가세를 계산한다.
 */
export function calculateVat(input: VatInput): VatOutput {
  const { direction, amount } = input;

  if (direction === 'toTotal') {
    // 공급가액 → 부가세, 합계
    const supplyPrice = amount;
    const vatAmount = Math.round(amount * 0.1);
    const totalPrice = amount + vatAmount;

    return { supplyPrice, vatAmount, totalPrice };
  }

  // 합계(VAT 포함) → 공급가액, 부가세
  const supplyPrice = Math.round(amount / 1.1);
  const vatAmount = amount - supplyPrice;
  const totalPrice = amount;

  return { supplyPrice, vatAmount, totalPrice };
}
