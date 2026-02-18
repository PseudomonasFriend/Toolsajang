'use client';

import { useState, useCallback, useMemo } from 'react';
import { ChevronDown, ChevronUp, RotateCcw, Copy, Check } from 'lucide-react';
import { calculateLoan } from './calculation';
import { formatNumber, parseNumber } from '@/lib/format';
import { cn } from '@/lib/utils';
import type { LoanInput, RepaymentType } from './types';

/** 초기 입력값 */
const initialInput: LoanInput = {
  principal: 0,
  annualRate: 0,
  loanMonths: 12,
  repaymentType: 'equalPayment',
};

/** 초기 표시값 */
const initialDisplay = {
  principal: '',
  annualRate: '',
  loanMonths: '12',
};

export default function LoanCalculator() {
  const [input, setInput] = useState<LoanInput>(initialInput);
  const [copied, setCopied] = useState(false);
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);

  // 표시용 문자열 (콤마 포맷)
  const [displayValues, setDisplayValues] = useState(initialDisplay);

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

  /** 원금균등 여부 */
  const isEqualPrincipal = input.repaymentType === 'equalPrincipal';

  return (
    <div className="space-y-5">
      {/* 입력 영역 */}
      <div className="space-y-4 rounded-xl bg-white p-5 shadow-sm">
        {/* 대출 원금 */}
        <div>
          <label
            htmlFor="principal"
            className="mb-1.5 block text-sm font-semibold text-gray-700"
          >
            대출 원금 <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              ₩
            </span>
            <input
              id="principal"
              type="text"
              inputMode="numeric"
              placeholder="0"
              value={displayValues.principal}
              onChange={handleCurrencyChange('principal')}
              className="h-12 w-full rounded-lg border border-gray-200 pl-8 pr-3 text-lg text-gray-900 placeholder:text-gray-300 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              aria-label="대출 원금 입력"
            />
          </div>
        </div>

        {/* 연 이자율 */}
        <div>
          <label
            htmlFor="annualRate"
            className="mb-1.5 block text-sm font-semibold text-gray-700"
          >
            연 이자율 <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              id="annualRate"
              type="text"
              inputMode="decimal"
              placeholder="0"
              value={displayValues.annualRate}
              onChange={handleRateChange}
              className="h-12 w-full rounded-lg border border-gray-200 pl-3 pr-8 text-lg text-gray-900 placeholder:text-gray-300 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              aria-label="연 이자율 입력"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              %
            </span>
          </div>
        </div>

        {/* 대출 기간 */}
        <div>
          <label
            htmlFor="loanMonths"
            className="mb-1.5 block text-sm font-semibold text-gray-700"
          >
            대출 기간 <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              id="loanMonths"
              type="text"
              inputMode="numeric"
              placeholder="12"
              value={displayValues.loanMonths}
              onChange={handleMonthsChange}
              className="h-12 w-full rounded-lg border border-gray-200 pl-3 pr-12 text-lg text-gray-900 placeholder:text-gray-300 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              aria-label="대출 기간 입력"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              개월
            </span>
          </div>
        </div>

        {/* 상환 방식 */}
        <div>
          <span className="mb-1.5 block text-sm font-semibold text-gray-700">
            상환 방식
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleRepaymentType('equalPayment')}
              className={cn(
                'flex min-h-[44px] items-center justify-center rounded-lg text-sm font-medium transition-colors',
                input.repaymentType === 'equalPayment'
                  ? 'bg-blue-600 text-white'
                  : 'border border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
              )}
              aria-label="원리금균등 상환 방식 선택"
              aria-pressed={input.repaymentType === 'equalPayment'}
            >
              원리금균등
            </button>
            <button
              type="button"
              onClick={() => handleRepaymentType('equalPrincipal')}
              className={cn(
                'flex min-h-[44px] items-center justify-center rounded-lg text-sm font-medium transition-colors',
                input.repaymentType === 'equalPrincipal'
                  ? 'bg-blue-600 text-white'
                  : 'border border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
              )}
              aria-label="원금균등 상환 방식 선택"
              aria-pressed={input.repaymentType === 'equalPrincipal'}
            >
              원금균등
            </button>
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
        <div className="space-y-5">
          {/* 결과 요약 카드 */}
          <div className="rounded-xl bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-base font-bold text-gray-900">
              계산 결과
            </h2>

            <div className="space-y-3">
              {/* 월 상환액 */}
              <div className="flex items-baseline justify-between">
                <span className="text-sm text-gray-600">
                  월 상환액
                  {isEqualPrincipal && (
                    <span className="ml-1 text-xs text-gray-400">
                      (첫 달 기준)
                    </span>
                  )}
                </span>
                <span className="text-2xl font-bold text-gray-900">
                  ₩ {formatNumber(result.monthlyPayment)}
                </span>
              </div>

              <hr className="border-gray-100" />

              {/* 총 상환액 */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">총 상환액</span>
                <span className="text-sm text-gray-700">
                  ₩ {formatNumber(result.totalPayment)}
                </span>
              </div>

              {/* 총 이자 */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">총 이자</span>
                <span className="text-sm font-semibold text-red-500">
                  ₩ {formatNumber(result.totalInterest)}
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

          {/* 상환 스케줄 테이블 (접이식) */}
          <div className="rounded-xl bg-white shadow-sm">
            <button
              type="button"
              onClick={() => setIsScheduleOpen(!isScheduleOpen)}
              className="flex h-12 w-full items-center justify-between px-5 text-sm font-semibold text-gray-700"
              aria-expanded={isScheduleOpen}
              aria-controls="schedule-section"
            >
              <span>상환 스케줄</span>
              {isScheduleOpen ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>

            {isScheduleOpen && (
              <div
                id="schedule-section"
                className="max-h-[400px] overflow-y-auto border-t border-gray-100"
              >
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50 text-left text-xs text-gray-500">
                      <th className="px-3 py-2 text-center">회차</th>
                      <th className="px-3 py-2 text-right">상환액</th>
                      <th className="px-3 py-2 text-right">원금</th>
                      <th className="px-3 py-2 text-right">이자</th>
                      <th className="px-3 py-2 text-right">잔액</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.schedule.map((row) => (
                      <tr
                        key={row.month}
                        className={cn(
                          'border-b border-gray-100',
                          row.month % 2 === 0 && 'bg-gray-50'
                        )}
                      >
                        <td className="px-3 py-2 text-center text-gray-600">
                          {row.month}
                        </td>
                        <td className="px-3 py-2 text-right text-gray-900">
                          {formatNumber(row.payment)}
                        </td>
                        <td className="px-3 py-2 text-right text-gray-700">
                          {formatNumber(row.principalPart)}
                        </td>
                        <td className="px-3 py-2 text-right text-gray-700">
                          {formatNumber(row.interestPart)}
                        </td>
                        <td className="px-3 py-2 text-right text-gray-700">
                          {formatNumber(row.balance)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
