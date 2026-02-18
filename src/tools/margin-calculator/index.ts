import type { Tool } from '@/types';
import MarginCalculator from './MarginCalculator';

/** 마진 계산기 메타 정보 */
export const meta: Tool = {
  slug: 'margin-calculator',
  name: '마진 계산기',
  description: '상품 하나 팔면 얼마 남는지 바로 계산',
  icon: 'Calculator',
  category: '재무/회계',
  isNew: true,
  isActive: true,
};

/** 마진 계산기 SEO 메타데이터 */
export const seo = {
  title: '마진 계산기 - 무료 온라인 마진율 계산',
  description:
    '판매가와 원가를 입력하면 순이익, 마진율, 마크업률을 즉시 계산합니다. 수수료, 배송비, 부가세까지 반영하는 자영업자 필수 마진 계산기.',
};

export const Component = MarginCalculator;
