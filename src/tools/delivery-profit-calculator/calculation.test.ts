import { describe, it, expect } from 'vitest';
import { calculateDeliveryProfit } from './calculation';

describe('배달 순이익 계산기 (calculateDeliveryProfit)', () => {
  describe('기본 계산 검증', () => {
    it('주문 3만원, 수수료 6.8%, 배달비 3000, 원가율 35% → 수익 양호', () => {
      const result = calculateDeliveryProfit({
        orderAmount: 30000,
        commissionRate: 6.8,
        deliveryFee: 3000,
        costRate: 35,
      });
      // appCommission = round(30000 * 0.068) = 2040
      expect(result.appCommission).toBe(2040);
      // paymentFee = round(30000 * 0.033) = 990
      expect(result.paymentFee).toBe(990);
      // costAmount = round(30000 * 0.35) = 10500
      expect(result.costAmount).toBe(10500);
      // netRevenue = 30000 - 2040 - 990 = 26970
      expect(result.netRevenue).toBe(26970);
      // netProfit = 26970 - 10500 - 3000 = 13470
      expect(result.netProfit).toBe(13470);
    });

    it('netProfitRate가 20% 이상이면 good 진단', () => {
      const result = calculateDeliveryProfit({
        orderAmount: 30000,
        commissionRate: 6.8,
        deliveryFee: 3000,
        costRate: 35,
      });
      expect(result.netProfitRate).toBeGreaterThanOrEqual(20);
      expect(result.diagnosisLevel).toBe('good');
    });
  });

  describe('높은 수수료 케이스', () => {
    it('수수료 12.5% (요기요) → 낮은 순이익', () => {
      const result = calculateDeliveryProfit({
        orderAmount: 20000,
        commissionRate: 12.5,
        deliveryFee: 3000,
        costRate: 50,
      });
      // appCommission = round(20000 * 0.125) = 2500
      expect(result.appCommission).toBe(2500);
      expect(result.netProfitRate).toBeLessThan(20);
    });
  });

  describe('손실 케이스', () => {
    it('고원가율 + 고수수료 → 순이익 음수 → danger 진단', () => {
      const result = calculateDeliveryProfit({
        orderAmount: 15000,
        commissionRate: 12.5,
        deliveryFee: 5000,
        costRate: 70,
      });
      expect(result.netProfit).toBeLessThan(0);
      expect(result.diagnosisLevel).toBe('danger');
    });
  });

  describe('totalDeduction 검증', () => {
    it('총 차감액 = 앱수수료 + PG수수료 + 원가 + 배달비', () => {
      const result = calculateDeliveryProfit({
        orderAmount: 25000,
        commissionRate: 9.8,
        deliveryFee: 3500,
        costRate: 40,
      });
      expect(result.totalDeduction).toBe(
        result.appCommission + result.paymentFee + result.costAmount + result.deliveryFee
      );
    });
  });

  describe('주문금액 0 처리', () => {
    it('주문금액 0이면 netProfitRate 0', () => {
      const result = calculateDeliveryProfit({
        orderAmount: 0,
        commissionRate: 6.8,
        deliveryFee: 0,
        costRate: 35,
      });
      expect(result.netProfitRate).toBe(0);
    });
  });
});
