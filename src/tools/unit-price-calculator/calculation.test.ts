import { describe, it, expect } from 'vitest';
import { calculateUnitPrice } from './calculation';

describe('단가 비교 계산기 (calculateUnitPrice)', () => {
  describe('기본 단가 계산', () => {
    it('단일 상품의 단가 = 총 금액 / 수량', () => {
      const results = calculateUnitPrice([
        { name: '상품A', totalPrice: 10000, quantity: 5, unit: '개' },
      ]);
      expect(results).toHaveLength(1);
      expect(results[0].unitPrice).toBe(2000);
    });

    it('여러 상품의 단가 각각 계산', () => {
      const results = calculateUnitPrice([
        { name: '소', totalPrice: 9000, quantity: 3, unit: '개' },
        { name: '중', totalPrice: 14000, quantity: 4, unit: '개' },
        { name: '대', totalPrice: 20000, quantity: 8, unit: '개' },
      ]);
      expect(results[0].unitPrice).toBe(3000);
      expect(results[1].unitPrice).toBe(3500);
      expect(results[2].unitPrice).toBe(2500);
    });
  });

  describe('최저가 표시 (isCheapest)', () => {
    it('단가 가장 낮은 상품이 isCheapest = true', () => {
      const results = calculateUnitPrice([
        { name: '소형', totalPrice: 3000, quantity: 1, unit: '개' },
        { name: '대형', totalPrice: 8000, quantity: 4, unit: '개' },
      ]);
      const cheapest = results.find((r) => r.isCheapest);
      expect(cheapest!.name).toBe('대형'); // 단가 2000 < 3000
    });

    it('단일 상품이면 항상 isCheapest = true', () => {
      const results = calculateUnitPrice([
        { name: '테스트', totalPrice: 5000, quantity: 2, unit: 'L' },
      ]);
      expect(results[0].isCheapest).toBe(true);
    });

    it('단가 동일한 경우 모두 isCheapest = true', () => {
      const results = calculateUnitPrice([
        { name: 'A', totalPrice: 10000, quantity: 5, unit: '개' },
        { name: 'B', totalPrice: 20000, quantity: 10, unit: '개' },
      ]);
      // 둘 다 단가 2000 → 둘 다 isCheapest
      expect(results.every((r) => r.isCheapest)).toBe(true);
    });
  });

  describe('최저가 대비 차이 (diffFromCheapest)', () => {
    it('최저가 상품의 diffFromCheapest = 0', () => {
      const results = calculateUnitPrice([
        { name: '저렴', totalPrice: 4000, quantity: 4, unit: '개' }, // 단가 1000
        { name: '비쌈', totalPrice: 3000, quantity: 2, unit: '개' }, // 단가 1500
      ]);
      const cheapest = results.find((r) => r.isCheapest)!;
      expect(cheapest.diffFromCheapest).toBe(0);
    });

    it('비싼 상품의 diffFromCheapest > 0', () => {
      const results = calculateUnitPrice([
        { name: '저렴', totalPrice: 4000, quantity: 4, unit: '개' }, // 단가 1000
        { name: '비쌈', totalPrice: 3000, quantity: 2, unit: '개' }, // 단가 1500
      ]);
      const expensive = results.find((r) => !r.isCheapest)!;
      // (1500 - 1000) / 1000 * 100 = 50%
      expect(expensive.diffFromCheapest).toBe(50);
    });

    it('차이 계산: 소수점 1자리', () => {
      const results = calculateUnitPrice([
        { name: 'A', totalPrice: 10000, quantity: 3, unit: '개' }, // 3333.3...
        { name: 'B', totalPrice: 10000, quantity: 4, unit: '개' }, // 2500
      ]);
      const expensive = results.find((r) => !r.isCheapest)!;
      // (3333.3 - 2500) / 2500 * 100 = 33.3%
      expect(expensive.diffFromCheapest).toBeCloseTo(33.3, 0);
    });
  });

  describe('유효하지 않은 항목 필터링', () => {
    it('총 금액 0인 항목 필터링', () => {
      const results = calculateUnitPrice([
        { name: '유효', totalPrice: 5000, quantity: 2, unit: '개' },
        { name: '무효', totalPrice: 0, quantity: 3, unit: '개' },
      ]);
      expect(results).toHaveLength(1);
      expect(results[0].name).toBe('유효');
    });

    it('수량 0인 항목 필터링', () => {
      const results = calculateUnitPrice([
        { name: '유효', totalPrice: 5000, quantity: 2, unit: '개' },
        { name: '무효', totalPrice: 3000, quantity: 0, unit: '개' },
      ]);
      expect(results).toHaveLength(1);
    });

    it('빈 배열이면 빈 배열 반환', () => {
      const results = calculateUnitPrice([]);
      expect(results).toHaveLength(0);
    });

    it('모든 항목이 유효하지 않으면 빈 배열 반환', () => {
      const results = calculateUnitPrice([
        { name: '무효1', totalPrice: 0, quantity: 1, unit: '개' },
        { name: '무효2', totalPrice: 1000, quantity: 0, unit: '개' },
      ]);
      expect(results).toHaveLength(0);
    });
  });

  describe('실제 사용 시나리오', () => {
    it('음료 용량별 단가 비교: 소(355ml, 1800원), 중(500ml, 2200원), 대(1L, 3500원)', () => {
      const results = calculateUnitPrice([
        { name: '소', totalPrice: 1800, quantity: 355, unit: 'ml' },
        { name: '중', totalPrice: 2200, quantity: 500, unit: 'ml' },
        { name: '대', totalPrice: 3500, quantity: 1000, unit: 'ml' },
      ]);
      // 단가: 소 ≈ 5.07, 중 = 4.4, 대 = 3.5 → 대가 최저
      const cheapest = results.find((r) => r.isCheapest)!;
      expect(cheapest.name).toBe('대');
    });

    it('쌀 포장별 비교: 5kg(25000), 10kg(45000), 20kg(80000)', () => {
      const results = calculateUnitPrice([
        { name: '5kg', totalPrice: 25000, quantity: 5, unit: 'kg' },
        { name: '10kg', totalPrice: 45000, quantity: 10, unit: 'kg' },
        { name: '20kg', totalPrice: 80000, quantity: 20, unit: 'kg' },
      ]);
      // 단가: 5000, 4500, 4000 → 20kg이 최저
      const cheapest = results.find((r) => r.isCheapest)!;
      expect(cheapest.name).toBe('20kg');
      expect(cheapest.unitPrice).toBe(4000);
    });
  });
});
