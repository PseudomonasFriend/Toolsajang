/** 매출예측 방식 */
export type ForecastMethod = 'seat' | 'traffic' | 'average';

/** 좌석 회전율 기반 입력 */
export interface SeatBasedInput {
  method: 'seat';
  /** 좌석 수 */
  seatCount: number;
  /** 일 평균 회전율 (회) */
  turnoverRate: number;
  /** 객단가 */
  avgSpending: number;
  /** 영업일 수 (월) */
  operatingDays: number;
}

/** 유동인구 기반 입력 */
export interface TrafficBasedInput {
  method: 'traffic';
  /** 일 유동인구 */
  dailyTraffic: number;
  /** 입점률 (%) */
  captureRate: number;
  /** 객단가 */
  avgSpending: number;
  /** 영업일 수 (월) */
  operatingDays: number;
}

/** 업종 평균 기반 입력 */
export interface AverageBasedInput {
  method: 'average';
  /** 평수 */
  storeArea: number;
  /** 평당 월매출 (업종 평균) */
  salesPerPyeong: number;
}

/** 매출예측 계산기 입력 (유니온) */
export type SalesForecastInput = SeatBasedInput | TrafficBasedInput | AverageBasedInput;

/** 매출예측 계산기 출력 */
export interface SalesForecastResult {
  /** 일 예상 매출 */
  dailySales: number;
  /** 월 예상 매출 */
  monthlySales: number;
  /** 연 예상 매출 */
  annualSales: number;
  /** 예측 방식 설명 */
  methodDescription: string;
  /** 핵심 가정 */
  assumptions: string[];
}
