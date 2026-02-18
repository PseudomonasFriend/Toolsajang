import type { Tool } from '@/types';
import LoanCalculator from './LoanCalculator';

/** 대출 이자 계산기 메타 정보 */
export const meta: Tool = {
  slug: 'loan-calculator',
  name: '대출 이자 계산기',
  description: '월 상환액과 총 이자를 한눈에 비교',
  icon: 'Landmark',
  category: '재무/회계',
  isNew: true,
  isActive: true,
};

/** 대출 이자 계산기 SEO 메타데이터 */
export const seo = {
  title: '대출 이자 계산기 - 원금균등/원리금균등 비교',
  description:
    '대출 원금, 이자율, 기간을 입력하면 월 상환액과 총 이자를 즉시 계산하고 상환 스케줄을 확인합니다.',
};

export const Component = LoanCalculator;
