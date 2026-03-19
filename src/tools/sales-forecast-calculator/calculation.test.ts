import { describe, it, expect } from 'vitest';
import { calculateSalesForecast } from './calculation';

describe('매출예측 계산기 (calculateSalesForecast)', () => {
  describe('좌석 회전율 방식 (seat)', () => {
    it('좌석 20석, 회전율 3, 객단가 15000, 월 26일 → 일/월/연 매출 계산', () => {
      const result = calculateSalesForecast({
        method: 'seat',
        seatCount: 20,
        turnoverRate: 3,
        avgSpending: 15000,
        operatingDays: 26,
        dailyTraffic: 0,
        captureRate: 0,
        storeArea: 0,
        salesPerPyeong: 0,
      });
      // dailyCustomers = 20 * 3 = 60
      // dailySales = round(60 * 15000) = 900000
      expect(result.dailySales).toBe(900000);
      // monthlySales = 900000 * 26 = 23400000
      expect(result.monthlySales).toBe(23400000);
      expect(result.annualSales).toBe(280800000);
      expect(result.methodDescription).toBe('좌석 회전율 기반 예측');
    });

    it('assumptions에 좌석수/회전율/객단가/영업일 포함', () => {
      const result = calculateSalesForecast({
        method: 'seat',
        seatCount: 10,
        turnoverRate: 2,
        avgSpending: 20000,
        operatingDays: 25,
        dailyTraffic: 0,
        captureRate: 0,
        storeArea: 0,
        salesPerPyeong: 0,
      });
      expect(result.assumptions.length).toBeGreaterThan(0);
    });
  });

  describe('유동인구 방식 (traffic)', () => {
    it('유동인구 1000명, 입점률 5%, 객단가 12000, 월 25일 → 매출 계산', () => {
      const result = calculateSalesForecast({
        method: 'traffic',
        seatCount: 0,
        turnoverRate: 0,
        avgSpending: 12000,
        operatingDays: 25,
        dailyTraffic: 1000,
        captureRate: 5,
        storeArea: 0,
        salesPerPyeong: 0,
      });
      // dailyCustomers = round(1000 * 0.05) = 50
      // dailySales = 50 * 12000 = 600000
      expect(result.dailySales).toBe(600000);
      expect(result.monthlySales).toBe(15000000);
      expect(result.annualSales).toBe(180000000);
      expect(result.methodDescription).toBe('유동인구 기반 예측');
    });
  });

  describe('업종 평균 방식 (average)', () => {
    it('10평, 평당 월매출 200만원 → 월 매출 2000만원', () => {
      const result = calculateSalesForecast({
        method: 'average',
        seatCount: 0,
        turnoverRate: 0,
        avgSpending: 0,
        operatingDays: 25,
        dailyTraffic: 0,
        captureRate: 0,
        storeArea: 10,
        salesPerPyeong: 2000000,
      });
      expect(result.monthlySales).toBe(20000000);
      expect(result.annualSales).toBe(240000000);
      // dailySales = round(20000000 / 30) = 666667
      expect(result.dailySales).toBe(666667);
      expect(result.methodDescription).toBe('업종 평균 기반 예측');
    });
  });

  describe('연매출 계산', () => {
    it('annualSales = monthlySales * 12', () => {
      const result = calculateSalesForecast({
        method: 'seat',
        seatCount: 15,
        turnoverRate: 2,
        avgSpending: 10000,
        operatingDays: 30,
        dailyTraffic: 0,
        captureRate: 0,
        storeArea: 0,
        salesPerPyeong: 0,
      });
      expect(result.annualSales).toBe(result.monthlySales * 12);
    });
  });
});
