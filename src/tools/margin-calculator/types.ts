/** 마진 계산기 입력 */
export interface MarginInput {
  sellingPrice: number;
  costPrice: number;
  commissionRate: number;
  shippingCost: number;
  otherCost: number;
  includeVAT: boolean;
}

/** 마진 계산기 출력 */
export interface MarginOutput {
  netProfit: number;
  marginRate: number;
  markupRate: number;
  commissionAmount: number;
  vatAmount: number;
  actualRevenue: number;
}
