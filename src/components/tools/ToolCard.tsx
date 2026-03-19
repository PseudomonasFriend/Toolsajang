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
  Target,
  Building2,
  Percent,
  QrCode,
  CalendarDays,
  Lightbulb,
  Type,
  RefreshCw,
  ShoppingCart,
  UtensilsCrossed,
  Store,
  CreditCard,
  BarChart3,
  Wallet,
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
  Target,
  Building2,
  Percent,
  QrCode,
  CalendarDays,
  Lightbulb,
  Type,
  RefreshCw,
  ShoppingCart,
  UtensilsCrossed,
  Store,
  CreditCard,
  BarChart3,
  Wallet,
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
        'group relative flex h-full min-h-[148px] flex-col items-start justify-start gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition-all duration-300',
        isDisabled
          ? 'cursor-default opacity-60'
          : 'cursor-pointer hover:-translate-y-1 hover:shadow-md active:scale-[0.98]'
      )}
    >
      {/* NEW 뱃지 */}
      {tool.isNew && tool.isActive && (
        <span className="absolute right-2 top-2 rounded-full bg-amber-500 px-2.5 py-0.5 text-[10px] font-bold tracking-wide text-white shadow-sm ring-1 ring-white/20">
          NEW
        </span>
      )}

      {/* 준비 중 뱃지 */}
      {isDisabled && (
        <span className="absolute right-2 top-2 rounded-full bg-gray-200 px-2 py-0.5 text-[10px] font-bold text-gray-500">
          준비 중
        </span>
      )}

      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-50/80 transition-colors group-hover:bg-blue-100/80">
        <Icon className="h-6 w-6 text-blue-600 transition-transform duration-300 group-hover:scale-110" />
      </div>

      <div className="flex flex-1 flex-col gap-1.5 text-left">
        <span className="text-sm font-bold leading-tight text-gray-900">
          {tool.name}
        </span>
        <span className="text-[11px] leading-snug text-gray-500">
          {tool.description}
        </span>
        <span className="mt-auto text-[11px] font-semibold text-blue-600">
          바로 계산하기
        </span>
      </div>
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
