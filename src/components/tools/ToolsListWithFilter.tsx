'use client';

import { useState, useMemo } from 'react';
import type { Tool } from '@/types';
import ToolCard from './ToolCard';
import { cn } from '@/lib/utils';

const CATEGORY_ALL = '전체';
const CATEGORIES: { value: string; label: string }[] = [
  { value: CATEGORY_ALL, label: '전체' },
  { value: '재무/회계', label: '재무/회계' },
  { value: '매장운영', label: '매장운영' },
  { value: '마케팅', label: '마케팅' },
  { value: '유틸리티', label: '유틸리티' },
];

interface ToolsListWithFilterProps {
  tools: Tool[];
}

export default function ToolsListWithFilter({ tools }: ToolsListWithFilterProps) {
  const [category, setCategory] = useState<string>(CATEGORY_ALL);

  const filtered = useMemo(() => {
    if (category === CATEGORY_ALL) return tools;
    return tools.filter((t) => t.category === category);
  }, [tools, category]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="툴 카테고리 필터">
        {CATEGORIES.map((c) => (
          <button
            key={c.value}
            type="button"
            role="tab"
            aria-selected={category === c.value}
            onClick={() => setCategory(c.value)}
            className={cn(
              'rounded-full px-4 py-2 text-sm font-medium transition-colors',
              category === c.value
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            )}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3">
        {filtered.map((tool) => (
          <ToolCard key={tool.slug} tool={tool} />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="py-8 text-center text-sm text-gray-500">해당 카테고리 툴이 없습니다.</p>
      )}
    </div>
  );
}
