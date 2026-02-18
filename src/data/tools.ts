/**
 * 툴 목록 통합 제공
 * - 구현된 툴: src/tools/index.ts 에서 가져옴
 * - 미구현(준비 중) 툴: 여기에 메타만 등록
 */
import type { Tool } from '@/types';
import { tools as implementedTools } from '@/tools';

/** 미구현 툴 메타 (준비 중 표시용) */
const upcomingTools: Tool[] = [
  // 현재 모든 툴 구현 완료
];

/** 전체 툴 목록 (구현 + 미구현) */
export const tools: Tool[] = [...implementedTools, ...upcomingTools];

/** 활성화된 툴만 */
export function getActiveTools(): Tool[] {
  return tools.filter((t) => t.isActive);
}

/** 슬러그로 툴 찾기 */
export function getToolBySlug(slug: string): Tool | undefined {
  return tools.find((t) => t.slug === slug);
}
