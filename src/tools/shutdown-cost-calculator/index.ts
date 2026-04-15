import type { Tool } from '@/types';
import ShutdownCostCalculator from './ShutdownCostCalculator';

export const meta: Tool = {
  slug: 'shutdown-cost-calculator',
  name: '폐업비용 계산기',
  description: '원상복구비·권리금·재고·철거비·퇴직금 등 폐업 시 예상 손실 총액 계산',
  icon: 'DoorOpen',
  category: '재무/회계',
  isNew: true,
  isActive: true,
};

export const seo = {
  title: '폐업비용 계산기 - 폐업 시 예상 비용 무료 계산',
  description:
    '원상복구비, 권리금 손실, 재고 처리, 철거비, 퇴직금 등 폐업에 드는 총 비용과 실질 손실액을 즉시 계산합니다.',
};

export const Component = ShutdownCostCalculator;
