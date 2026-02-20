import type { UnitPriceItem, UnitPriceResult } from './types';

/**
 * 단가 비교 계산 함수
 * 여러 상품의 단가를 계산하고 최저가 상품을 표시한다.
 */
export function calculateUnitPrice(items: UnitPriceItem[]): UnitPriceResult[] {
  // 유효한 항목만 필터링 (금액, 수량 모두 있는 것)
  const validItems = items.filter(
    (item) => item.totalPrice > 0 && item.quantity > 0
  );

  if (validItems.length === 0) return [];

  // 단가 계산
  const results = validItems.map((item) => ({
    ...item,
    unitPrice: item.totalPrice / item.quantity,
    isCheapest: false,
    diffFromCheapest: 0,
  }));

  // 최저가 찾기
  const minUnitPrice = Math.min(...results.map((r) => r.unitPrice));

  // 최저가 표시 및 차이 계산
  return results.map((r) => ({
    ...r,
    isCheapest: r.unitPrice === minUnitPrice,
    diffFromCheapest:
      minUnitPrice > 0
        ? Math.round(((r.unitPrice - minUnitPrice) / minUnitPrice) * 100 * 10) / 10
        : 0,
  }));
}
