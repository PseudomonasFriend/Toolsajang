import type { CardFeeInput, CardFeeResult, CardCompanyFee, IndustryType, BusinessType } from './types';

/**
 * 카드사별 수수료율 (2024년 기준)
 * 연매출 3억 이하 소상공인 우대수수료율 적용
 * 연매출 3억 초과 시 일반 수수료율 적용
 */
interface FeeRateTable {
  name: string;
  /** 우대 수수료율 (연매출 3억 이하) */
  preferentialRate: number;
  /** 일반 수수료율 */
  normalRate: number;
}

/** 카드사별 수수료율 테이블 */
const CARD_FEE_RATES: FeeRateTable[] = [
  { name: '신한카드', preferentialRate: 0.5, normalRate: 1.8 },
  { name: '삼성카드', preferentialRate: 0.5, normalRate: 1.9 },
  { name: 'KB국민카드', preferentialRate: 0.5, normalRate: 1.8 },
  { name: '현대카드', preferentialRate: 0.5, normalRate: 1.9 },
  { name: '롯데카드', preferentialRate: 0.5, normalRate: 1.8 },
  { name: '하나카드', preferentialRate: 0.5, normalRate: 1.9 },
  { name: '우리카드', preferentialRate: 0.5, normalRate: 1.8 },
  { name: 'NH농협카드', preferentialRate: 0.5, normalRate: 1.7 },
];

/**
 * 업종별 수수료 보정 계수
 * 음식점: 기본값 유지
 * 편의점: 약간 낮음
 */
function getIndustryMultiplier(industry: IndustryType): number {
  switch (industry) {
    case 'restaurant':
      return 1.0;
    case 'convenience':
      return 0.95;
    case 'general':
    default:
      return 1.0;
  }
}

/**
 * 사업자 유형별 추가 안내
 */
function getBusinessTypeMessage(businessType: BusinessType): string {
  switch (businessType) {
    case 'simplified':
      return '간이과세자는 부가세 감면 혜택이 있어 실질 부담이 더 낮을 수 있습니다.';
    case 'exempt':
      return '면세사업자는 카드 수수료에 부가세가 포함되지 않습니다.';
    case 'general':
    default:
      return '';
  }
}

/**
 * 카드수수료 계산 함수
 * 월 매출 기준으로 연매출 추정 → 우대/일반 수수료율 판별 → 카드사별 수수료 계산
 */
export function calculateCardFee(input: CardFeeInput): CardFeeResult {
  const { monthlySales, industry, businessType } = input;

  // 연매출 추정 (월매출 × 12)
  const annualSales = monthlySales * 12;

  // 연매출 3억 이하 → 우대수수료율 적용
  const isPreferentialRate = annualSales <= 300000000;

  const industryMultiplier = getIndustryMultiplier(industry);

  // 카드사별 수수료 계산
  const cardFees: CardCompanyFee[] = CARD_FEE_RATES.map((card) => {
    const baseRate = isPreferentialRate ? card.preferentialRate : card.normalRate;
    const feeRate = Math.round(baseRate * industryMultiplier * 100) / 100;
    const feeAmount = Math.round(monthlySales * (feeRate / 100));
    return {
      name: card.name,
      feeRate,
      feeAmount,
    };
  });

  // 평균 수수료율
  const totalFeeRates = cardFees.reduce((sum, c) => sum + c.feeRate, 0);
  const averageFeeRate = Math.round((totalFeeRates / cardFees.length) * 100) / 100;

  // 월 수수료 합계 (평균 기준)
  const totalFee = Math.round(monthlySales * (averageFeeRate / 100));

  // 실수령액
  const netAmount = monthlySales - totalFee;

  // 안내 메시지
  const messages: string[] = [];
  if (isPreferentialRate) {
    messages.push(`연매출 ${Math.round(annualSales / 10000).toLocaleString('ko-KR')}만원으로 소상공인 우대수수료율(0.5~0.8%)이 적용됩니다.`);
  } else {
    messages.push(`연매출 3억 초과로 일반 수수료율이 적용됩니다.`);
  }
  const businessMsg = getBusinessTypeMessage(businessType);
  if (businessMsg) {
    messages.push(businessMsg);
  }

  return {
    cardFees,
    averageFeeRate,
    totalFee,
    netAmount,
    isPreferentialRate,
    message: messages.join(' '),
  };
}
