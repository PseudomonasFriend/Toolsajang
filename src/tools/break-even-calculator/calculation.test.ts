import { describe, it, expect } from 'vitest';
import { calculateBreakEven } from './calculation';

describe('손익분기점 계산기 (calculateBreakEven)', () => {
  // 기본 BEP 계산
  describe('기본 손익분기점 계산', () => {
    it('판매가 10000, 변동비 6000, 고정비 100000이면 BEP 수량 25개', () => {
      const result = calculateBreakEven({
        sellingPrice: 10000,
        variableCost: 6000,
        fixedCost: 100000,
      });
      // 공헌이익 = 10000 - 6000 = 4000
      // BEP 수량 = ceil(100000 / 4000) = 25
      expect(result.contributionMargin).toBe(4000);
      expect(result.breakEvenQuantity).toBe(25);
      expect(result.breakEvenRevenue).toBe(250000);
    });

    it('판매가 5000, 변동비 2000, 고정비 90000이면 BEP 수량 30개', () => {
      const result = calculateBreakEven({
        sellingPrice: 5000,
        variableCost: 2000,
        fixedCost: 90000,
      });
      // 공헌이익 = 5000 - 2000 = 3000
      // BEP = ceil(90000 / 3000) = 30
      expect(result.breakEvenQuantity).toBe(30);
      expect(result.breakEvenRevenue).toBe(150000);
    });

    it('나누어 떨어지지 않는 경우 BEP 수량 올림 처리', () => {
      const result = calculateBreakEven({
        sellingPrice: 10000,
        variableCost: 7000,
        fixedCost: 100000,
      });
      // 공헌이익 = 3000
      // BEP = ceil(100000 / 3000) = ceil(33.33...) = 34
      expect(result.breakEvenQuantity).toBe(34);
      expect(result.breakEvenRevenue).toBe(340000);
    });
  });

  // 공헌이익률 테스트
  describe('공헌이익률 계산', () => {
    it('판매가 10000, 변동비 6000이면 공헌이익률 40%', () => {
      const result = calculateBreakEven({
        sellingPrice: 10000,
        variableCost: 6000,
        fixedCost: 100000,
      });
      expect(result.contributionRate).toBe(40);
    });

    it('판매가 20000, 변동비 15000이면 공헌이익률 25%', () => {
      const result = calculateBreakEven({
        sellingPrice: 20000,
        variableCost: 15000,
        fixedCost: 200000,
      });
      expect(result.contributionRate).toBe(25);
    });

    it('공헌이익률 소수점 1자리 반올림', () => {
      const result = calculateBreakEven({
        sellingPrice: 3000,
        variableCost: 1000,
        fixedCost: 60000,
      });
      // 공헌이익률 = (2000 / 3000) * 100 = 66.666... → 66.7
      expect(result.contributionRate).toBe(66.7);
    });
  });

  // 경계 케이스: 공헌이익 0 이하
  describe('공헌이익이 0 이하인 경우 (계산 불가)', () => {
    it('변동비 = 판매가이면 공헌이익 0, BEP 0 반환', () => {
      const result = calculateBreakEven({
        sellingPrice: 10000,
        variableCost: 10000,
        fixedCost: 100000,
      });
      expect(result.contributionMargin).toBe(0);
      expect(result.breakEvenQuantity).toBe(0);
      expect(result.breakEvenRevenue).toBe(0);
    });

    it('변동비 > 판매가이면 공헌이익 음수, BEP 0 반환', () => {
      const result = calculateBreakEven({
        sellingPrice: 5000,
        variableCost: 8000,
        fixedCost: 100000,
      });
      expect(result.contributionMargin).toBe(-3000);
      expect(result.breakEvenQuantity).toBe(0);
      expect(result.breakEvenRevenue).toBe(0);
    });
  });

  // 판매가 0 경우
  describe('판매가 0인 경우', () => {
    it('판매가 0이면 공헌이익률 0', () => {
      const result = calculateBreakEven({
        sellingPrice: 0,
        variableCost: 0,
        fixedCost: 100000,
      });
      expect(result.contributionRate).toBe(0);
      expect(result.breakEvenQuantity).toBe(0);
    });
  });

  // BEP 매출액 검증
  describe('BEP 매출액 = BEP 수량 × 판매가', () => {
    it('BEP 매출액이 항상 BEP 수량 × 판매가와 일치', () => {
      const cases = [
        { sellingPrice: 10000, variableCost: 4000, fixedCost: 300000 },
        { sellingPrice: 25000, variableCost: 15000, fixedCost: 500000 },
        { sellingPrice: 3000, variableCost: 1500, fixedCost: 45000 },
      ];
      cases.forEach(({ sellingPrice, variableCost, fixedCost }) => {
        const result = calculateBreakEven({ sellingPrice, variableCost, fixedCost });
        expect(result.breakEvenRevenue).toBe(result.breakEvenQuantity * sellingPrice);
      });
    });
  });

  // 실제 소상공인 시나리오
  describe('실제 사용 시나리오', () => {
    it('카페: 아메리카노 4500원, 변동비 1200원, 월 고정비 2500000원', () => {
      const result = calculateBreakEven({
        sellingPrice: 4500,
        variableCost: 1200,
        fixedCost: 2500000,
      });
      // 공헌이익 = 4500 - 1200 = 3300
      // BEP = ceil(2500000 / 3300) = ceil(757.57...) = 758
      expect(result.contributionMargin).toBe(3300);
      expect(result.breakEvenQuantity).toBe(758);
      expect(result.breakEvenRevenue).toBe(758 * 4500);
    });

    it('편의점 도시락: 판매가 5800원, 변동비 4500원, 월 고정비 3000000원', () => {
      const result = calculateBreakEven({
        sellingPrice: 5800,
        variableCost: 4500,
        fixedCost: 3000000,
      });
      // 공헌이익 = 1300
      // BEP = ceil(3000000 / 1300) = ceil(2307.69...) = 2308
      expect(result.contributionMargin).toBe(1300);
      expect(result.breakEvenQuantity).toBe(2308);
    });
  });
});
