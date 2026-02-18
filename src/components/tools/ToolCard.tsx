import Link from 'next/link';
import {
  Calculator,
  Receipt,
  TrendingUp,
  Users,
  Wrench,
  Tag,
  Landmark,
  Bike,
} from 'lucide-react';
import type { Tool } from '@/types';
import { cn } from '@/lib/utils';

/** 아이콘 이름 → 컴포넌트 매핑 */
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Calculator,
  Receipt,
  TrendingUp,
  Users,
  Wrench,
  Tag,
  Landmark,
  Bike,
};

interface ToolCardProps {
  tool: Tool;
}

/** 홈/목록용 툴 카드 */
export default function ToolCard({ tool }: ToolCardProps) {
  const Icon = iconMap[tool.icon] || Wrench;
  const isDisabled = !tool.isActive;

  const card = (
    <div
      className={cn(
        'relative flex min-h-[100px] flex-col items-center justify-center gap-2 rounded-xl bg-white p-4 shadow-sm transition-shadow',
        isDisabled
          ? 'cursor-default opacity-60'
          : 'cursor-pointer hover:shadow-md'
      )}
    >
      {/* NEW 뱃지 */}
      {tool.isNew && tool.isActive && (
        <span className="absolute right-2 top-2 rounded-full bg-amber-500 px-2 py-0.5 text-[10px] font-bold text-white">
          NEW
        </span>
      )}

      {/* 준비 중 뱃지 */}
      {isDisabled && (
        <span className="absolute right-2 top-2 rounded-full bg-gray-300 px-2 py-0.5 text-[10px] font-bold text-white">
          준비 중
        </span>
      )}

      <Icon className="h-8 w-8 text-blue-600" />
      <span className="text-sm font-semibold text-gray-900">{tool.name}</span>
      <span className="text-center text-xs text-gray-500">
        {tool.description}
      </span>
    </div>
  );

  if (isDisabled) return card;

  return (
    <Link
      href={`/tools/${tool.slug}`}
      aria-label={`${tool.name} 바로가기`}
    >
      {card}
    </Link>
  );
}
