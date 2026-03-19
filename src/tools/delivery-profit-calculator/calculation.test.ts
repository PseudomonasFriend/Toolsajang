import { describe, it, expect } from 'vitest';
import { calculateDeliveryProfit } from './calculation';

describe('배달 순이익 계산기 (calculateDeliveryProfit)', () => {
  describe('기본 순이익 계산', () => {
    it('주문금액 20000, 수수료율 6.8%, 배달비 3000, 원가율 35%', () => {
      const result = calculateDeliveryProfit({
        orderAmount: 20000,
        deliveryApp: 'baemin',
        commissionRate: 6.8,
        deliveryFee: 3000,
        costRate: 35,
      });
      // 앱 수수료 = round(20000 * 0.068) = 1360
      expect(result.appCommission).toBe(1360);
      // PG 수수료 = round(20000 * 0.033) = 660
      expect(result.paymentFee).toBe(660);
      // 원가 = round(20000 * 0.35) = 7000
      expect(result.costAmount).toBe(7000);
      // 실수령액 = 20000 - 1360 - 660 = 17980
      expect(result.netRevenue).toBe(17980);
      // 순이익 = 17980 - 7000 - 3000 = 7980
      expect(result.netProfit).toBe(7980);
    });

    it('주문금액 0이면 모든 결과 0', () => {
      const result = calculateDeliveryProfit({
        orderAmount: 0,
        deliveryApp: 'baemin',
        commissionRate: 6.8,
        deliveryFee: 0,
        costRate: 35,
      });
      expect(result.netProfit).toBe(0);
      expect(result.netProfitRate).toBe(0);
    });
  });

  describe('순이익률 계산', () => {
    it('순이익률은 소수점 1자리', () => {
      const result = calculateDeliveryProfit({
        orderAmount: 30000,
        deliveryApp: 'yogiyo',
        commissionRate: 12.5,
        deliveryFee: 3500,
        costRate: 30,
      });
      expect(result.netProfitRate).toBe(
        Math.round((result.netProfit / 30000) * 100 * 10) / 10
      );
    });
  });

  describe('진단 메시지', () => {
    it('높은 순이익률(20% 이상)이면 good 진단', () => {
      const result = calculateDeliveryProfit({
        orderAmount: 50000,
        deliveryApp: 'baemin',
        commissionRate: 6.8,
        deliveryFee: 0,
        costRate: 20,
      });
      expect(result.diagnosisLevel).toBe('good');
    });

    it('적자(순이익 음수)이면 danger 진단', () => {
      const result = calculateDeliveryProfit({
        orderAmount: 10000,
        deliveryApp: 'yogiyo',
        commissionRate: 12.5,
        deliveryFee: 5000,
        costRate: 60,
      });
      expect(result.netProfit).toBeLessThan(0);
      expect(result.diagnosisLevel).toBe('danger');
    });
  });

  describe('총 차감액 계산', () => {
    it('총 차감액 = 앱수수료 + PG수수료 + 원가 + 배달비', () => {
      const result = calculateDeliveryProfit({
        orderAmount: 25000,
        deliveryApp: 'coupangeats',
        commissionRate: 9.8,
        deliveryFee: 2500,
        costRate: 40,
      });
      expect(result.totalDeduction).toBe(
        result.appCommission + result.paymentFee + result.costAmount + result.deliveryFee
      );
    });
  });

  describe('실제 사용 시나리오', () => {
    it('배민 치킨집: 주문 22000원, 수수료 6.8%, 배달비 4000원, 원가율 38%', () => {
      const result = calculateDeliveryProfit({
        orderAmount: 22000,
        deliveryApp: 'baemin',
        commissionRate: 6.8,
        deliveryFee: 4000,
        costRate: 38,
      });
      expect(result.appCommission).toBe(Math.round(22000 * 0.068));
      expect(result.costAmount).toBe(Math.round(22000 * 0.38));
      expect(result.netRevenue).toBe(22000 - result.appCommission - result.paymentFee);
      expect(result.netProfit).toBe(result.netRevenue - result.costAmount - 4000);
    });
  });
});
