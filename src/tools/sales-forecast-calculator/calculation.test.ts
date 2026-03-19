import { describe, it, expect } from 'vitest';
import { calculateSalesForecast } from './calculation';

describe('매출예측 계산기 (calculateSalesForecast)', () => {
  describe('좌석 회전율 기반', () => {
    it('20석, 회전율 3, 객단가 15000, 영업일 25일', () => {
      const result = calculateSalesForecast({
        method: 'seat',
        seatCount: 20,
        turnoverRate: 3,
        avgSpending: 15000,
        operatingDays: 25,
      });
      // 일 고객 = 20 * 3 = 60명
      // 일 매출 = round(60 * 15000) = 900000
      expect(result.dailySales).toBe(900000);
      expect(result.monthlySales).toBe(900000 * 25);
      expect(result.annualSales).toBe(900000 * 25 * 12);
      expect(result.methodDescription).toBe('좌석 회전율 기반 예측');
    });

    it('좌석 0이면 매출 0', () => {
      const result = calculateSalesForecast({
        method: 'seat',
        seatCount: 0,
        turnoverRate: 3,
        avgSpending: 15000,
        operatingDays: 25,
      });
      expect(result.dailySales).toBe(0);
      expect(result.monthlySales).toBe(0);
    });

    it('회전율 소수점 지원 (2.5회전)', () => {
      const result = calculateSalesForecast({
        method: 'seat',
        seatCount: 10,
        turnoverRate: 2.5,
        avgSpending: 10000,
        operatingDays: 30,
      });
      // 일 고객 = 10 * 2.5 = 25명
      expect(result.dailySales).toBe(Math.round(25 * 10000));
    });
  });

  describe('유동인구 기반', () => {
    it('유동인구 500명, 입점률 5%, 객단가 12000, 영업일 26일', () => {
      const result = calculateSalesForecast({
        method: 'traffic',
        dailyTraffic: 500,
        captureRate: 5,
        avgSpending: 12000,
        operatingDays: 26,
      });
      // 일 고객 = round(500 * 0.05) = 25
      const dailyCustomers = Math.round(500 * 0.05);
      expect(result.dailySales).toBe(dailyCustomers * 12000);
      expect(result.monthlySales).toBe(dailyCustomers * 12000 * 26);
    });

    it('입점률 0이면 매출 0', () => {
      const result = calculateSalesForecast({
        method: 'traffic',
        dailyTraffic: 1000,
        captureRate: 0,
        avgSpending: 15000,
        operatingDays: 25,
      });
      expect(result.dailySales).toBe(0);
    });
  });

  describe('업종 평균 기반', () => {
    it('매장 15평, 평당 월매출 200만원', () => {
      const result = calculateSalesForecast({
        method: 'average',
        storeArea: 15,
        salesPerPyeong: 2000000,
      });
      expect(result.monthlySales).toBe(Math.round(15 * 2000000));
      expect(result.dailySales).toBe(Math.round(result.monthlySales / 30));
      expect(result.annualSales).toBe(result.monthlySales * 12);
    });

    it('면적 0이면 매출 0', () => {
      const result = calculateSalesForecast({
        method: 'average',
        storeArea: 0,
        salesPerPyeong: 2000000,
      });
      expect(result.monthlySales).toBe(0);
    });
  });

  describe('공통 출력', () => {
    it('annualSales = monthlySales * 12', () => {
      const result = calculateSalesForecast({
        method: 'seat',
        seatCount: 30,
        turnoverRate: 4,
        avgSpending: 20000,
        operatingDays: 26,
      });
      expect(result.annualSales).toBe(result.monthlySales * 12);
    });

    it('assumptions 배열에 핵심 가정 포함', () => {
      const result = calculateSalesForecast({
        method: 'seat',
        seatCount: 20,
        turnoverRate: 3,
        avgSpending: 15000,
        operatingDays: 25,
      });
      expect(result.assumptions.length).toBeGreaterThan(0);
      expect(result.assumptions.some((a) => a.includes('좌석'))).toBe(true);
    });
  });

  describe('실제 사용 시나리오', () => {
    it('카페 창업: 12석, 회전율 5, 객단가 6500, 월 26일 영업', () => {
      const result = calculateSalesForecast({
        method: 'seat',
        seatCount: 12,
        turnoverRate: 5,
        avgSpending: 6500,
        operatingDays: 26,
      });
      expect(result.dailySales).toBe(Math.round(60 * 6500));
      expect(result.monthlySales).toBe(result.dailySales * 26);
    });
  });
});
