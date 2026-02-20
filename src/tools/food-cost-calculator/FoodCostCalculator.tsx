'use client';

import { useState, useCallback, useMemo } from 'react';
import { RotateCcw, Copy, Check } from 'lucide-react';
import { calculateFoodCost } from './calculation';
import { formatNumber, parseNumber } from '@/lib/format';
import { cn } from '@/lib/utils';
import type { FoodCostInput } from './types';

/** 초기 입력값 */
const initialInput: FoodCostInput = {
  menuName: '',
  ingredientCost: 0,
  sellingPrice: 0,
  targetCostRate: 30,
};

/** 업종별 원가율 프리셋 */
const PRESETS = [
  { label: '일반 식당', rate: 33 },
  { label: '카페·음료', rate: 25 },
  { label: '패스트푸드', rate: 30 },
  { label: '베이커리', rate: 40 },
];

export default function FoodCostCalculator() {
  const [input, setInput] = useState<FoodCostInput>(initialInput);
  const [displayValues, setDisplayValues] = useState({
    ingredientCost: '',
    sellingPrice: '',
    targetCostRate: '30',
  });
  const [copied, setCopied] = useState(false);

  /** 숫자 입력 핸들러 */
  const handleNumberChange =
    (field: 'ingredientCost' | 'sellingPrice') =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const num = parseNumber(e.target.value);
      setDisplayValues((prev) => ({
        ...prev,
        [field]: num > 0 ? formatNumber(num) : e.target.value.replace(/[^0-9]/g, ''),
      }));
      setInput((prev) => ({ ...prev, [field]: num }));
    };

  /** 목표 원가율 변경 */
  const handleTargetRateChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value.replace(/[^0-9.]/g, '');
      setDisplayValues((prev) => ({ ...prev, targetCostRate: raw }));
      setInput((prev) => ({ ...prev, targetCostRate: parseFloat(raw) || 0 }));
    },
    []
  );

  /** 프리셋 적용 */
  const handlePreset = useCallback((rate: number) => {
    setDisplayValues((prev) => ({ ...prev, targetCostRate: String(rate) }));
    setInput((prev) => ({ ...prev, targetCostRate: rate }));
  }, []);

  /** 초기화 */
  const handleReset = useCallback(() => {
    setInput(initialInput);
    setDisplayValues({ ingredientCost: '', sellingPrice: '', targetCostRate: '30' });
    setCopied(false);
  }, []);

  /** 실시간 계산 결과 */
  const result = useMemo(() => {
    if (input.ingredientCost <= 0 || input.sellingPrice <= 0) return null;
    return calculateFoodCost(input);
  }, [input]);

  /** 결과 복사 */
  const handleCopy = useCallback(async () => {
    if (!result) return;
    const lines = [
      input.menuName ? `메뉴: ${input.menuName}` : '',
      `식재료 원가: ₩${formatNumber(input.ingredientCost)}`,
      `판매가: ₩${formatNumber(input.sellingPrice)}`,
      `현재 원가율: ${result.currentCostRate}%`,
      `원가 이익: ₩${formatNumber(result.grossProfit)}`,
      `권장 판매가(목표 ${input.targetCostRate}%): ₩${formatNumber(result.recommendedPrice)}`,
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
  }, [result, input]);

  const diagnosisColors = {
    good: 'bg-green-50 text-green-700 border border-green-200',
    warning: 'bg-amber-50 text-amber-700 border border-amber-200',
    danger: 'bg-red-50 text-red-700 border border-red-200',
  };

  return (
    <div className="space-y-5">
      {/* 입력 영역 */}
      <div className="rounded-xl bg-white p-5 shadow-sm space-y-4">
        {/* 메뉴 이름 */}
        <div>
          <label
            htmlFor="menuName"
            className="mb-1.5 block text-sm font-semibold text-gray-700"
          >
            메뉴 이름 (선택)
          </label>
          <input
            id="menuName"
            type="text"
            placeholder="예: 아메리카노"
            value={input.menuName}
            onChange={(e) => setInput((prev) => ({ ...prev, menuName: e.target.value }))}
            className="h-12 w-full rounded-lg border border-gray-200 px-3 text-base text-gray-900 placeholder:text-gray-300 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            aria-label="메뉴 이름 입력"
            maxLength={30}
          />
        </div>

        {/* 식재료 원가 */}
        <div>
          <label
            htmlFor="ingredientCost"
            className="mb-1.5 block text-sm font-semibold text-gray-700"
          >
            식재료 원가 <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">₩</span>
            <input
              id="ingredientCost"
              type="text"
              inputMode="numeric"
              placeholder="0"
              value={displayValues.ingredientCost}
              onChange={handleNumberChange('ingredientCost')}
              className="h-12 w-full rounded-lg border border-gray-200 pl-8 pr-3 text-lg text-gray-900 placeholder:text-gray-300 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              aria-label="식재료 원가 입력"
            />
          </div>
        </div>

        {/* 판매가 */}
        <div>
          <label
            htmlFor="sellingPrice"
            className="mb-1.5 block text-sm font-semibold text-gray-700"
          >
            판매가 <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">₩</span>
            <input
              id="sellingPrice"
              type="text"
              inputMode="numeric"
              placeholder="0"
              value={displayValues.sellingPrice}
              onChange={handleNumberChange('sellingPrice')}
              className="h-12 w-full rounded-lg border border-gray-200 pl-8 pr-3 text-lg text-gray-900 placeholder:text-gray-300 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              aria-label="판매가 입력"
            />
          </div>
        </div>

        {/* 목표 원가율 */}
        <div>
          <label
            htmlFor="targetCostRate"
            className="mb-1.5 block text-sm font-semibold text-gray-700"
          >
            목표 원가율
          </label>
          {/* 업종 프리셋 */}
          <div className="mb-2 flex flex-wrap gap-2">
            {PRESETS.map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => handlePreset(preset.rate)}
                className={cn(
                  'rounded-full px-3 py-1 text-xs font-medium transition-colors',
                  input.targetCostRate === preset.rate
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                )}
                aria-label={`${preset.label} 원가율 ${preset.rate}% 적용`}
              >
                {preset.label} ({preset.rate}%)
              </button>
            ))}
          </div>
          <div className="relative">
            <input
              id="targetCostRate"
              type="text"
              inputMode="decimal"
              placeholder="30"
              value={displayValues.targetCostRate}
              onChange={handleTargetRateChange}
              className="h-12 w-full rounded-lg border border-gray-200 pl-3 pr-8 text-lg text-gray-900 placeholder:text-gray-300 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              aria-label="목표 원가율 입력"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">%</span>
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

      {/* 계산 결과 */}
      {result && (
        <div className="rounded-xl bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-base font-bold text-gray-900">
            {input.menuName ? `${input.menuName} ` : ''}계산 결과
          </h2>

          <div className="space-y-3">
            {/* 현재 원가율 */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">현재 원가율</span>
              <span
                className={cn(
                  'text-2xl font-bold',
                  result.currentCostRate <= input.targetCostRate
                    ? 'text-green-600'
                    : result.currentCostRate <= input.targetCostRate + 10
                      ? 'text-amber-500'
                      : 'text-red-500'
                )}
              >
                {result.currentCostRate}%
              </span>
            </div>

            {/* 원가 이익 */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">원가 이익</span>
              <span
                className={cn(
                  'text-xl font-bold',
                  result.grossProfit >= 0 ? 'text-gray-900' : 'text-red-500'
                )}
              >
                ₩ {formatNumber(result.grossProfit)}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">총 이익률</span>
              <span className="text-base font-semibold text-gray-700">
                {result.grossProfitRate}%
              </span>
            </div>

            <hr className="border-gray-100" />

            {/* 권장 판매가 */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">
                권장 판매가 <span className="text-xs text-gray-400">(목표 {input.targetCostRate}%)</span>
              </span>
              <span className="text-xl font-bold text-blue-600">
                ₩ {formatNumber(result.recommendedPrice)}
              </span>
            </div>
          </div>

          {/* 진단 메시지 */}
          <div className={cn('mt-4 rounded-lg p-3 text-sm font-medium', diagnosisColors[result.diagnosisLevel])}>
            {result.diagnosis}
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
      )}

      {/* 업종별 적정 원가율 참고 */}
      <div className="rounded-xl bg-white p-5 shadow-sm">
        <h2 className="mb-3 text-sm font-bold text-gray-900">업종별 적정 원가율</h2>
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex justify-between">
            <span>일반 식당</span>
            <span className="font-medium text-gray-900">30~35%</span>
          </div>
          <div className="flex justify-between">
            <span>카페·음료</span>
            <span className="font-medium text-gray-900">20~30%</span>
          </div>
          <div className="flex justify-between">
            <span>패스트푸드</span>
            <span className="font-medium text-gray-900">25~35%</span>
          </div>
          <div className="flex justify-between">
            <span>베이커리·제과</span>
            <span className="font-medium text-gray-900">35~45%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
