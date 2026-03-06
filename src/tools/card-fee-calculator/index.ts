import type { Tool } from '@/types';
import CardFeeCalculator from './CardFeeCalculator';

/** 카드수수료 계산기 메타 정보 */
export const meta: Tool = {
  slug: 'card-fee-calculator',
  name: '카드수수료 계산기',
  description: '월 카드매출 기준 카드사별 수수료와 실수령액 계산',
  icon: 'CreditCard',
  category: '재무/회계',
  isNew: true,
  isActive: true,
};

/** 카드수수료 계산기 SEO 메타데이터 */
export const seo = {
  title: '카드수수료 계산기 - 소상공인 카드 수수료 무료 계산',
  description:
    '월 카드매출을 입력하면 카드사별 수수료율과 월 수수료 합계, 실수령액을 즉시 계산합니다. 2024년 소상공인 우대수수료율 기준.',
};

export const Component = CardFeeCalculator;
