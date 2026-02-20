import type { RentPerPyeongInput, RentPerPyeongResult } from './types';

/** 1평 = 3.305785 m² */
const SQM_PER_PYEONG = 3.305785;

/**
 * 평당 임대료 계산 함수
 */
export function calculateRentPerPyeong(
  input: RentPerPyeongInput
): RentPerPyeongResult {
  const { area, areaUnit, monthlyRent, managementFee, monthlyRevenue } = input;

  // 평수 및 m² 상호 환산
  const pyeong =
    areaUnit === 'pyeong'
      ? area
      : Math.round((area / SQM_PER_PYEONG) * 100) / 100;
  const sqm =
    areaUnit === 'sqm'
      ? area
      : Math.round(area * SQM_PER_PYEONG * 100) / 100;

  // 월 총 임대료
  const totalMonthlyRent = monthlyRent + managementFee;

  // 평당 월세
  const rentPerPyeong = pyeong > 0 ? Math.round(monthlyRent / pyeong) : 0;

  // 평당 실질 임대료 (월세 + 관리비)
  const totalRentPerPyeong =
    pyeong > 0 ? Math.round(totalMonthlyRent / pyeong) : 0;

  // 연 임대료
  const annualRent = totalMonthlyRent * 12;

  // 매출 대비 임대료 비율
  const rentRatio =
    monthlyRevenue > 0
      ? Math.round((totalMonthlyRent / monthlyRevenue) * 100 * 10) / 10
      : null;

  return {
    pyeong: Math.round(pyeong * 10) / 10,
    sqm: Math.round(sqm * 10) / 10,
    rentPerPyeong,
    totalRentPerPyeong,
    totalMonthlyRent,
    annualRent,
    rentRatio,
  };
}
