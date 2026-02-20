/** 평당 임대료 계산기 입력 */
export interface RentPerPyeongInput {
  /** 면적 */
  area: number;
  /** 면적 단위 (pyeong: 평, sqm: m²) */
  areaUnit: 'pyeong' | 'sqm';
  /** 보증금 */
  deposit: number;
  /** 월세 */
  monthlyRent: number;
  /** 관리비 (선택) */
  managementFee: number;
  /** 월 매출 (임대료 비율 계산용, 선택) */
  monthlyRevenue: number;
}

/** 평당 임대료 계산 결과 */
export interface RentPerPyeongResult {
  /** 평수 */
  pyeong: number;
  /** m² 면적 */
  sqm: number;
  /** 평당 월세 */
  rentPerPyeong: number;
  /** 평당 실질 임대료 (월세+관리비) */
  totalRentPerPyeong: number;
  /** 월 총 임대료 (월세+관리비) */
  totalMonthlyRent: number;
  /** 연 임대료 총액 */
  annualRent: number;
  /** 매출 대비 임대료 비율 (%) — 매출 입력 시만 */
  rentRatio: number | null;
}
