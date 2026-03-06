'use client';

import { useState, useCallback, useMemo } from 'react';
import { RotateCcw, Copy, Check } from 'lucide-react';
import { calculateCardFee } from './calculation';
import { formatNumber, parseNumber } from '@/lib/format';
import { cn } from '@/lib/utils';
import type { CardFeeInput, IndustryType, BusinessType } from './types';

/** 업종 옵션 */
const INDUSTRY_OPTIONS: { value: IndustryType; label: string }[] = [
  { value: 'general', label: '일반' },
  { value: 'restaurant', label: '음식점' },
  { value: 'convenience', label: '편의점' },
];

/** 사업자 유형 옵션 */
const BUSINESS_TYPE_OPTIONS: { value: BusinessType; label: string }[] = [
  { value: 'general', label: '일반과세자' },
  { value: 'simplified', label: '간이과세자' },
  { value: 'exempt', label: '면세사업자' },
];

/** 초기 입력값 */
const initialInput: CardFeeInput = {
  monthlySales: 0,
  industry: 'general',
  businessType: 'general',
};

export default function CardFeeCalculator() {
  const [input, setInput] = useState<CardFeeInput>(initialInput);
  const [salesDisplay, setSalesDisplay] = useState('');
  const [copied, setCopied] = useState(false);

  /** 매출 입력 핸들러 */
  const handleSalesChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const num = parseNumber(e.target.value);
      setSalesDisplay(num > 0 ? formatNumber(num) : e.target.value.replace(/[^0-9]/g, ''));
      setInput((prev) => ({ ...prev, monthlySales: num }));
    },
    []
  );

  /** 업종 변경 */
  const handleIndustryChange = useCallback((industry: IndustryType) => {
    setInput((prev) => ({ ...prev, industry }));
  }, []);

  /** 사업자 유형 변경 */
  const handleBusinessTypeChange = useCallback((businessType: BusinessType) => {
    setInput((prev) => ({ ...prev, businessType }));
  }, []);

  /** 초기화 */
  const handleReset = useCallback(() => {
    setInput(initialInput);
    setSalesDisplay('');
    setCopied(false);
  }, []);

  /** 실시간 계산 결과 */
  const result = useMemo(() => {
    if (input.monthlySales <= 0) return null;
    return calculateCardFee(input);
  }, [input]);

  /** 결과 복사 */
  const handleCopy = useCallback(async () => {
    if (!result) return;
    const lines = [
      `월 카드매출: ${formatNumber(input.monthlySales)}원`,
      `평균 수수료율: ${result.averageFeeRate}%`,
      `월 수수료 합계: ${formatNumber(result.totalFee)}원`,
      `실수령액: ${formatNumber(result.netAmount)}원`,
      result.isPreferentialRate ? '(소상공인 우대수수료율 적용)' : '',
    ]
      .filter(Boolean)
      .join('\n');

    try {
      await navigator.clipboard.writeText(lines);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* 클립보드 접근 불가 시 무시 */
    }
  }, [result, input.monthlySales]);

  return (
    <div className="space-y-5">
      {/* 입력 영역 */}
      <div className="rounded-xl bg-white p-5 shadow-sm space-y-4">
        {/* 월 카드매출 */}
        <div>
          <label
            htmlFor="monthlySales"
            className="mb-1.5 block text-sm font-semibold text-gray-700"
          >
            월 카드매출 <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">₩</span>
            <input
              id="monthlySales"
              type="text"
              inputMode="numeric"
              placeholder="0"
              value={salesDisplay}
              onChange={handleSalesChange}
              className="h-12 w-full rounded-lg border border-gray-200 pl-8 pr-3 text-lg text-gray-900 placeholder:text-gray-300 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              aria-label="월 카드매출 입력"
            />
          </div>
        </div>

        {/* 업종 */}
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-gray-700">
            업종
          </label>
          <div className="flex flex-wrap gap-2">
            {INDUSTRY_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => handleIndustryChange(opt.value)}
                className={cn(
                  'rounded-full px-4 py-2 text-sm font-medium transition-colors',
                  input.industry === opt.value
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                )}
                aria-label={`업종 ${opt.label} 선택`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* 사업자 유형 */}
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-gray-700">
            사업자 유형
          </label>
          <div className="flex flex-wrap gap-2">
            {BUSINESS_TYPE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => handleBusinessTypeChange(opt.value)}
                className={cn(
                  'rounded-full px-4 py-2 text-sm font-medium transition-colors',
                  input.businessType === opt.value
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                )}
                aria-label={`사업자 유형 ${opt.label} 선택`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 초기화 버튼 */}
      <button
        type="button"
        onClick={handleReset}
        className="flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-600 hover:bg-gray-50"
        aria-label="입력값 초기화"
      >
        <RotateCcw className="h-4 w-4" />
        초기화
      </button>

      {/* 결과 영역 */}
      {result && (
        <>
          <div className="rounded-xl bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-base font-bold text-gray-900">계산 결과</h2>

            <div className="space-y-3">
              {/* 평균 수수료율 */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">평균 수수료율</span>
                <span className="text-2xl font-bold text-blue-600">
                  {result.averageFeeRate}%
                </span>
              </div>

              {/* 월 수수료 합계 */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">월 수수료 합계</span>
                <span className="text-xl font-bold text-red-500">
                  - ₩ {formatNumber(result.totalFee)}
                </span>
              </div>

              <hr className="border-gray-100" />

              {/* 실수령액 */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-700">실수령액</span>
                <span className="text-2xl font-bold text-gray-900">
                  ₩ {formatNumber(result.netAmount)}
                </span>
              </div>
            </div>

            {/* 우대수수료 안내 */}
            <div
              className={cn(
                'mt-4 rounded-lg p-3 text-sm font-medium',
                result.isPreferentialRate
                  ? 'bg-green-50 text-green-700 border border-green-200'
                  : 'bg-amber-50 text-amber-700 border border-amber-200'
              )}
            >
              {result.message}
            </div>

            {/* 결과 복사 */}
            <button
              type="button"
              onClick={handleCopy}
              className="mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-blue-600 text-sm font-medium text-white hover:bg-blue-700"
              aria-label="계산 결과 복사"
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

          {/* 카드사별 수수료 상세 */}
          <div className="rounded-xl bg-white p-5 shadow-sm">
            <h2 className="mb-3 text-sm font-bold text-gray-900">카드사별 수수료</h2>
            <div className="space-y-2">
              {result.cardFees.map((card) => (
                <div key={card.name} className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">{card.name}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-gray-400">{card.feeRate}%</span>
                    <span className="font-medium text-gray-900">
                      ₩ {formatNumber(card.feeAmount)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 소상공인 우대수수료 안내 */}
          <div className="rounded-xl bg-white p-5 shadow-sm">
            <h2 className="mb-3 text-sm font-bold text-gray-900">소상공인 우대수수료 안내</h2>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>연매출 3억 이하</span>
                <span className="font-medium text-gray-900">0.5~0.8%</span>
              </div>
              <div className="flex justify-between">
                <span>연매출 3억~5억</span>
                <span className="font-medium text-gray-900">1.1~1.4%</span>
              </div>
              <div className="flex justify-between">
                <span>연매출 5억~10억</span>
                <span className="font-medium text-gray-900">1.25~1.6%</span>
              </div>
              <div className="flex justify-between">
                <span>연매출 10억 초과</span>
                <span className="font-medium text-gray-900">1.5~2.0%</span>
              </div>
            </div>
            <p className="mt-3 text-xs text-gray-400">
              * 2024년 기준 소상공인 카드 수수료 우대 제도 참고
            </p>
          </div>
        </>
      )}
    </div>
  );
}
