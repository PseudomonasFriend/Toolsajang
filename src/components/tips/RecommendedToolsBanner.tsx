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
import { getToolBySlug } from '@/data/tools';

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

interface RecommendedToolsBannerProps {
  toolSlugs: string[];
}

/** 장사 팁 글 하단 추천 툴 배너 */
export default function RecommendedToolsBanner({ toolSlugs }: RecommendedToolsBannerProps) {
  const tools: Tool[] = toolSlugs
    .map((slug) => getToolBySlug(slug))
    .filter((t): t is Tool => t != null && t.isActive);

  if (tools.length === 0) return null;

  return (
    <section
      className="mt-8 rounded-xl border border-gray-200 bg-gray-50 p-4"
      aria-label="이 글에 추천하는 툴"
    >
      <h2 className="mb-3 text-base font-bold text-gray-900">
        이 글에 추천하는 툴
      </h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {tools.map((tool) => {
          const Icon = iconMap[tool.icon] || Wrench;
          return (
            <Link
              key={tool.slug}
              href={`/tools/${tool.slug}`}
              className="flex flex-col items-center gap-1.5 rounded-lg bg-white p-3 shadow-sm transition-shadow hover:shadow-md"
              aria-label={`${tool.name} 바로가기`}
            >
              <Icon className="h-7 w-7 text-blue-600" />
              <span className="text-center text-sm font-semibold text-gray-900">
                {tool.name}
              </span>
              <span className="line-clamp-2 text-center text-xs text-gray-500">
                {tool.description}
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
