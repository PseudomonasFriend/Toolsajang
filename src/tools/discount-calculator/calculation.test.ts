import { describe, it, expect } from 'vitest';
import { calculateDiscount } from './calculation';

describe('할인율 계산기 (calculateDiscount)', () => {
  describe('기본 할인 계산', () => {
    it('판매가 10000, 원가 6000, 할인율 10%이면 할인가 9000, 할인금액 1000', () => {
      const result = calculateDiscount({
        originalPrice: 10000,
        costPrice: 6000,
        discountRate: 10,
      });
      expect(result.discountAmount).toBe(1000);
      expect(result.discountedPrice).toBe(9000);
    });

    it('할인율 0%이면 할인 금액 0, 할인가 = 원래 판매가', () => {
      const result = calculateDiscount({
        originalPrice: 20000,
        costPrice: 10000,
        discountRate: 0,
      });
      expect(result.discountAmount).toBe(0);
      expect(result.discountedPrice).toBe(20000);
    });

    it('할인율 100%이면 할인가 0', () => {
      const result = calculateDiscount({
        originalPrice: 10000,
        costPrice: 3000,
        discountRate: 100,
      });
      expect(result.discountedPrice).toBe(0);
    });
  });

  describe('원래 마진 계산', () => {
    it('판매가 10000, 원가 6000이면 원래 마진 4000, 마진율 40%', () => {
      const result = calculateDiscount({
        originalPrice: 10000,
        costPrice: 6000,
        discountRate: 10,
      });
      expect(result.originalMargin).toBe(4000);
      expect(result.originalMarginRate).toBe(40);
    });

    it('판매가 = 원가이면 원래 마진 0', () => {
      const result = calculateDiscount({
        originalPrice: 10000,
        costPrice: 10000,
        discountRate: 5,
      });
      expect(result.originalMargin).toBe(0);
      expect(result.originalMarginRate).toBe(0);
    });

    it('판매가 0이면 원래 마진율 0 (ZeroDivision 방지)', () => {
      const result = calculateDiscount({
        originalPrice: 0,
        costPrice: 0,
        discountRate: 10,
      });
      expect(result.originalMarginRate).toBe(0);
    });
  });

  describe('할인 후 마진 계산', () => {
    it('판매가 10000, 원가 6000, 할인율 20%이면 할인 후 마진 2000', () => {
      const result = calculateDiscount({
        originalPrice: 10000,
        costPrice: 6000,
        discountRate: 20,
      });
      // 할인가 = 10000 - 2000 = 8000
      // 할인 후 마진 = 8000 - 6000 = 2000
      expect(result.discountedMargin).toBe(2000);
    });

    it('할인 후 마진이 음수: 원가 이하로 판매', () => {
      const result = calculateDiscount({
        originalPrice: 10000,
        costPrice: 9000,
        discountRate: 20,
      });
      // 할인가 = 8000, 마진 = 8000 - 9000 = -1000
      expect(result.discountedMargin).toBe(-1000);
    });
  });

  describe('마진 감소 계산', () => {
    it('마진 감소액 = 원래 마진 - 할인 후 마진', () => {
      const result = calculateDiscount({
        originalPrice: 10000,
        costPrice: 5000,
        discountRate: 10,
      });
      // 원래 마진 = 5000, 할인가 = 9000, 할인 후 마진 = 4000
      // 마진 감소 = 5000 - 4000 = 1000
      expect(result.marginDrop).toBe(result.originalMargin - result.discountedMargin);
      expect(result.marginDrop).toBe(1000);
    });

    it('원래 마진 0이면 마진 감소율 0 (ZeroDivision 방지)', () => {
      const result = calculateDiscount({
        originalPrice: 10000,
        costPrice: 10000,
        discountRate: 10,
      });
      expect(result.marginDropRate).toBe(0);
    });
  });

  describe('필요 판매량 증가율 계산', () => {
    it('할인 후 마진이 양수이면 필요 판매량 증가율 계산', () => {
      const result = calculateDiscount({
        originalPrice: 10000,
        costPrice: 5000,
        discountRate: 10,
      });
      // 원래 마진 5000, 할인 후 마진 4000
      // 필요 증가율 = (5000/4000 - 1) * 100 = 25%
      expect(result.requiredSalesIncrease).toBe(25);
    });

    it('할인 후 마진이 0 이하이면 필요 판매량 증가율 0 반환', () => {
      const result = calculateDiscount({
        originalPrice: 10000,
        costPrice: 9500,
        discountRate: 10,
      });
      // 할인가 9000 < 원가 9500 → 마진 음수
      expect(result.requiredSalesIncrease).toBe(0);
    });
  });

  describe('실제 사용 시나리오', () => {
    it('편의점 도시락: 판매가 5800, 원가 4000, 10% 할인 행사', () => {
      const result = calculateDiscount({
        originalPrice: 5800,
        costPrice: 4000,
        discountRate: 10,
      });
      // 할인가 = 5800 - 580 = 5220
      expect(result.discountAmount).toBe(580);
      expect(result.discountedPrice).toBe(5220);
      // 원래 마진 = 1800
      expect(result.originalMargin).toBe(1800);
      // 할인 후 마진 = 5220 - 4000 = 1220
      expect(result.discountedMargin).toBe(1220);
    });

    it('의류점: 판매가 50000, 원가 15000, 30% 할인', () => {
      const result = calculateDiscount({
        originalPrice: 50000,
        costPrice: 15000,
        discountRate: 30,
      });
      // 할인가 = 35000
      expect(result.discountedPrice).toBe(35000);
      // 할인 후 마진 = 20000
      expect(result.discountedMargin).toBe(20000);
      // 원래 마진율 = (35000/50000)*100 = 70%
      expect(result.originalMarginRate).toBe(70);
    });
  });
});
