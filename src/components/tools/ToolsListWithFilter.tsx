'use client';

import { useMemo, useState } from 'react';
import { Search, X } from 'lucide-react';
import type { Tool } from '@/types';
import ToolCard from './ToolCard';
import { cn } from '@/lib/utils';

const CATEGORY_ALL = '전체';
const FEATURED_TOOL_SLUGS = [
  'vat-calculator',
  'margin-calculator',
  'break-even-calculator',
  'card-fee-calculator',
  'delivery-profit-calculator',
  'sales-forecast-calculator',
] as const;

const CATEGORIES: { value: string; label: string }[] = [
  { value: CATEGORY_ALL, label: '전체' },
  { value: '재무/회계', label: '재무/회계' },
  { value: '매장운영', label: '매장운영' },
  { value: '마케팅', label: '마케팅' },
  { value: '유틸리티', label: '유틸리티' },
];

const QUICK_SCENARIOS = [
  { label: '세금/정산', query: '부가세 카드수수료 세금' },
  { label: '가격/마진', query: '마진 할인 가격 원가' },
  { label: '인건비/고정비', query: '인건비 임대료 고정비 손익분기점' },
  { label: '배달/매출', query: '배달 매출 목표 수익' },
  { label: '이름/문구', query: '상호명 메뉴명 글자수 qr' },
] as const;

const SEARCH_ALIASES: Record<string, string[]> = {
  'vat-calculator': ['세금', '부가세', '부가가치세', 'vat'],
  'margin-calculator': ['마진', '원가', '판매가'],
  'break-even-calculator': ['손익분기점', '고정비', '매출'],
  'salary-calculator': ['급여', '월급', '4대보험', '인건비'],
  'delivery-profit-calculator': ['배달', '수익', '배민', '쿠팡이츠'],
  'sales-target-calculator': ['목표 매출', '목표', '매출'],
  'sales-forecast-calculator': ['예상 매출', '매출 예측', '매출'],
  'food-cost-calculator': ['식자재', '원가율', '재료비'],
  'shop-name-ideas': ['상호명', '가게 이름', '브랜드명'],
  'menu-name-ideas': ['메뉴 이름', '상품명', '네이밍'],
  'character-counter': ['글자수', '문구', '텍스트'],
  'qr-generator': ['qr', 'qr코드', '링크'],
};

interface ToolsListWithFilterProps {
  tools: Tool[];
}

export default function ToolsListWithFilter({ tools }: ToolsListWithFilterProps) {
  const [category, setCategory] = useState<string>(CATEGORY_ALL);
  const [query, setQuery] = useState('');

  const featuredOrder = useMemo(
    () =>
      FEATURED_TOOL_SLUGS.reduce<Record<string, number>>((acc, slug, index) => {
        acc[slug] = index;
        return acc;
      }, {}),
    []
  );

  const normalizedTerms = useMemo(
    () =>
      query
        .trim()
        .toLowerCase()
        .split(/\s+/)
        .filter(Boolean),
    [query]
  );

  const searchMatchedTools = useMemo(() => {
    if (normalizedTerms.length === 0) {
      return tools;
    }

    return tools
      .map((tool) => {
        const aliasText = SEARCH_ALIASES[tool.slug]?.join(' ') ?? '';
        const searchableText = [
          tool.name,
          tool.description,
          tool.category,
          tool.slug.replaceAll('-', ' '),
          aliasText,
        ]
          .join(' ')
          .toLowerCase();

        const score = normalizedTerms.reduce((acc, term) => {
          if (searchableText.includes(term)) return acc + 1;
          return acc;
        }, 0);

        return { tool, score };
      })
      .filter((item) => item.score > 0)
      .sort((left, right) => {
        if (right.score !== left.score) return right.score - left.score;

        const leftFeatured = featuredOrder[left.tool.slug] ?? Number.MAX_SAFE_INTEGER;
        const rightFeatured = featuredOrder[right.tool.slug] ?? Number.MAX_SAFE_INTEGER;

        if (leftFeatured !== rightFeatured) return leftFeatured - rightFeatured;

        return left.tool.name.localeCompare(right.tool.name, 'ko');
      })
      .map((item) => item.tool);
  }, [featuredOrder, normalizedTerms, tools]);

  const categoryCounts = useMemo(
    () =>
      CATEGORIES.reduce<Record<string, number>>((acc, item) => {
        if (item.value === CATEGORY_ALL) {
          acc[item.value] = searchMatchedTools.length;
          return acc;
        }

        acc[item.value] = searchMatchedTools.filter(
          (tool) => tool.category === item.value
        ).length;
        return acc;
      }, {}),
    [searchMatchedTools]
  );

  const filtered = useMemo(() => {
    const baseList =
      category === CATEGORY_ALL
        ? searchMatchedTools
        : searchMatchedTools.filter((tool) => tool.category === category);

    return [...baseList].sort((left, right) => {
      const leftFeatured = featuredOrder[left.slug] ?? Number.MAX_SAFE_INTEGER;
      const rightFeatured = featuredOrder[right.slug] ?? Number.MAX_SAFE_INTEGER;

      if (leftFeatured !== rightFeatured) return leftFeatured - rightFeatured;
      return left.name.localeCompare(right.name, 'ko');
    });
  }, [category, featuredOrder, searchMatchedTools]);

  return (
    <div className="space-y-5">
      <div className="rounded-[1.5rem] border border-slate-100 bg-slate-50/80 p-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold text-blue-600">빠르게 찾기</p>
            <h2 className="mt-1 text-lg font-bold text-slate-900">
              계산기 이름이나 상황으로 바로 검색하세요
            </h2>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              부가세, 마진, 배달, 인건비처럼 떠오르는 키워드만 넣어도 관련 툴을
              바로 추려 보여줍니다.
            </p>
          </div>
          <div className="text-sm font-semibold text-slate-500">
            {filtered.length}개 표시 중
          </div>
        </div>

        <div className="mt-4">
          <label htmlFor="tool-search" className="sr-only">
            계산기 검색
          </label>
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              id="tool-search"
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="예: 부가세, 배달, 인건비, 상호명"
              className="h-14 w-full rounded-2xl border border-slate-200 bg-white pl-12 pr-12 text-[18px] text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                aria-label="검색어 지우기"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {QUICK_SCENARIOS.map((scenario) => {
            const isActive = query === scenario.query;

            return (
              <button
                key={scenario.label}
                type="button"
                onClick={() => setQuery(scenario.query)}
                className={cn(
                  'min-h-[44px] rounded-full px-4 py-2 text-sm font-semibold transition-colors',
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-blue-50 hover:text-blue-700'
                )}
                aria-pressed={isActive}
              >
                {scenario.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-wrap gap-2" role="tablist" aria-label="툴 카테고리 필터">
        {CATEGORIES.map((c) => (
          <button
            key={c.value}
            type="button"
            role="tab"
            aria-selected={category === c.value}
            onClick={() => setCategory(c.value)}
            className={cn(
              'min-h-[44px] rounded-full px-4 py-2 text-sm font-medium transition-colors',
              category === c.value
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            )}
          >
            {c.label}{' '}
            <span className={cn(category === c.value ? 'text-blue-100' : 'text-slate-400')}>
              {categoryCounts[c.value] ?? 0}
            </span>
          </button>
        ))}
      </div>

      {query && (
        <p className="text-sm text-slate-500">
          <span className="font-semibold text-slate-700">&ldquo;{query}&rdquo;</span> 기준으로
          맞는 계산기를 정리했습니다.
        </p>
      )}

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
        {filtered.map((tool) => (
          <ToolCard key={tool.slug} tool={tool} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="rounded-[1.5rem] border border-dashed border-slate-200 bg-slate-50/70 px-5 py-10 text-center">
          <p className="text-base font-semibold text-slate-700">
            맞는 툴을 아직 찾지 못했습니다.
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            검색어를 조금 더 넓게 바꾸거나, 카테고리를 &ldquo;전체&rdquo;로 두고 다시
            찾아보세요.
          </p>
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setCategory(CATEGORY_ALL);
            }}
            className="mt-4 min-h-[44px] rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            전체 툴 다시 보기
          </button>
        </div>
      )}
    </div>
  );
}
