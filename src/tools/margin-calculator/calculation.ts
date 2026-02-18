import type { MarginInput, MarginOutput } from './types';

/**
 * 마진 계산 함수
 * 판매가, 원가, 수수료, 배송비, 기타비용, 부가세 포함 여부를 기반으로
 * 순이익, 마진율, 마크업률 등을 계산한다.
 */
export function calculateMargin(input: MarginInput): MarginOutput {
  const {
    sellingPrice,
    costPrice,
    commissionRate,
    shippingCost,
    otherCost,
    includeVAT,
  } = input;

  // 부가세 포함된 경우, 공급가액 역산
  const supplyPrice = includeVAT
    ? Math.round(sellingPrice / 1.1)
    : sellingPrice;
  const vatAmount = includeVAT ? sellingPrice - supplyPrice : 0;

  // 수수료 금액 (판매가 기준)
  const commissionAmount = Math.round(sellingPrice * (commissionRate / 100));

  // 순이익
  const netProfit =
    supplyPrice - costPrice - commissionAmount - shippingCost - otherCost;

  // 마진율 (공급가액 대비)
  const marginRate = supplyPrice > 0 ? (netProfit / supplyPrice) * 100 : 0;

  // 마크업률 (원가 대비)
  const markupRate = costPrice > 0 ? (netProfit / costPrice) * 100 : 0;

  return {
    netProfit,
    marginRate: Math.round(marginRate * 10) / 10,
    markupRate: Math.round(markupRate * 10) / 10,
    commissionAmount,
    vatAmount,
    actualRevenue: netProfit,
  };
}
