import type { Tool } from '@/types';
import StartupCostCalculator from './StartupCostCalculator';

/** 창업비용 계산기 메타 정보 */
export const meta: Tool = {
  slug: 'startup-cost-calculator',
  name: '창업비용 계산기',
  description: '보증금·권리금·인테리어 등 항목별 창업비용과 예비비 합산 계산',
  icon: 'Building2',
  category: '재무/회계',
  isNew: true,
  isActive: true,
};

/** 창업비용 계산기 SEO 메타데이터 */
export const seo = {
  title: '창업비용 계산기 - 업종별 창업 초기 비용 무료 계산',
  description:
    '보증금, 권리금, 인테리어, 설비, 재고 등 창업에 필요한 항목별 비용을 입력하면 예비비 포함 총 창업비용을 즉시 계산합니다.',
};

export const Component = StartupCostCalculator;
