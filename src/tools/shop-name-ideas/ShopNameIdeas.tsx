'use client';

import { useState, useCallback } from 'react';
import { RotateCcw, Copy, Loader2, Store } from 'lucide-react';
import { TONES } from './types';

const COUNT_MIN = 5;
const COUNT_MAX = 15;

export default function ShopNameIdeas() {
  // 입력 상태
  const [businessType, setBusinessType] = useState('');
  const [concept, setConcept] = useState('');
  const [keywords, setKeywords] = useState('');
  const [tone, setTone] = useState('');
  const [count, setCount] = useState(8);

  // 결과/UI 상태
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [provider, setProvider] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  /** 폼 제출 — AI API 호출 */
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const biz = businessType.trim();
      if (!biz) {
        setError('업종을 입력해 주세요.');
        return;
      }
      setError(null);
      setLoading(true);
      setSuggestions([]);
      setProvider(null);

      try {
        const res = await fetch('/api/tools/shop-name-ideas', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            businessType: biz,
            concept: concept.trim() || undefined,
            keywords: keywords.trim() || undefined,
            tone: tone.trim() || undefined,
            count,
          }),
        });
        const data = (await res.json()) as {
          suggestions?: string[];
          provider?: string;
          error?: string;
        };

        if (res.status === 429) {
          // Retry-After 헤더에서 남은 초 계산
          const retryAfter = res.headers.get('Retry-After');
          const seconds = retryAfter ? Number(retryAfter) : 60;
          setError(
            `요청이 너무 많습니다. ${seconds}초 후에 다시 시도해 주세요. (분당 5회 제한)`
          );
          return;
        }

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
    },
    [businessType, concept, keywords, tone, count]
  );

  /** 전체 초기화 */
  const handleReset = useCallback(() => {
    setBusinessType('');
    setConcept('');
    setKeywords('');
    setTone('');
    setCount(8);
    setSuggestions([]);
    setProvider(null);
    setError(null);
    setCopiedIndex(null);
  }, []);

  /** 가게명 개별 복사 */
  const copyItem = useCallback((text: string, index: number) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 1500);
    });
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
      {/* 입력 폼 */}
      <form
        onSubmit={handleSubmit}
        className="rounded-xl bg-white p-5 shadow-sm space-y-4"
      >
        {/* 업종 */}
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-gray-700">
            업종 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="예: 카페, 치킨집, 네일샵, 헤어샵"
            value={businessType}
            onChange={(e) => setBusinessType(e.target.value)}
            className="h-12 w-full rounded-lg border border-gray-200 px-3 text-base text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            aria-label="업종 입력"
            maxLength={50}
          />
        </div>

        {/* 컨셉/분위기 */}
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-gray-700">
            컨셉/분위기 (선택)
          </label>
          <input
            type="text"
            placeholder="예: 아늑한, 고급스러운, 가족 친화적인"
            value={concept}
            onChange={(e) => setConcept(e.target.value)}
            className="h-12 w-full rounded-lg border border-gray-200 px-3 text-base text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            aria-label="컨셉/분위기 입력"
            maxLength={100}
          />
        </div>

        {/* 키워드 */}
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-gray-700">
            키워드 (선택)
          </label>
          <input
            type="text"
            placeholder="예: 꽃, 달, 제주, 숲, 하늘"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            className="h-12 w-full rounded-lg border border-gray-200 px-3 text-base text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            aria-label="키워드 입력"
            maxLength={100}
          />
        </div>

        {/* 톤/분위기 */}
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

        {/* 추천 개수 */}
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
            aria-label="추천 개수 슬라이더"
          />
          <span className="mt-1 block text-sm text-gray-500">{count}개</span>
        </div>

        {/* 버튼 그룹 */}
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={loading}
            className="flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-lg bg-blue-600 text-base font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
            aria-label="가게명 추천 받기"
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                추천 중…
              </>
            ) : (
              <>
                <Store className="h-5 w-5" />
                가게명 추천 받기
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

      {/* 오류 메시지 */}
      {error && (
        <div
          role="alert"
          className="rounded-xl bg-red-50 p-4 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      {/* 추천 결과 */}
      {suggestions.length > 0 && (
        <div className="rounded-xl bg-white p-5 shadow-sm">
          <h2 className="mb-3 flex items-center gap-2 text-base font-bold text-gray-900">
            <Store className="h-5 w-5 text-amber-500" />
            추천 가게명
            {providerLabel && (
              <span className="text-xs font-normal text-gray-500">
                ({providerLabel})
              </span>
            )}
          </h2>
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
                  onClick={() => copyItem(item, i)}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-100"
                  aria-label={`${item} 복사`}
                >
                  {copiedIndex === i ? (
                    <span className="text-xs font-semibold text-green-600">완료</span>
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 안내 메시지 */}
      <div className="rounded-xl bg-amber-50 p-4">
        <p className="text-sm font-semibold text-amber-800 mb-1">
          가게명 선택 시 참고사항
        </p>
        <ul className="space-y-1 text-xs text-amber-700 list-disc list-inside">
          <li>상호명 등록 전 특허청 상표 검색을 권장합니다.</li>
          <li>동일 상권 내 유사 상호명 사용 여부를 확인하세요.</li>
          <li>브랜드 이미지와 업종이 잘 어울리는지 검토하세요.</li>
        </ul>
      </div>
    </div>
  );
}
