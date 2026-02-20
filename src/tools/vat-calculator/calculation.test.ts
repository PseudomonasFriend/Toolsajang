import { describe, it, expect } from 'vitest';
import { calculateVat } from './calculation';

describe('부가세 계산기 (calculateVat)', () => {
  // 공급가액 → 부가세·합계 (toTotal)
  describe('공급가액 → 합계 계산 (toTotal)', () => {
    it('공급가액 10000이면 부가세 1000, 합계 11000', () => {
      const result = calculateVat({ direction: 'toTotal', amount: 10000 });
      expect(result.supplyPrice).toBe(10000);
      expect(result.vatAmount).toBe(1000);
      expect(result.totalPrice).toBe(11000);
    });

    it('공급가액 100000이면 부가세 10000, 합계 110000', () => {
      const result = calculateVat({ direction: 'toTotal', amount: 100000 });
      expect(result.supplyPrice).toBe(100000);
      expect(result.vatAmount).toBe(10000);
      expect(result.totalPrice).toBe(110000);
    });

    it('공급가액 3333이면 부가세 333(반올림), 합계 3666', () => {
      const result = calculateVat({ direction: 'toTotal', amount: 3333 });
      // 3333 * 0.1 = 333.3 → round → 333
      expect(result.vatAmount).toBe(333);
      expect(result.totalPrice).toBe(3666);
    });

    it('공급가액 0이면 모두 0', () => {
      const result = calculateVat({ direction: 'toTotal', amount: 0 });
      expect(result.supplyPrice).toBe(0);
      expect(result.vatAmount).toBe(0);
      expect(result.totalPrice).toBe(0);
    });

    it('공급가액 1이면 부가세 0(반올림), 합계 1', () => {
      const result = calculateVat({ direction: 'toTotal', amount: 1 });
      // 1 * 0.1 = 0.1 → round → 0
      expect(result.vatAmount).toBe(0);
      expect(result.totalPrice).toBe(1);
    });
  });

  // 합계(VAT 포함) → 공급가액·부가세 (toSupply)
  describe('합계 → 공급가액 계산 (toSupply)', () => {
    it('합계 11000이면 공급가액 10000, 부가세 1000', () => {
      const result = calculateVat({ direction: 'toSupply', amount: 11000 });
      expect(result.supplyPrice).toBe(10000);
      expect(result.vatAmount).toBe(1000);
      expect(result.totalPrice).toBe(11000);
    });

    it('합계 110000이면 공급가액 100000, 부가세 10000', () => {
      const result = calculateVat({ direction: 'toSupply', amount: 110000 });
      expect(result.supplyPrice).toBe(100000);
      expect(result.vatAmount).toBe(10000);
      expect(result.totalPrice).toBe(110000);
    });

    it('합계 10000이면 공급가액 9091, 부가세 909', () => {
      const result = calculateVat({ direction: 'toSupply', amount: 10000 });
      // round(10000 / 1.1) = round(9090.909...) = 9091
      expect(result.supplyPrice).toBe(9091);
      expect(result.vatAmount).toBe(909); // 10000 - 9091
      expect(result.totalPrice).toBe(10000);
    });

    it('공급가액 + 부가세 = 합계(원금 보존)', () => {
      const amounts = [5500, 22000, 33000, 55000, 110000];
      amounts.forEach((amount) => {
        const result = calculateVat({ direction: 'toSupply', amount });
        expect(result.supplyPrice + result.vatAmount).toBe(amount);
        expect(result.totalPrice).toBe(amount);
      });
    });

    it('합계 0이면 모두 0', () => {
      const result = calculateVat({ direction: 'toSupply', amount: 0 });
      expect(result.supplyPrice).toBe(0);
      expect(result.vatAmount).toBe(0);
      expect(result.totalPrice).toBe(0);
    });
  });

  // 일관성 검증: toTotal 후 toSupply 하면 원래 값 복원
  describe('toTotal ↔ toSupply 일관성', () => {
    it('10000 → toTotal → toSupply 하면 공급가액 10000 복원', () => {
      const forward = calculateVat({ direction: 'toTotal', amount: 10000 });
      const backward = calculateVat({ direction: 'toSupply', amount: forward.totalPrice });
      // 부동소수점 반올림으로 ±1 허용
      expect(Math.abs(backward.supplyPrice - 10000)).toBeLessThanOrEqual(1);
    });

    it('세금계산서 일반 금액(50000) 왕복 테스트', () => {
      const forward = calculateVat({ direction: 'toTotal', amount: 50000 });
      expect(forward.totalPrice).toBe(55000);
      const backward = calculateVat({ direction: 'toSupply', amount: 55000 });
      expect(backward.supplyPrice).toBe(50000);
    });
  });

  // 실제 소상공인 시나리오
  describe('실제 사용 시나리오', () => {
    it('식당 매출 세금계산서: 공급가액 1500000 → 부가세 150000, 합계 1650000', () => {
      const result = calculateVat({ direction: 'toTotal', amount: 1500000 });
      expect(result.vatAmount).toBe(150000);
      expect(result.totalPrice).toBe(1650000);
    });

    it('카드 매출 역산: 합계 330000 → 공급가액 300000, 부가세 30000', () => {
      const result = calculateVat({ direction: 'toSupply', amount: 330000 });
      expect(result.supplyPrice).toBe(300000);
      expect(result.vatAmount).toBe(30000);
    });
  });
});
