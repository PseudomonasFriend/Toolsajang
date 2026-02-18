import type { RentRatioInput, RentRatioOutput } from './types';

/**
 * 매출 대비 임대료 비율 계산
 * 10~15% 적정, 20% 이상이면 높음으로 간주
 */
export function calculateRentRatio(input: RentRatioInput): RentRatioOutput {
  const { monthlySales, monthlyRent } = input;

  if (monthlySales <= 0) {
    return { rentRatio: 0, status: 'normal' };
  }

  const rentRatio = Math.round((monthlyRent / monthlySales) * 1000) / 10;

  let status: RentRatioOutput['status'] = 'normal';
  if (rentRatio > 20) status = 'high';
  else if (rentRatio < 10) status = 'low';

  return { rentRatio, status };
}
