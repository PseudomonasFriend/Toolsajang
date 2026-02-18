import type { Tool } from '@/types';
import BreakEvenCalculator from './BreakEvenCalculator';

/** 손익분기점 계산기 메타 정보 */
export const meta: Tool = {
  slug: 'break-even-calculator',
  name: '손익분기점 계산기',
  description: '얼마나 팔아야 본전인지 계산',
  icon: 'TrendingUp',
  category: '재무/회계',
  isNew: true,
  isActive: true,
};

/** 손익분기점 계산기 SEO 메타데이터 */
export const seo = {
  title: '손익분기점 계산기 - 무료 온라인 BEP 계산',
  description:
    '고정비와 변동비를 입력하면 손익분기점 판매 수량과 매출액을 즉시 계산합니다.',
};

export const Component = BreakEvenCalculator;
