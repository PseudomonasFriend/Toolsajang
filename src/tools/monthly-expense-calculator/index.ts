import type { Tool } from '@/types';
import MonthlyExpenseCalculator from './MonthlyExpenseCalculator';

/** 월 고정비 계산기 메타 정보 */
export const meta: Tool = {
  slug: 'monthly-expense-calculator',
  name: '월 고정비 계산기',
  description: '임대료·인건비·공과금 등 월 고정비 합산 및 카테고리별 비중 분석',
  icon: 'Receipt',
  category: '재무/회계',
  isNew: true,
  isActive: true,
};

/** 월 고정비 계산기 SEO 메타데이터 */
export const seo = {
  title: '월 고정비 계산기 - 매장 월 운영비 무료 계산',
  description:
    '임대료, 인건비, 공과금, 대출이자, 배달앱 수수료 등 매달 나가는 고정비를 한눈에 계산하고 비용 구성을 분석합니다.',
};

export const Component = MonthlyExpenseCalculator;
