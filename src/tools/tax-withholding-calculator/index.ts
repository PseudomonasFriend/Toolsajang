import type { Tool } from '@/types';
import TaxWithholdingCalculator from './TaxWithholdingCalculator';

export const meta: Tool = {
  slug: 'tax-withholding-calculator',
  name: '원천세 계산기',
  description: '프리랜서·알바 지급 시 원천징수세 자동 계산',
  icon: 'Receipt',
  category: '재무/회계',
  isNew: true,
  isActive: true,
};

export const seo = {
  title: '원천세 계산기 - 프리랜서·알바 원천징수세 계산',
  description:
    '사업소득(3.3%), 기타소득, 일용근로소득별 원천세를 자동 계산합니다. 실지급액과 납부 세액을 즉시 확인하세요.',
};

export const Component = TaxWithholdingCalculator;
