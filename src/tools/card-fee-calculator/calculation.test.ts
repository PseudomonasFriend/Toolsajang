import { describe, it, expect } from 'vitest';
import { calculateCardFee } from './calculation';

describe('카드수수료 계산기 (calculateCardFee)', () => {
  describe('우대수수료율 적용 (연매출 3억 이하)', () => {
    it('월 1000만원 → 연 1.2억 → 우대수수료율 적용, 평균 0.5%', () => {
      const result = calculateCardFee({
        monthlySales: 10000000,
        industry: 'restaurant',
        businessType: 'general',
      });
      expect(result.isPreferentialRate).toBe(true);
      expect(result.averageFeeRate).toBe(0.5);
      expect(result.totalFee).toBe(50000);
      expect(result.netAmount).toBe(9950000);
    });

    it('월 2500만원 → 연 3억 → 우대수수료율 경계값 적용', () => {
      const result = calculateCardFee({
        monthlySales: 25000000,
        industry: 'restaurant',
        businessType: 'general',
      });
      expect(result.isPreferentialRate).toBe(true);
    });

    it('cardFees 배열에 8개 카드사 포함', () => {
      const result = calculateCardFee({
        monthlySales: 5000000,
        industry: 'restaurant',
        businessType: 'general',
      });
      expect(result.cardFees).toHaveLength(8);
    });
  });

  describe('일반수수료율 적용 (연매출 3억 초과)', () => {
    it('월 3000만원 → 연 3.6억 → 일반수수료율 적용', () => {
      const result = calculateCardFee({
        monthlySales: 30000000,
        industry: 'restaurant',
        businessType: 'general',
      });
      expect(result.isPreferentialRate).toBe(false);
      expect(result.averageFeeRate).toBeGreaterThan(1.5);
    });
  });

  describe('편의점 업종 수수료 보정', () => {
    it('편의점은 음식점 대비 수수료율이 낮음 (0.95 보정)', () => {
      const restaurant = calculateCardFee({
        monthlySales: 10000000,
        industry: 'restaurant',
        businessType: 'general',
      });
      const convenience = calculateCardFee({
        monthlySales: 10000000,
        industry: 'convenience',
        businessType: 'general',
      });
      expect(convenience.totalFee).toBeLessThanOrEqual(restaurant.totalFee);
    });
  });

  describe('간이과세자/면세사업자 안내 메시지', () => {
    it('간이과세자면 관련 안내 메시지 포함', () => {
      const result = calculateCardFee({
        monthlySales: 5000000,
        industry: 'restaurant',
        businessType: 'simplified',
      });
      expect(result.message).toContain('간이과세자');
    });

    it('면세사업자면 관련 안내 메시지 포함', () => {
      const result = calculateCardFee({
        monthlySales: 5000000,
        industry: 'restaurant',
        businessType: 'exempt',
      });
      expect(result.message).toContain('면세사업자');
    });
  });

  describe('netAmount 검증', () => {
    it('실수령액 = 월매출 - 총 수수료', () => {
      const result = calculateCardFee({
        monthlySales: 8000000,
        industry: 'restaurant',
        businessType: 'general',
      });
      expect(result.netAmount).toBe(result.cardFees[0]
        ? 8000000 - result.totalFee
        : 8000000);
    });
  });
});
