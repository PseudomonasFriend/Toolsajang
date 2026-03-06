'use client';

import { useState, useCallback, useMemo } from 'react';
import { calculateLoan } from './calculation';
import { formatNumber, parseNumber } from '@/lib/format';
import { LoanInputs } from './LoanInputs';
import { LoanResult } from './LoanResult';
import type { LoanInput, RepaymentType } from './types';
import type { LoanDisplayValues } from './LoanInputs';

/** 초기 입력값 */
const initialInput: LoanInput = {
  principal: 0,
  annualRate: 0,
  loanMonths: 12,
  repaymentType: 'equalPayment',
};

/** 초기 표시값 */
const initialDisplay: LoanDisplayValues = {
  principal: '',
  annualRate: '',
  loanMonths: '12',
};

export default function LoanCalculator() {
  const [input, setInput] = useState<LoanInput>(initialInput);
  const [copied, setCopied] = useState(false);
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [displayValues, setDisplayValues] = useState<LoanDisplayValues>(initialDisplay);

  /** 원화 필드 변경 핸들러 */
  const handleCurrencyChange = useCallback(
    (field: 'principal') =>
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value;
        const num = parseNumber(raw);
        setDisplayValues((prev) => ({
          ...prev,
          [field]: num > 0 ? formatNumber(num) : raw.replace(/[^0-9]/g, ''),
        }));
        setInput((prev) => ({ ...prev, [field]: num }));
      },
    []
  );

  /** 퍼센트 필드 변경 핸들러 */
  const handleRateChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value;
      const cleaned = raw.replace(/[^0-9.]/g, '');
      setDisplayValues((prev) => ({ ...prev, annualRate: cleaned }));
      setInput((prev) => ({
        ...prev,
        annualRate: parseFloat(cleaned) || 0,
      }));
    },
    []
  );

  /** 기간(개월) 필드 변경 핸들러 */
  const handleMonthsChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value;
      const cleaned = raw.replace(/[^0-9]/g, '');
      setDisplayValues((prev) => ({ ...prev, loanMonths: cleaned }));
      setInput((prev) => ({
        ...prev,
        loanMonths: parseInt(cleaned, 10) || 0,
      }));
    },
    []
  );

  /** 상환 방식 변경 */
  const handleRepaymentType = useCallback((type: RepaymentType) => {
    setInput((prev) => ({ ...prev, repaymentType: type }));
  }, []);

  /** 초기화 */
  const handleReset = useCallback(() => {
    setInput(initialInput);
    setDisplayValues(initialDisplay);
    setCopied(false);
    setIsScheduleOpen(false);
  }, []);

  /** 계산 결과 (실시간) */
  const result = useMemo(() => {
    if (input.principal <= 0 || input.loanMonths <= 0) return null;
    return calculateLoan(input);
  }, [input]);

  /** 결과 복사 */
  const handleCopy = useCallback(async () => {
    if (!result) return;
    const text = `대출 ₩${formatNumber(input.principal)} / 연 ${input.annualRate}% / ${input.loanMonths}개월 / 월상환 ₩${formatNumber(result.monthlyPayment)} / 총이자 ₩${formatNumber(result.totalInterest)}`;

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* 클립보드 접근 불가 시 무시 */
    }
  }, [result, input.principal, input.annualRate, input.loanMonths]);

  return (
    <div className="space-y-5">
      <LoanInputs
        input={input}
        displayValues={displayValues}
        onCurrencyChange={handleCurrencyChange}
        onRateChange={handleRateChange}
        onMonthsChange={handleMonthsChange}
        onRepaymentType={handleRepaymentType}
        onReset={handleReset}
      />

      {result && (
        <LoanResult
          result={result}
          isEqualPrincipal={input.repaymentType === 'equalPrincipal'}
          isScheduleOpen={isScheduleOpen}
          copied={copied}
          onToggleSchedule={() => setIsScheduleOpen(!isScheduleOpen)}
          onCopy={handleCopy}
        />
      )}
    </div>
  );
}
