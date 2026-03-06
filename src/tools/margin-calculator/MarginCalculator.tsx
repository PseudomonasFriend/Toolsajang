'use client';

import { useState, useCallback, useMemo } from 'react';
import { calculateMargin } from './calculation';
import { formatNumber, parseNumber, formatPercent } from '@/lib/format';
import { MarginInputs } from './MarginInputs';
import { MarginResult } from './MarginResult';
import type { MarginInput } from './types';
import type { MarginDisplayValues } from './MarginInputs';

/** 초기 입력값 */
const initialInput: MarginInput = {
  sellingPrice: 0,
  costPrice: 0,
  commissionRate: 0,
  shippingCost: 0,
  otherCost: 0,
  includeVAT: false,
};

/** 초기 표시 문자열 */
const initialDisplay: MarginDisplayValues = {
  sellingPrice: '',
  costPrice: '',
  shippingCost: '',
  otherCost: '',
  commissionRate: '',
};

export default function MarginCalculator() {
  const [input, setInput] = useState<MarginInput>(initialInput);
  const [isExtraOpen, setIsExtraOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [displayValues, setDisplayValues] = useState<MarginDisplayValues>(initialDisplay);

  /** 숫자 필드 변경 핸들러 */
  const handleNumberChange = useCallback(
    (field: keyof MarginDisplayValues, isPercent = false) =>
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
    setDisplayValues(initialDisplay);
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
      <MarginInputs
        input={input}
        displayValues={displayValues}
        isExtraOpen={isExtraOpen}
        onNumberChange={handleNumberChange}
        onVATToggle={handleVATToggle}
        onToggleExtra={() => setIsExtraOpen(!isExtraOpen)}
        onReset={handleReset}
      />

      {result && (
        <MarginResult
          result={result}
          isLoss={isLoss}
          copied={copied}
          onCopy={handleCopy}
        />
      )}
    </div>
  );
}
