import type { SalesForecastInput, SalesForecastResult } from './types';

/**
 * 매출예측 계산 함수
 * 3가지 방식: 좌석 회전율, 유동인구, 업종 평균
 */
export function calculateSalesForecast(input: SalesForecastInput): SalesForecastResult {
  let dailySales = 0;
  let monthlySales = 0;
  let methodDescription = '';
  const assumptions: string[] = [];

  switch (input.method) {
    case 'seat': {
      // 좌석 회전율 기반: 좌석수 x 회전율 x 객단가
      const dailyCustomers = input.seatCount * input.turnoverRate;
      dailySales = Math.round(dailyCustomers * input.avgSpending);
      monthlySales = dailySales * input.operatingDays;
      methodDescription = '좌석 회전율 기반 예측';
      assumptions.push(
        `좌석 ${input.seatCount}석 x 일 ${input.turnoverRate}회전`,
        `일 예상 고객: ${Math.round(dailyCustomers)}명`,
        `객단가: ${input.avgSpending.toLocaleString('ko-KR')}원`,
        `월 영업일: ${input.operatingDays}일`,
      );
      break;
    }

    case 'traffic': {
      // 유동인구 기반: 유동인구 x 입점률 x 객단가
      const dailyCustomers = Math.round(input.dailyTraffic * (input.captureRate / 100));
      dailySales = dailyCustomers * input.avgSpending;
      monthlySales = dailySales * input.operatingDays;
      methodDescription = '유동인구 기반 예측';
      assumptions.push(
        `일 유동인구: ${input.dailyTraffic.toLocaleString('ko-KR')}명`,
        `입점률: ${input.captureRate}%`,
        `일 예상 고객: ${dailyCustomers}명`,
        `객단가: ${input.avgSpending.toLocaleString('ko-KR')}원`,
        `월 영업일: ${input.operatingDays}일`,
      );
      break;
    }

    case 'average': {
      // 업종 평균 기반: 평수 x 평당 월매출
      monthlySales = Math.round(input.storeArea * input.salesPerPyeong);
      dailySales = Math.round(monthlySales / 30);
      methodDescription = '업종 평균 기반 예측';
      assumptions.push(
        `매장 면적: ${input.storeArea}평`,
        `평당 월매출: ${input.salesPerPyeong.toLocaleString('ko-KR')}원`,
      );
      break;
    }
  }

  const annualSales = monthlySales * 12;

  return {
    dailySales,
    monthlySales,
    annualSales,
    methodDescription,
    assumptions,
  };
}
