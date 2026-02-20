import { describe, it, expect } from 'vitest';
import { calculateDiscountPrice } from './calculation';

describe('할인가 역산 계산기 (calculateDiscountPrice)', () => {
  describe('기본 할인가 계산', () => {
    it('정가 10000, 할인율 10%이면 할인금액 1000, 할인가 9000', () => {
      const result = calculateDiscountPrice({ originalPrice: 10000, discountRate: 10 });
      expect(result.discountAmount).toBe(1000);
      expect(result.discountedPrice).toBe(9000);
    });

    it('정가 50000, 할인율 30%이면 할인금액 15000, 할인가 35000', () => {
      const result = calculateDiscountPrice({ originalPrice: 50000, discountRate: 30 });
      expect(result.discountAmount).toBe(15000);
      expect(result.discountedPrice).toBe(35000);
    });

    it('할인가 = 정가 - 할인금액', () => {
      const cases = [
        { originalPrice: 19900, discountRate: 15 },
        { originalPrice: 35000, discountRate: 25 },
        { originalPrice: 99000, discountRate: 50 },
      ];
      cases.forEach(({ originalPrice, discountRate }) => {
        const result = calculateDiscountPrice({ originalPrice, discountRate });
        expect(result.discountedPrice).toBe(originalPrice - result.discountAmount);
      });
    });
  });

  describe('경계 케이스', () => {
    it('할인율 0%이면 할인금액 0, 할인가 = 정가', () => {
      const result = calculateDiscountPrice({ originalPrice: 30000, discountRate: 0 });
      expect(result.discountAmount).toBe(0);
      expect(result.discountedPrice).toBe(30000);
    });

    it('할인율 100%이면 할인금액 = 정가, 할인가 0', () => {
      const result = calculateDiscountPrice({ originalPrice: 20000, discountRate: 100 });
      expect(result.discountAmount).toBe(20000);
      expect(result.discountedPrice).toBe(0);
    });

    it('정가 0이면 할인금액 0, 할인가 0', () => {
      const result = calculateDiscountPrice({ originalPrice: 0, discountRate: 50 });
      expect(result.discountAmount).toBe(0);
      expect(result.discountedPrice).toBe(0);
    });

    it('소수점 반올림 처리: 정가 3333, 할인율 10% → 할인금액 333', () => {
      const result = calculateDiscountPrice({ originalPrice: 3333, discountRate: 10 });
      // round(3333 * 10 / 100) = round(333.3) = 333
      expect(result.discountAmount).toBe(333);
      expect(result.discountedPrice).toBe(3000);
    });
  });

  describe('실제 사용 시나리오', () => {
    it('의류 할인 행사: 정가 89000, 할인율 40%', () => {
      const result = calculateDiscountPrice({ originalPrice: 89000, discountRate: 40 });
      // round(89000 * 40 / 100) = round(35600) = 35600
      expect(result.discountAmount).toBe(35600);
      expect(result.discountedPrice).toBe(53400);
    });

    it('편의점 1+1 행사 (50% 할인): 정가 2800, 할인율 50%', () => {
      const result = calculateDiscountPrice({ originalPrice: 2800, discountRate: 50 });
      expect(result.discountAmount).toBe(1400);
      expect(result.discountedPrice).toBe(1400);
    });

    it('블랙프라이데이 70% 할인: 정가 150000', () => {
      const result = calculateDiscountPrice({ originalPrice: 150000, discountRate: 70 });
      expect(result.discountAmount).toBe(105000);
      expect(result.discountedPrice).toBe(45000);
    });
  });
});
