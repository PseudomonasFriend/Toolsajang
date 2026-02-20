import { describe, it, expect } from 'vitest';
import { calculateMargin } from './calculation';

describe('마진 계산기 (calculateMargin)', () => {
  // 기본 케이스: 부가세 미포함, 수수료/배송비/기타비용 없음
  describe('기본 마진 계산 (부가세 미포함)', () => {
    it('판매가 10000, 원가 5000일 때 순이익 5000, 마진율 50%', () => {
      const result = calculateMargin({
        sellingPrice: 10000,
        costPrice: 5000,
        commissionRate: 0,
        shippingCost: 0,
        otherCost: 0,
        includeVAT: false,
      });
      expect(result.netProfit).toBe(5000);
      expect(result.marginRate).toBe(50);
      expect(result.markupRate).toBe(100);
      expect(result.vatAmount).toBe(0);
      expect(result.commissionAmount).toBe(0);
    });

    it('원가와 판매가가 동일하면 순이익 0, 마진율 0%', () => {
      const result = calculateMargin({
        sellingPrice: 10000,
        costPrice: 10000,
        commissionRate: 0,
        shippingCost: 0,
        otherCost: 0,
        includeVAT: false,
      });
      expect(result.netProfit).toBe(0);
      expect(result.marginRate).toBe(0);
      expect(result.markupRate).toBe(0);
    });

    it('원가가 판매가보다 크면 순이익 음수', () => {
      const result = calculateMargin({
        sellingPrice: 5000,
        costPrice: 8000,
        commissionRate: 0,
        shippingCost: 0,
        otherCost: 0,
        includeVAT: false,
      });
      expect(result.netProfit).toBe(-3000);
      expect(result.marginRate).toBeLessThan(0);
    });
  });

  // 수수료 계산 테스트
  describe('수수료 계산', () => {
    it('판매가 10000, 수수료율 10%이면 수수료 1000', () => {
      const result = calculateMargin({
        sellingPrice: 10000,
        costPrice: 3000,
        commissionRate: 10,
        shippingCost: 0,
        otherCost: 0,
        includeVAT: false,
      });
      expect(result.commissionAmount).toBe(1000);
      // 순이익 = 10000 - 3000 - 1000 = 6000
      expect(result.netProfit).toBe(6000);
    });

    it('수수료율 0%이면 수수료 0', () => {
      const result = calculateMargin({
        sellingPrice: 50000,
        costPrice: 20000,
        commissionRate: 0,
        shippingCost: 0,
        otherCost: 0,
        includeVAT: false,
      });
      expect(result.commissionAmount).toBe(0);
    });
  });

  // 배송비·기타비용 테스트
  describe('배송비 및 기타비용 반영', () => {
    it('배송비 2000, 기타비용 1000이 순이익에서 차감됨', () => {
      const result = calculateMargin({
        sellingPrice: 20000,
        costPrice: 10000,
        commissionRate: 0,
        shippingCost: 2000,
        otherCost: 1000,
        includeVAT: false,
      });
      // 순이익 = 20000 - 10000 - 0 - 2000 - 1000 = 7000
      expect(result.netProfit).toBe(7000);
      expect(result.marginRate).toBeCloseTo(35, 0);
    });
  });

  // 부가세 포함 테스트
  describe('부가세 포함 계산', () => {
    it('VAT 포함 가격 11000일 때 공급가액 10000, 부가세 1000', () => {
      const result = calculateMargin({
        sellingPrice: 11000,
        costPrice: 5000,
        commissionRate: 0,
        shippingCost: 0,
        otherCost: 0,
        includeVAT: true,
      });
      // 공급가액 = round(11000 / 1.1) = 10000
      expect(result.vatAmount).toBe(1000);
      // 순이익 = 10000(공급가액) - 5000(원가) = 5000
      expect(result.netProfit).toBe(5000);
      expect(result.marginRate).toBe(50);
    });

    it('VAT 미포함이면 vatAmount가 0', () => {
      const result = calculateMargin({
        sellingPrice: 10000,
        costPrice: 5000,
        commissionRate: 0,
        shippingCost: 0,
        otherCost: 0,
        includeVAT: false,
      });
      expect(result.vatAmount).toBe(0);
    });
  });

  // 마크업률 테스트
  describe('마크업률 계산', () => {
    it('원가 5000, 순이익 5000이면 마크업률 100%', () => {
      const result = calculateMargin({
        sellingPrice: 10000,
        costPrice: 5000,
        commissionRate: 0,
        shippingCost: 0,
        otherCost: 0,
        includeVAT: false,
      });
      expect(result.markupRate).toBe(100);
    });

    it('원가 0이면 마크업률 0 (ZeroDivision 방지)', () => {
      const result = calculateMargin({
        sellingPrice: 10000,
        costPrice: 0,
        commissionRate: 0,
        shippingCost: 0,
        otherCost: 0,
        includeVAT: false,
      });
      expect(result.markupRate).toBe(0);
    });
  });

  // 종합 시나리오: 실제 소상공인 케이스
  describe('실제 사용 시나리오', () => {
    it('온라인 판매: 판매가 33000(VAT 포함), 원가 12000, 수수료 3%, 배송비 3000', () => {
      const result = calculateMargin({
        sellingPrice: 33000,
        costPrice: 12000,
        commissionRate: 3,
        shippingCost: 3000,
        otherCost: 0,
        includeVAT: true,
      });
      // 공급가액 = round(33000 / 1.1) = 30000
      // 수수료 = round(33000 * 0.03) = 990
      // 순이익 = 30000 - 12000 - 990 - 3000 = 14010
      expect(result.vatAmount).toBe(3000); // 33000 - 30000
      expect(result.commissionAmount).toBe(990);
      expect(result.netProfit).toBe(14010);
    });
  });
});
