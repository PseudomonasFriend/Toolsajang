import type { Tool } from '@/types';
import VatCalculator from './VatCalculator';

/** 부가세 계산기 메타 정보 */
export const meta: Tool = {
  slug: 'vat-calculator',
  name: '부가세 계산기',
  description: '공급가액과 부가세를 간편하게 계산',
  icon: 'Receipt',
  category: '재무/회계',
  isNew: true,
  isActive: true,
};

/** 부가세 계산기 SEO 메타데이터 */
export const seo = {
  title: '부가세 계산기 - 무료 온라인 부가가치세 계산',
  description:
    '공급가액에서 부가세와 합계를 계산하거나, 합계 금액에서 공급가액과 부가세를 역산합니다.',
};

export const Component = VatCalculator;
