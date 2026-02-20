import type { Tool } from '@/types';
import UnitPriceCalculator from './UnitPriceCalculator';

/** 단가 계산기 메타 정보 */
export const meta: Tool = {
  slug: 'unit-price-calculator',
  name: '단가 계산기',
  description: '상품 단가 계산·비교로 최저가 찾기',
  icon: 'ShoppingCart',
  category: '재무/회계',
  isNew: true,
  isActive: true,
};

/** 단가 계산기 SEO 메타데이터 */
export const seo = {
  title: '단가 계산기 - 상품 단가 비교 무료 계산',
  description:
    '묶음 상품, 대용량 제품의 단가를 계산하고 비교합니다. 쿠팡, 마켓컬리 등에서 어느 상품이 더 저렴한지 바로 확인하세요.',
};

export const Component = UnitPriceCalculator;
