'use client';

import { useState, useCallback, useMemo } from 'react';
import { RotateCcw, Copy, Check } from 'lucide-react';
import { calculateVat } from './calculation';
import { formatNumber, parseNumber } from '@/lib/format';
import { cn } from '@/lib/utils';
import type { VatDirection } from './types';

/** 탭 옵션 */
const DIRECTION_OPTIONS: { value: VatDirection; label: string }[] = [
  { value: 'toTotal', label: '공급가액 → 합계' },
  { value: 'toSupply', label: '합계 → 공급가액' },
];

/** 방향별 입력 라벨 */
const INPUT_LABELS: Record<VatDirection, string> = {
  toTotal: '공급가액',
  toSupply: '합계 금액 (VAT 포함)',
};

export default function VatCalculator() {
  const [direction, setDirection] = useState<VatDirection>('toTotal');
  const [amount, setAmount] = useState(0);
  const [displayAmount, setDisplayAmount] = useState('');
  const [copied, setCopied] = useState(false);

  /** 금액 입력 핸들러 */
  const handleAmountChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value;
      const num = parseNumber(raw);
      setDisplayAmount(
        num > 0 ? formatNumber(num) : raw.replace(/[^0-9]/g, '')
      );
      setAmount(num);
    },
    []
  );

  /** 방향 변경 핸들러 */
  const handleDirectionChange = useCallback((value: VatDirection) => {
    setDirection(value);
    setCopied(false);
  }, []);

  /** 초기화 */
  const handleReset = useCallback(() => {
    setDirection('toTotal');
    setAmount(0);
    setDisplayAmount('');
    setCopied(false);
  }, []);

  /** 계산 결과 (실시간) */
  const result = useMemo(() => {
    if (amount <= 0) return null;
    return calculateVat({ direction, amount });
  }, [direction, amount]);

  /** 결과 복사 */
  const handleCopy = useCallback(async () => {
    if (!result) return;
    const text = `공급가액 ${formatNumber(result.supplyPrice)}원 / 부가세 ${formatNumber(result.vatAmount)}원 / 합계 ${formatNumber(result.totalPrice)}원`;

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* 클립보드 접근 불가 시 무시 */
    }
  }, [result]);

  return (
    <div className="space-y-5">
      {/* 방향 선택 탭 */}
      <div className="grid grid-cols-2 gap-2">
        {DIRECTION_OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => handleDirectionChange(option.value)}
            className={cn(
              'flex min-h-[44px] items-center justify-center rounded-lg px-3 text-sm font-semibold transition-colors',
              direction === option.value
                ? 'bg-blue-600 text-white'
                : 'border border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
            )}
            aria-label={`${option.label} 방향 선택`}
            aria-pressed={direction === option.value}
          >
            {option.label}
          </button>
        ))}
      </div>

      {/* 금액 입력 영역 */}
      <div className="rounded-xl bg-white p-5 shadow-sm">
        <label
          htmlFor="vat-amount"
          className="mb-1.5 block text-sm font-semibold text-gray-700"
        >
          {INPUT_LABELS[direction]} <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            ₩
          </span>
          <input
            id="vat-amount"
            type="text"
            inputMode="numeric"
            placeholder="0"
            value={displayAmount}
            onChange={handleAmountChange}
            className="h-12 w-full rounded-lg border border-gray-200 pl-8 pr-3 text-lg text-gray-900 placeholder:text-gray-300 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            aria-label={`${INPUT_LABELS[direction]} 입력`}
          />
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
            계산 결과
          </h2>

          <div className="space-y-3">
            {/* 공급가액 */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">공급가액</span>
              <span className="text-lg font-semibold text-gray-900">
                ₩ {formatNumber(result.supplyPrice)}
              </span>
            </div>

            {/* 부가세 */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">부가세 (10%)</span>
              <span className="text-lg font-semibold text-gray-900">
                ₩ {formatNumber(result.vatAmount)}
              </span>
            </div>

            <hr className="border-gray-100" />

            {/* 합계 */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">합계</span>
              <span className="text-2xl font-bold text-gray-900">
                ₩ {formatNumber(result.totalPrice)}
              </span>
            </div>
          </div>

          {/* 결과 복사 */}
          <button
            type="button"
            onClick={handleCopy}
            className="mt-5 flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-blue-600 text-sm font-medium text-white hover:bg-blue-700"
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
