import type { Tool } from '@/types';
import DiscountCalculator from './DiscountCalculator';

/** 할인율 계산기 메타 정보 */
export const meta: Tool = {
  slug: 'discount-calculator',
  name: '할인율 계산기',
  description: '할인하면 마진이 얼마나 줄어드는지 비교',
  icon: 'Tag',
  category: '재무/회계',
  isActive: true,
};

/** 할인율 계산기 SEO 메타데이터 */
export const seo = {
  title: '할인율 계산기 - 할인 시 마진 변화 시뮬레이션',
  description:
    '할인율을 적용했을 때 마진이 얼마나 줄어드는지 즉시 확인합니다. 할인 판촉 전 손익 시뮬레이션으로 적정 할인율을 결정하는 소상공인 필수 무료 계산기.',
};

export const Component = DiscountCalculator;
