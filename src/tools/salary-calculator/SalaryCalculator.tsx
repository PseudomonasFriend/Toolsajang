'use client';

import { useState, useCallback, useMemo } from 'react';
import { calculateSalary } from './calculation';
import { formatNumber, parseNumber } from '@/lib/format';
import { SalaryInputs } from './SalaryInputs';
import { SalaryResult } from './SalaryResult';
import type { SalaryInput } from './types';

/** 초기 입력값 */
const initialInput: SalaryInput = {
  monthlySalary: 0,
  dependents: 1,
};

export default function SalaryCalculator() {
  const [input, setInput] = useState<SalaryInput>(initialInput);
  const [copied, setCopied] = useState(false);
  const [displaySalary, setDisplaySalary] = useState('');

  /** 월 급여 변경 핸들러 */
  const handleSalaryChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value;
      const num = parseNumber(raw);
      setDisplaySalary(
        num > 0 ? formatNumber(num) : raw.replace(/[^0-9]/g, '')
      );
      setInput((prev) => ({ ...prev, monthlySalary: num }));
    },
    []
  );

  /** 부양가족 수 변경 핸들러 */
  const handleDependentsChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value;
      const num = parseInt(raw, 10);
      if (raw === '') {
        setInput((prev) => ({ ...prev, dependents: 1 }));
        return;
      }
      if (!isNaN(num)) {
        const clamped = Math.min(20, Math.max(1, num));
        setInput((prev) => ({ ...prev, dependents: clamped }));
      }
    },
    []
  );

  /** 초기화 */
  const handleReset = useCallback(() => {
    setInput(initialInput);
    setDisplaySalary('');
    setCopied(false);
  }, []);

  /** 계산 결과 (실시간) */
  const result = useMemo(() => {
    if (input.monthlySalary <= 0) return null;
    return calculateSalary(input);
  }, [input]);

  /** 결과 복사 */
  const handleCopy = useCallback(async () => {
    if (!result) return;
    const text = [
      `월급여 ₩${formatNumber(input.monthlySalary)}`,
      `실수령액 ₩${formatNumber(result.netSalary)}`,
      `공제합계 ₩${formatNumber(result.totalDeduction)}`,
      `사업주부담 ₩${formatNumber(result.totalEmployerCost)}`,
      `총인건비 ₩${formatNumber(result.totalLaborCost)}`,
    ].join(' / ');

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* 클립보드 접근 불가 시 무시 */
    }
  }, [result, input.monthlySalary]);

  return (
    <div className="space-y-5">
      <SalaryInputs
        displaySalary={displaySalary}
        dependents={input.dependents}
        onSalaryChange={handleSalaryChange}
        onDependentsChange={handleDependentsChange}
        onReset={handleReset}
      />

      {result && (
        <SalaryResult
          result={result}
          copied={copied}
          onCopy={handleCopy}
        />
      )}
    </div>
  );
}
