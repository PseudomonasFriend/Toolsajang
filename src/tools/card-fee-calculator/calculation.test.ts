import { describe, it, expect } from 'vitest';
import { calculateCardFee } from './calculation';

describe('카드수수료 계산기 (calculateCardFee)', () => {
  describe('소상공인 우대수수료율 적용', () => {
    it('월매출 1000만원(연매출 1.2억)이면 우대수수료율 적용', () => {
      const result = calculateCardFee({
        monthlySales: 10000000,
        industry: 'general',
        businessType: 'general',
      });
      expect(result.isPreferentialRate).toBe(true);
      expect(result.averageFeeRate).toBe(0.5);
    });

    it('월매출 3000만원(연매출 3.6억)이면 일반수수료율 적용', () => {
      const result = calculateCardFee({
        monthlySales: 30000000,
        industry: 'general',
        businessType: 'general',
      });
      expect(result.isPreferentialRate).toBe(false);
      expect(result.averageFeeRate).toBeGreaterThan(1);
    });

    it('월매출 2500만원(연매출 3억 정확히)이면 우대수수료율 적용', () => {
      const result = calculateCardFee({
        monthlySales: 25000000,
        industry: 'general',
        businessType: 'general',
      });
      expect(result.isPreferentialRate).toBe(true);
    });
  });

  describe('카드사별 수수료 계산', () => {
    it('8개 카드사 수수료 정보가 반환됨', () => {
      const result = calculateCardFee({
        monthlySales: 10000000,
        industry: 'general',
        businessType: 'general',
      });
      expect(result.cardFees).toHaveLength(8);
    });

    it('각 카드사 수수료 금액은 월매출 x 수수료율', () => {
      const result = calculateCardFee({
        monthlySales: 10000000,
        industry: 'general',
        businessType: 'general',
      });
      for (const card of result.cardFees) {
        expect(card.feeAmount).toBe(Math.round(10000000 * (card.feeRate / 100)));
      }
    });
  });

  describe('실수령액 계산', () => {
    it('실수령액 = 월매출 - 월수수료합계', () => {
      const result = calculateCardFee({
        monthlySales: 10000000,
        industry: 'general',
        businessType: 'general',
      });
      expect(result.netAmount).toBe(10000000 - result.totalFee);
    });

    it('월매출 0이면 수수료 0, 실수령액 0', () => {
      const result = calculateCardFee({
        monthlySales: 0,
        industry: 'general',
        businessType: 'general',
      });
      expect(result.totalFee).toBe(0);
      expect(result.netAmount).toBe(0);
    });
  });

  describe('업종별 보정', () => {
    it('편의점은 일반보다 수수료율이 낮음', () => {
      const general = calculateCardFee({
        monthlySales: 10000000,
        industry: 'general',
        businessType: 'general',
      });
      const convenience = calculateCardFee({
        monthlySales: 10000000,
        industry: 'convenience',
        businessType: 'general',
      });
      expect(convenience.averageFeeRate).toBeLessThanOrEqual(general.averageFeeRate);
    });

    it('음식점은 기본 수수료율과 동일', () => {
      const general = calculateCardFee({
        monthlySales: 10000000,
        industry: 'general',
        businessType: 'general',
      });
      const restaurant = calculateCardFee({
        monthlySales: 10000000,
        industry: 'restaurant',
        businessType: 'general',
      });
      expect(restaurant.averageFeeRate).toBe(general.averageFeeRate);
    });
  });

  describe('사업자 유형 안내', () => {
    it('간이과세자는 부가세 감면 안내 포함', () => {
      const result = calculateCardFee({
        monthlySales: 10000000,
        industry: 'general',
        businessType: 'simplified',
      });
      expect(result.message).toContain('간이과세자');
    });

    it('면세사업자는 부가세 미포함 안내 포함', () => {
      const result = calculateCardFee({
        monthlySales: 10000000,
        industry: 'general',
        businessType: 'exempt',
      });
      expect(result.message).toContain('면세사업자');
    });
  });

  describe('실제 사용 시나리오', () => {
    it('동네 카페: 월 카드매출 800만원, 음식점, 일반과세자', () => {
      const result = calculateCardFee({
        monthlySales: 8000000,
        industry: 'restaurant',
        businessType: 'general',
      });
      expect(result.isPreferentialRate).toBe(true);
      expect(result.totalFee).toBe(Math.round(8000000 * (result.averageFeeRate / 100)));
      expect(result.netAmount).toBe(8000000 - result.totalFee);
    });
  });
});
