import type { Tool } from '@/types';
import VatCalculator from './VatCalculator';

/** 부가세 계산기 메타 정보 */
export const meta: Tool = {
  slug: 'vat-calculator',
  name: '부가세 계산기',
  description: '공급가액과 부가세를 간편하게 계산',
  icon: 'Receipt',
  category: '재무/회계',
  isActive: true,
};

/** 부가세 계산기 SEO 메타데이터 */
export const seo = {
  title: '부가세 계산기 - 무료 온라인 부가가치세 계산',
  description:
    '공급가액 입력 시 부가세·합계를, 합계 입력 시 공급가액을 역산합니다. 세금계산서 발행 전 부가가치세를 로그인 없이 즉시 확인하세요. 소상공인 필수 무료 계산기.',
};

export const Component = VatCalculator;
