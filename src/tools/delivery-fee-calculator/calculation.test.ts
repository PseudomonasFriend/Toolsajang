import { describe, it, expect } from 'vitest';
import { calculateDeliveryFee, findBestPlatformIndex, PLATFORM_PRESETS } from './calculation';

describe('배달앱 수수료 계산기 (calculateDeliveryFee)', () => {
  const baseInput = {
    menuPrice: 15000,
    menuCost: 5000,
    deliveryFee: 0,
    additionalCost: 0,
  };

  describe('플랫폼별 수수료 계산', () => {
    it('결과 배열 길이는 프리셋 수 + 1 (직접 입력 포함)', () => {
      const results = calculateDeliveryFee(baseInput, 10);
      expect(results).toHaveLength(PLATFORM_PRESETS.length + 1);
    });

    it('수수료 금액 = round(메뉴가 * 수수료율 / 100)', () => {
      const results = calculateDeliveryFee(baseInput, 0);
      // 배달의민족 6.8%
      const baemin = results.find((r) => r.platformId === 'baemin');
      expect(baemin).toBeDefined();
      expect(baemin!.commissionAmount).toBe(Math.round(15000 * 6.8 / 100));
    });

    it('실수령액 = 메뉴가 - 수수료금액', () => {
      const results = calculateDeliveryFee(baseInput, 0);
      results.forEach((r) => {
        expect(r.netRevenue).toBe(baseInput.menuPrice - r.commissionAmount);
      });
    });

    it('순이익 = 실수령액 - 원가 - 추가비용', () => {
      const results = calculateDeliveryFee(baseInput, 0);
      results.forEach((r) => {
        const expected = r.netRevenue - baseInput.menuCost - baseInput.additionalCost;
        expect(r.netProfit).toBe(expected);
      });
    });

    it('수수료율이 낮을수록 순이익이 높다', () => {
      const results = calculateDeliveryFee(baseInput, 0);
      const baemin = results.find((r) => r.platformId === 'baemin')!;
      const yogiyo = results.find((r) => r.platformId === 'yogiyo')!;
      // 배민(6.8%) < 요기요(12.5%) → 배민 순이익 더 높음
      expect(baemin.netProfit).toBeGreaterThan(yogiyo.netProfit);
    });
  });

  describe('직접 입력 플랫폼', () => {
    it('직접 입력 수수료율 0%이면 수수료 0', () => {
      const results = calculateDeliveryFee(baseInput, 0);
      const custom = results.find((r) => r.platformId === 'custom')!;
      expect(custom.commissionAmount).toBe(0);
      expect(custom.netRevenue).toBe(baseInput.menuPrice);
    });

    it('직접 입력 수수료율 100%이면 실수령액 0', () => {
      const results = calculateDeliveryFee(baseInput, 100);
      const custom = results.find((r) => r.platformId === 'custom')!;
      expect(custom.netRevenue).toBe(0);
    });
  });

  describe('추가 비용 반영', () => {
    it('추가비용이 있으면 순이익에서 차감된다', () => {
      const inputWithCost = { ...baseInput, additionalCost: 500 };
      const baseResults = calculateDeliveryFee(baseInput, 10);
      const withCostResults = calculateDeliveryFee(inputWithCost, 10);

      withCostResults.forEach((r, i) => {
        expect(r.netProfit).toBe(baseResults[i].netProfit - 500);
      });
    });
  });

  describe('순이익률 계산', () => {
    it('메뉴가 > 0이면 순이익률 = (순이익/메뉴가)*100 (소수점 1자리)', () => {
      const results = calculateDeliveryFee({ ...baseInput, additionalCost: 0 }, 0);
      results.forEach((r) => {
        const expected = Math.round((r.netProfit / baseInput.menuPrice) * 1000) / 10;
        expect(r.profitRate).toBe(expected);
      });
    });

    it('메뉴가 0이면 순이익률 0 (ZeroDivision 방지)', () => {
      const zeroInput = { ...baseInput, menuPrice: 0 };
      const results = calculateDeliveryFee(zeroInput, 10);
      results.forEach((r) => {
        expect(r.profitRate).toBe(0);
      });
    });
  });

  describe('findBestPlatformIndex (최저 수수료 플랫폼)', () => {
    it('빈 배열이면 -1 반환', () => {
      expect(findBestPlatformIndex([])).toBe(-1);
    });

    it('수수료율 낮은 플랫폼이 최고 순이익 — 해당 인덱스 반환', () => {
      const results = calculateDeliveryFee(baseInput, 15);
      const bestIndex = findBestPlatformIndex(results);
      const bestResult = results[bestIndex];
      // 직접 입력 15%가 가장 낮은 수수료가 아님 — 배민(6.8%)이 가장 낮음
      expect(bestResult.platformId).toBe('baemin');
    });

    it('수수료 0% 직접 입력이면 직접 입력이 최고 순이익', () => {
      const results = calculateDeliveryFee(baseInput, 0);
      const bestIndex = findBestPlatformIndex(results);
      expect(results[bestIndex].platformId).toBe('custom');
    });
  });

  describe('실제 사용 시나리오', () => {
    it('치킨집: 메뉴가 20000, 원가 8000, 추가비용 500원', () => {
      const results = calculateDeliveryFee(
        { menuPrice: 20000, menuCost: 8000, deliveryFee: 0, additionalCost: 500 },
        10
      );
      const baemin = results.find((r) => r.platformId === 'baemin')!;
      // 수수료 = round(20000 * 0.068) = 1360
      expect(baemin.commissionAmount).toBe(1360);
      // 실수령 = 20000 - 1360 = 18640
      expect(baemin.netRevenue).toBe(18640);
      // 순이익 = 18640 - 8000 - 500 = 10140
      expect(baemin.netProfit).toBe(10140);
    });
  });
});
