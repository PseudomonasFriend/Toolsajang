'use client';

import { useState, useCallback } from 'react';
import { RotateCcw, Copy, Loader2, Lightbulb } from 'lucide-react';
import { MENU_TYPES, TONES } from './types';

const COUNT_MIN = 5;
const COUNT_MAX = 15;

export default function MenuNameIdeas() {
  const [category, setCategory] = useState('');
  const [menuType, setMenuType] = useState('음료');
  const [keywords, setKeywords] = useState('');
  const [tone, setTone] = useState('');
  const [count, setCount] = useState(8);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [provider, setProvider] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    const cat = category.trim();
    if (!cat) {
      setError('업종을 입력해 주세요.');
      return;
    }
    setError(null);
    setLoading(true);
    setSuggestions([]);
    setProvider(null);

    try {
      const res = await fetch('/api/tools/menu-ideas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: cat,
          menuType,
          keywords: keywords.trim() || undefined,
          tone: tone.trim() || undefined,
          count,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data?.error ?? '일시 오류가 발생했습니다.');
        return;
      }
      setSuggestions(data.suggestions ?? []);
      setProvider(data.provider ?? null);
      if (!data.suggestions?.length) {
        setError(data?.error ?? '추천을 생성하지 못했습니다.');
      }
    } catch {
      setError('네트워크 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.');
    } finally {
      setLoading(false);
    }
  }, [category, menuType, keywords, tone, count]);

  const handleReset = useCallback(() => {
    setCategory('');
    setMenuType('음료');
    setKeywords('');
    setTone('');
    setCount(8);
    setSuggestions([]);
    setProvider(null);
    setError(null);
  }, []);

  const copyItem = useCallback((text: string) => {
    navigator.clipboard.writeText(text);
  }, []);

  const providerLabel =
    provider === 'gemini'
      ? 'Google AI'
      : provider === 'groq'
        ? 'Groq'
        : provider === 'openrouter'
          ? 'OpenRouter'
          : null;

  return (
    <div className="space-y-5">
      <form onSubmit={handleSubmit} className="rounded-xl bg-white p-5 shadow-sm space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-gray-700">
            업종 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="예: 카페, 한식, 베이커리"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="h-12 w-full rounded-lg border border-gray-200 px-3 text-base text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            aria-label="업종 입력"
            maxLength={50}
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-semibold text-gray-700">
            메뉴 종류 <span className="text-red-500">*</span>
          </label>
          <select
            value={menuType}
            onChange={(e) => setMenuType(e.target.value)}
            className="h-12 w-full rounded-lg border border-gray-200 px-3 text-base text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            aria-label="메뉴 종류 선택"
          >
            {MENU_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-semibold text-gray-700">
            키워드 (선택)
          </label>
          <input
            type="text"
            placeholder="예: 달달한, 건강한"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            className="h-12 w-full rounded-lg border border-gray-200 px-3 text-base text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            aria-label="키워드 입력"
            maxLength={100}
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-semibold text-gray-700">
            톤/분위기 (선택)
          </label>
          <select
            value={tone}
            onChange={(e) => setTone(e.target.value)}
            className="h-12 w-full rounded-lg border border-gray-200 px-3 text-base text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            aria-label="톤 선택"
          >
            {TONES.map((t) => (
              <option key={t.value || 'none'} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-semibold text-gray-700">
            추천 개수 ({COUNT_MIN}~{COUNT_MAX})
          </label>
          <input
            type="range"
            min={COUNT_MIN}
            max={COUNT_MAX}
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            className="w-full accent-blue-600"
            aria-label="추천 개수"
          />
          <span className="mt-1 block text-sm text-gray-500">{count}개</span>
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={loading}
            className="flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-lg bg-blue-600 text-base font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
            aria-label="메뉴명 추천 받기"
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                추천 중…
              </>
            ) : (
              <>
                <Lightbulb className="h-5 w-5" />
                메뉴명 추천 받기
              </>
            )}
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="flex min-h-[48px] items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            aria-label="초기화"
          >
            <RotateCcw className="h-4 w-4" />
            초기화
          </button>
        </div>
      </form>

      {error && (
        <div className="rounded-xl bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {suggestions.length > 0 && (
        <div className="rounded-xl bg-white p-5 shadow-sm">
          <h3 className="mb-3 flex items-center gap-2 text-base font-bold text-gray-900">
            <Lightbulb className="h-5 w-5 text-amber-500" />
            추천 메뉴명
            {providerLabel && (
              <span className="text-xs font-normal text-gray-500">
                ({providerLabel})
              </span>
            )}
          </h3>
          <p className="mb-3 text-xs text-gray-500">
            결과는 참고용이며, 상표·저작권에 유의해 사용해 주세요.
          </p>
          <ul className="space-y-2">
            {suggestions.map((item, i) => (
              <li
                key={`${i}-${item}`}
                className="flex items-center justify-between gap-2 rounded-lg border border-gray-100 bg-gray-50/50 py-2.5 pl-3 pr-2"
              >
                <span className="text-sm font-medium text-gray-900">{item}</span>
                <button
                  type="button"
                  onClick={() => copyItem(item)}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-100"
                  aria-label={`${item} 복사`}
                >
                  <Copy className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
