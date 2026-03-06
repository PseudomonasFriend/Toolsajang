'use client';

import { useState, useCallback, useMemo } from 'react';
import { calculateDeliveryFee, findBestPlatformIndex } from './calculation';
import { formatNumber } from '@/lib/format';
import { DeliveryFeeInputs } from './DeliveryFeeInputs';
import { DeliveryFeeResult } from './DeliveryFeeResult';
import type { DeliveryFeeInput } from './types';
import type { DeliveryFeeDisplayValues } from './DeliveryFeeInputs';

/** 초기 입력값 */
const initialInput: DeliveryFeeInput = {
  menuPrice: 0,
  menuCost: 0,
  deliveryFee: 0,
  additionalCost: 0,
};

/** 초기 표시 문자열 */
const initialDisplay: DeliveryFeeDisplayValues = {
  menuPrice: '',
  menuCost: '',
  deliveryFee: '',
  additionalCost: '',
};

export default function DeliveryFeeCalculator() {
  const [input, setInput] = useState<DeliveryFeeInput>(initialInput);
  const [customRate, setCustomRate] = useState(0);
  const [customRateDisplay, setCustomRateDisplay] = useState('');
  const [isExtraOpen, setIsExtraOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [displayValues, setDisplayValues] = useState<DeliveryFeeDisplayValues>(initialDisplay);

  /** 원화 필드 변경 핸들러 */
  const handleNumberChange = useCallback(
    (field: keyof DeliveryFeeDisplayValues) =>
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value;
        const num = parseInt(raw.replace(/[^0-9]/g, ''), 10) || 0;
        setDisplayValues((prev) => ({
          ...prev,
          [field]: num > 0 ? formatNumber(num) : raw.replace(/[^0-9]/g, ''),
        }));
        setInput((prev) => ({ ...prev, [field]: num }));
      },
    []
  );

  /** 직접 입력 수수료율 변경 핸들러 */
  const handleCustomRateChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value;
      const cleaned = raw.replace(/[^0-9.]/g, '');
      setCustomRateDisplay(cleaned);
      setCustomRate(parseFloat(cleaned) || 0);
    },
    []
  );

  /** 초기화 */
  const handleReset = useCallback(() => {
    setInput(initialInput);
    setDisplayValues(initialDisplay);
    setCustomRate(0);
    setCustomRateDisplay('');
    setCopied(false);
  }, []);

  /** 계산 결과 (실시간) */
  const results = useMemo(() => {
    if (input.menuPrice <= 0 && input.menuCost <= 0) return null;
    return calculateDeliveryFee(input, customRate);
  }, [input, customRate]);

  /** 가장 유리한 플랫폼 인덱스 */
  const bestIndex = useMemo(() => {
    if (!results) return -1;
    return findBestPlatformIndex(results);
  }, [results]);

  /** 결과 복사 */
  const handleCopy = useCallback(async () => {
    if (!results) return;

    // 배민, 쿠팡, 요기요 순이익만 포함 (직접 입력 제외)
    const platformTexts = results
      .filter((r) => r.platformId !== 'custom')
      .map((r) => {
        const shortName =
          r.platformId === 'baemin'
            ? '배민'
            : r.platformId === 'coupang'
              ? '쿠팡'
              : '요기요';
        return `${shortName} 순이익 ₩${formatNumber(r.netProfit)}`;
      });

    const text = `메뉴 ₩${formatNumber(input.menuPrice)} / ${platformTexts.join(' / ')}`;

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* 클립보드 접근 불가 시 무시 */
    }
  }, [results, input.menuPrice]);

  return (
    <div className="space-y-5">
      <DeliveryFeeInputs
        displayValues={displayValues}
        isExtraOpen={isExtraOpen}
        onNumberChange={handleNumberChange}
        onToggleExtra={() => setIsExtraOpen(!isExtraOpen)}
        onReset={handleReset}
      />

      {results && (
        <DeliveryFeeResult
          results={results}
          bestIndex={bestIndex}
          customRateDisplay={customRateDisplay}
          copied={copied}
          onCustomRateChange={handleCustomRateChange}
          onCopy={handleCopy}
        />
      )}
    </div>
  );
}
