'use client';

import { useState, useCallback, useMemo } from 'react';
import { ChevronDown, ChevronUp, RotateCcw, Copy, Check } from 'lucide-react';
import { calculateMargin } from './calculation';
import { formatNumber, parseNumber, formatPercent } from '@/lib/format';
import { cn } from '@/lib/utils';
import type { MarginInput } from './types';

/** 초기 입력값 */
const initialInput: MarginInput = {
  sellingPrice: 0,
  costPrice: 0,
  commissionRate: 0,
  shippingCost: 0,
  otherCost: 0,
  includeVAT: false,
};

export default function MarginCalculator() {
  const [input, setInput] = useState<MarginInput>(initialInput);
  const [isExtraOpen, setIsExtraOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  // 표시용 문자열 (콤마 포맷)
  const [displayValues, setDisplayValues] = useState({
    sellingPrice: '',
    costPrice: '',
    shippingCost: '',
    otherCost: '',
    commissionRate: '',
  });

  /** 숫자 필드 변경 핸들러 */
  const handleNumberChange = useCallback(
    (field: keyof typeof displayValues, isPercent = false) =>
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value;

        if (isPercent) {
          // 퍼센트 필드는 소수점 허용
          const cleaned = raw.replace(/[^0-9.]/g, '');
          setDisplayValues((prev) => ({ ...prev, [field]: cleaned }));
          setInput((prev) => ({
            ...prev,
            [field]: parseFloat(cleaned) || 0,
          }));
        } else {
          // 원화 필드는 콤마 자동 포맷
          const num = parseNumber(raw);
          setDisplayValues((prev) => ({
            ...prev,
            [field]: num > 0 ? formatNumber(num) : raw.replace(/[^0-9]/g, ''),
          }));
          setInput((prev) => ({ ...prev, [field]: num }));
        }
      },
    []
  );

  /** 부가세 토글 */
  const handleVATToggle = useCallback(() => {
    setInput((prev) => ({ ...prev, includeVAT: !prev.includeVAT }));
  }, []);

  /** 초기화 */
  const handleReset = useCallback(() => {
    setInput(initialInput);
    setDisplayValues({
      sellingPrice: '',
      costPrice: '',
      shippingCost: '',
      otherCost: '',
      commissionRate: '',
    });
    setCopied(false);
  }, []);

  /** 계산 결과 (실시간) */
  const result = useMemo(() => {
    if (input.sellingPrice <= 0 && input.costPrice <= 0) return null;
    return calculateMargin(input);
  }, [input]);

  /** 결과 복사 */
  const handleCopy = useCallback(async () => {
    if (!result) return;
    const text = [
      `판매가 ${formatNumber(input.sellingPrice)}원`,
      `원가 ${formatNumber(input.costPrice)}원`,
      `순이익 ${formatNumber(result.netProfit)}원`,
      `마진율 ${formatPercent(result.marginRate)}`,
      `마크업률 ${formatPercent(result.markupRate)}`,
    ].join(' / ');

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* 클립보드 접근 불가 시 무시 */
    }
  }, [result, input.sellingPrice, input.costPrice]);

  const isLoss = result !== null && result.netProfit < 0;

  return (
    <div className="space-y-5">
      {/* 필수 입력 영역 */}
      <div className="space-y-4 rounded-xl bg-white p-5 shadow-sm">
        {/* 판매가 */}
        <div>
          <label
            htmlFor="sellingPrice"
            className="mb-1.5 block text-sm font-semibold text-gray-700"
          >
            판매가 <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              ₩
            </span>
            <input
              id="sellingPrice"
              type="text"
              inputMode="numeric"
              placeholder="0"
              value={displayValues.sellingPrice}
              onChange={handleNumberChange('sellingPrice')}
              className="h-12 w-full rounded-xl border border-gray-200 pl-8 pr-3 text-lg font-medium text-gray-900 placeholder:text-gray-300 transition-shadow focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              aria-label="판매가 입력"
            />
          </div>
        </div>

        {/* 매입 원가 */}
        <div>
          <label
            htmlFor="costPrice"
            className="mb-1.5 block text-sm font-semibold text-gray-700"
          >
            매입 원가 <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              ₩
            </span>
            <input
              id="costPrice"
              type="text"
              inputMode="numeric"
              placeholder="0"
              value={displayValues.costPrice}
              onChange={handleNumberChange('costPrice')}
              className="h-12 w-full rounded-xl border border-gray-200 pl-8 pr-3 text-lg font-medium text-gray-900 placeholder:text-gray-300 transition-shadow focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              aria-label="매입 원가 입력"
            />
          </div>
        </div>
      </div>

      {/* 추가 비용 (접이식) */}
      <div className="rounded-xl bg-white shadow-sm">
        <button
          type="button"
          onClick={() => setIsExtraOpen(!isExtraOpen)}
          className="flex h-12 w-full items-center justify-between px-5 text-sm font-semibold text-gray-700"
          aria-expanded={isExtraOpen}
          aria-controls="extra-cost-section"
        >
          <span>추가 비용 (선택)</span>
          {isExtraOpen ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>

        {isExtraOpen && (
          <div
            id="extra-cost-section"
            className="space-y-4 border-t border-gray-100 px-5 pb-5 pt-4"
          >
            {/* 수수료율 */}
            <div>
              <label
                htmlFor="commissionRate"
                className="mb-1.5 block text-sm text-gray-600"
              >
                마켓/카드 수수료
              </label>
              <div className="relative">
                <input
                  id="commissionRate"
                  type="text"
                  inputMode="decimal"
                  placeholder="0"
                  value={displayValues.commissionRate}
                  onChange={handleNumberChange('commissionRate', true)}
                  className="h-11 w-full rounded-xl border border-gray-200 pl-3 pr-8 text-base font-medium text-gray-900 placeholder:text-gray-300 transition-shadow focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                  aria-label="수수료율 입력"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  %
                </span>
              </div>
            </div>

            {/* 배송비 */}
            <div>
              <label
                htmlFor="shippingCost"
                className="mb-1.5 block text-sm text-gray-600"
              >
                배송비
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  ₩
                </span>
                <input
                  id="shippingCost"
                  type="text"
                  inputMode="numeric"
                  placeholder="0"
                  value={displayValues.shippingCost}
                  onChange={handleNumberChange('shippingCost')}
                  className="h-11 w-full rounded-xl border border-gray-200 pl-8 pr-3 text-base font-medium text-gray-900 placeholder:text-gray-300 transition-shadow focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                  aria-label="배송비 입력"
                />
              </div>
            </div>

            {/* 기타비용 */}
            <div>
              <label
                htmlFor="otherCost"
                className="mb-1.5 block text-sm text-gray-600"
              >
                포장비/기타 비용
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  ₩
                </span>
                <input
                  id="otherCost"
                  type="text"
                  inputMode="numeric"
                  placeholder="0"
                  value={displayValues.otherCost}
                  onChange={handleNumberChange('otherCost')}
                  className="h-11 w-full rounded-xl border border-gray-200 pl-8 pr-3 text-base font-medium text-gray-900 placeholder:text-gray-300 transition-shadow focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                  aria-label="기타 비용 입력"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 부가세 토글 */}
      <div className="rounded-xl bg-white p-5 shadow-sm">
        <label className="flex min-h-[44px] cursor-pointer items-center gap-3">
          <input
            type="checkbox"
            checked={input.includeVAT}
            onChange={handleVATToggle}
            className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            aria-label="판매가에 부가세 10% 포함 여부"
          />
          <span className="text-sm text-gray-700">
            판매가에 부가세(10%) 포함
          </span>
        </label>
      </div>

      {/* 초기화 버튼 */}
      <button
        type="button"
        onClick={handleReset}
        className="flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-600 transition-all duration-200 hover:bg-gray-50 hover:text-gray-900 active:scale-[0.98]"
        aria-label="입력값 초기화"
      >
        <RotateCcw className="h-4 w-4" />
        초기화
      </button>

      {/* 계산 결과 */}
      {result && (
        <div className="rounded-xl bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-base font-bold text-gray-900">
            계산 결과
          </h2>

          {/* 적자 경고 */}
          {isLoss && (
            <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm font-medium text-red-600">
              적자입니다. 판매가 또는 비용을 조정해 보세요.
            </div>
          )}

          {/* 주요 결과 */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">순이익</span>
              <span
                className={cn(
                  'text-2xl font-bold',
                  isLoss ? 'text-red-500' : 'text-gray-900'
                )}
              >
                ₩ {formatNumber(result.netProfit)}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">마진율</span>
              <span
                className={cn(
                  'text-lg font-semibold',
                  isLoss ? 'text-red-500' : 'text-green-600'
                )}
              >
                {formatPercent(result.marginRate)}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">마크업률</span>
              <span
                className={cn(
                  'text-lg font-semibold',
                  isLoss ? 'text-red-500' : 'text-green-600'
                )}
              >
                {formatPercent(result.markupRate)}
              </span>
            </div>

            <hr className="border-gray-100" />

            {/* 보조 정보 */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">수수료 금액</span>
              <span className="text-sm text-gray-700">
                ₩ {formatNumber(result.commissionAmount)}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">부가세</span>
              <span className="text-sm text-gray-700">
                ₩ {formatNumber(result.vatAmount)}
              </span>
            </div>
          </div>

          {/* 결과 복사 */}
          <button
            type="button"
            onClick={handleCopy}
            className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 text-sm font-bold text-white shadow-sm transition-all duration-200 hover:bg-blue-700 hover:shadow active:scale-[0.98]"
            aria-label="계산 결과 클립보드에 복사"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4" />
                복사 완료
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                결과 복사
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
