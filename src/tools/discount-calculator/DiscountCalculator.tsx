'use client';

import { useState, useCallback, useMemo } from 'react';
import { calculateDiscount } from './calculation';
import { formatNumber, parseNumber, formatPercent } from '@/lib/format';
import { DiscountInputs } from './DiscountInputs';
import { DiscountResult } from './DiscountResult';
import type { DiscountInput } from './types';
import type { DiscountDisplayValues } from './DiscountInputs';

/** 초기 입력값 */
const initialInput: DiscountInput = {
  originalPrice: 0,
  costPrice: 0,
  discountRate: 0,
};

/** 초기 표시 문자열 */
const initialDisplay: DiscountDisplayValues = {
  originalPrice: '',
  costPrice: '',
  discountRate: '',
};

export default function DiscountCalculator() {
  const [input, setInput] = useState<DiscountInput>(initialInput);
  const [copied, setCopied] = useState(false);
  const [displayValues, setDisplayValues] = useState<DiscountDisplayValues>(initialDisplay);

  /** 숫자 필드 변경 핸들러 */
  const handleNumberChange = useCallback(
    (field: keyof DiscountDisplayValues, isPercent = false) =>
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
    [],
  );

  /** 초기화 */
  const handleReset = useCallback(() => {
    setInput(initialInput);
    setDisplayValues(initialDisplay);
    setCopied(false);
  }, []);

  /** 계산 결과 (실시간) — 3개 필드 모두 입력 시 */
  const result = useMemo(() => {
    if (
      input.originalPrice <= 0 ||
      input.costPrice <= 0 ||
      input.discountRate <= 0
    ) {
      return null;
    }
    return calculateDiscount(input);
  }, [input]);

  /** 결과 복사 */
  const handleCopy = useCallback(async () => {
    if (!result) return;
    const text = `정상가 ₩${formatNumber(input.originalPrice)} (마진 ${formatPercent(result.originalMarginRate)}) → 할인 후 ₩${formatNumber(result.discountedPrice)} (마진 ${formatPercent(result.discountedMarginRate)}) / 마진 감소 ${formatPercent(result.marginDropRate)}`;

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* 클립보드 접근 불가 시 무시 */
    }
  }, [result, input.originalPrice]);

  const isLoss = result !== null && result.discountedMargin <= 0;

  return (
    <div className="space-y-5">
      <DiscountInputs
        displayValues={displayValues}
        onNumberChange={handleNumberChange}
        onReset={handleReset}
      />

      {result && (
        <DiscountResult
          result={result}
          originalPrice={input.originalPrice}
          isLoss={isLoss}
          copied={copied}
          onCopy={handleCopy}
        />
      )}
    </div>
  );
}
