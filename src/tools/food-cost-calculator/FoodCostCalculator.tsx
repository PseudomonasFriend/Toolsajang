'use client';

import { useState, useCallback, useMemo } from 'react';
import { calculateFoodCost } from './calculation';
import { formatNumber, parseNumber } from '@/lib/format';
import { FoodCostInputs } from './FoodCostInputs';
import { FoodCostResult } from './FoodCostResult';
import type { FoodCostInput } from './types';
import type { FoodCostDisplayValues } from './FoodCostInputs';

/** 초기 입력값 */
const initialInput: FoodCostInput = {
  menuName: '',
  ingredientCost: 0,
  sellingPrice: 0,
  targetCostRate: 30,
};

/** 초기 표시 문자열 */
const initialDisplay: FoodCostDisplayValues = {
  ingredientCost: '',
  sellingPrice: '',
  targetCostRate: '30',
};

export default function FoodCostCalculator() {
  const [input, setInput] = useState<FoodCostInput>(initialInput);
  const [displayValues, setDisplayValues] = useState<FoodCostDisplayValues>(initialDisplay);
  const [copied, setCopied] = useState(false);

  /** 메뉴 이름 변경 핸들러 */
  const handleMenuNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setInput((prev) => ({ ...prev, menuName: e.target.value }));
    },
    []
  );

  /** 숫자 입력 핸들러 */
  const handleNumberChange = useCallback(
    (field: 'ingredientCost' | 'sellingPrice') =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const num = parseNumber(e.target.value);
      setDisplayValues((prev) => ({
        ...prev,
        [field]: num > 0 ? formatNumber(num) : e.target.value.replace(/[^0-9]/g, ''),
      }));
      setInput((prev) => ({ ...prev, [field]: num }));
    },
    []
  );

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
    setDisplayValues(initialDisplay);
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

  return (
    <div className="space-y-5">
      <FoodCostInputs
        menuName={input.menuName}
        targetCostRate={input.targetCostRate}
        displayValues={displayValues}
        onMenuNameChange={handleMenuNameChange}
        onNumberChange={handleNumberChange}
        onTargetRateChange={handleTargetRateChange}
        onPreset={handlePreset}
        onReset={handleReset}
      />

      {result && (
        <FoodCostResult
          result={result}
          menuName={input.menuName}
          targetCostRate={input.targetCostRate}
          copied={copied}
          onCopy={handleCopy}
        />
      )}
    </div>
  );
}
