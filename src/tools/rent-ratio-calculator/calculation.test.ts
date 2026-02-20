import { describe, it, expect } from 'vitest';
import { calculateRentRatio } from './calculation';

describe('임대료 비율 계산기 (calculateRentRatio)', () => {
  describe('기본 임대료 비율 계산', () => {
    it('월 매출 1000000, 월 임대료 100000이면 비율 10%', () => {
      const result = calculateRentRatio({
        monthlySales: 1000000,
        monthlyRent: 100000,
      });
      expect(result.rentRatio).toBe(10);
    });

    it('월 매출 5000000, 월 임대료 750000이면 비율 15%', () => {
      const result = calculateRentRatio({
        monthlySales: 5000000,
        monthlyRent: 750000,
      });
      expect(result.rentRatio).toBe(15);
    });

    it('소수점 1자리 반올림', () => {
      const result = calculateRentRatio({
        monthlySales: 3000000,
        monthlyRent: 500000,
      });
      // 500000 / 3000000 * 100 = 16.666...% → 16.7
      expect(result.rentRatio).toBe(16.7);
    });
  });

  describe('상태(status) 판정', () => {
    it('비율 10% 미만이면 status = low', () => {
      const result = calculateRentRatio({
        monthlySales: 10000000,
        monthlyRent: 500000,
      });
      // 5% → low
      expect(result.status).toBe('low');
    });

    it('비율 10~20%이면 status = normal', () => {
      const result = calculateRentRatio({
        monthlySales: 5000000,
        monthlyRent: 750000,
      });
      // 15% → normal
      expect(result.status).toBe('normal');
    });

    it('비율 20% 초과이면 status = high', () => {
      const result = calculateRentRatio({
        monthlySales: 2000000,
        monthlyRent: 500000,
      });
      // 25% → high
      expect(result.status).toBe('high');
    });

    it('비율 정확히 10%이면 status = normal', () => {
      const result = calculateRentRatio({
        monthlySales: 1000000,
        monthlyRent: 100000,
      });
      // 10% → normal (10 이상, 20 이하)
      expect(result.status).toBe('normal');
    });

    it('비율 정확히 20%이면 status = normal', () => {
      const result = calculateRentRatio({
        monthlySales: 1000000,
        monthlyRent: 200000,
      });
      // 20% → normal (20 초과가 아니므로 normal)
      expect(result.status).toBe('normal');
    });
  });

  describe('엣지 케이스', () => {
    it('월 매출 0이면 비율 0, status normal 반환', () => {
      const result = calculateRentRatio({
        monthlySales: 0,
        monthlyRent: 500000,
      });
      expect(result.rentRatio).toBe(0);
      expect(result.status).toBe('normal');
    });

    it('월 매출 음수이면 비율 0, status normal 반환', () => {
      const result = calculateRentRatio({
        monthlySales: -1000000,
        monthlyRent: 200000,
      });
      expect(result.rentRatio).toBe(0);
      expect(result.status).toBe('normal');
    });

    it('임대료 0이면 비율 0', () => {
      const result = calculateRentRatio({
        monthlySales: 5000000,
        monthlyRent: 0,
      });
      expect(result.rentRatio).toBe(0);
      expect(result.status).toBe('low');
    });
  });

  describe('실제 사용 시나리오', () => {
    it('소규모 카페: 월 매출 8000000, 임대료 1200000 → 비율 15%', () => {
      const result = calculateRentRatio({
        monthlySales: 8000000,
        monthlyRent: 1200000,
      });
      expect(result.rentRatio).toBe(15);
      expect(result.status).toBe('normal');
    });

    it('부담스러운 임대료: 월 매출 3000000, 임대료 800000 → 26.7%, high', () => {
      const result = calculateRentRatio({
        monthlySales: 3000000,
        monthlyRent: 800000,
      });
      expect(result.rentRatio).toBe(26.7);
      expect(result.status).toBe('high');
    });
  });
});
