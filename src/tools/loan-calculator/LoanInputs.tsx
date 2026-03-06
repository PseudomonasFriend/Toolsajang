'use client';

import { RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { LoanInput, RepaymentType } from './types';

/** 표시용 문자열 타입 */
export interface LoanDisplayValues {
  principal: string;
  annualRate: string;
  loanMonths: string;
}

interface LoanInputsProps {
  input: LoanInput;
  displayValues: LoanDisplayValues;
  onCurrencyChange: (field: 'principal') => (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRateChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onMonthsChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRepaymentType: (type: RepaymentType) => void;
  onReset: () => void;
}

/** 대출이자 계산기 입력 UI */
export function LoanInputs({
  input,
  displayValues,
  onCurrencyChange,
  onRateChange,
  onMonthsChange,
  onRepaymentType,
  onReset,
}: LoanInputsProps) {
  return (
    <>
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
              onChange={onCurrencyChange('principal')}
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
              onChange={onRateChange}
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
              onChange={onMonthsChange}
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
              onClick={() => onRepaymentType('equalPayment')}
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
              onClick={() => onRepaymentType('equalPrincipal')}
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
        onClick={onReset}
        className="flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-600 hover:bg-gray-50"
        aria-label="입력값 초기화"
      >
        <RotateCcw className="h-4 w-4" />
        초기화
      </button>
    </>
  );
}
